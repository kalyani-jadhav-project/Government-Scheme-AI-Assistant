package com.govassist.service;

import com.govassist.dto.RecommendationResponse;
import com.govassist.entity.*;
import com.govassist.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final SchemeRepository schemeRepository;
    private final RecommendationRepository recommendationRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public List<RecommendationResponse> generateRecommendations(User user) {
        List<Scheme> allSchemes = schemeRepository.findByIsActiveTrue();
        List<RecommendationResponse> responses = new ArrayList<>();

        // Delete old recommendations for user
        recommendationRepository.deleteAllByUserId(user.getId());

        for (Scheme scheme : allSchemes) {
            EligibilityResult result = checkEligibility(user, scheme);

            Recommendation rec = Recommendation.builder()
                    .user(user)
                    .scheme(scheme)
                    .isEligible(result.eligible)
                    .eligibilityScore(result.score)
                    .ineligibilityReasons(toJson(result.reasons))
                    .missingDocuments(toJson(result.missingDocs))
                    .build();

            recommendationRepository.save(rec);

            RecommendationResponse response = RecommendationResponse.builder()
                    .schemeId(scheme.getId())
                    .schemeName(scheme.getName())
                    .schemeDescription(scheme.getDescription())
                    .category(scheme.getCategory())
                    .ministry(scheme.getMinistry())
                    .schemeType(scheme.getSchemeType())
                    .benefits(scheme.getBenefits())
                    .officialLink(scheme.getOfficialLink())
                    .isEligible(result.eligible)
                    .eligibilityScore(result.score)
                    .ineligibilityReasons(result.reasons)
                    .missingDocuments(result.missingDocs)
                    .build();

            responses.add(response);
        }

        // Sort: eligible first, then by score descending
        responses.sort((a, b) -> {
            if (a.getIsEligible() && !b.getIsEligible()) return -1;
            if (!a.getIsEligible() && b.getIsEligible()) return 1;
            return Integer.compare(b.getEligibilityScore(), a.getEligibilityScore());
        });

        return responses;
    }

    // ======== RULE ENGINE ========
    private EligibilityResult checkEligibility(User user, Scheme scheme) {
        List<String> reasons = new ArrayList<>();
        List<String> missingDocs = new ArrayList<>();
        int totalCriteria = 0;
        int metCriteria = 0;

        // 1. Age check
        if (user.getAge() != null) {
            totalCriteria++;
            if (user.getAge() >= scheme.getMinAge() && user.getAge() <= scheme.getMaxAge()) {
                metCriteria++;
            } else {
                reasons.add("Age " + user.getAge() + " not in required range " + scheme.getMinAge() + "-" + scheme.getMaxAge());
            }
        }

        // 2. Gender check
        if (scheme.getGender() != null && !scheme.getGender().equals("ALL")) {
            totalCriteria++;
            if (scheme.getGender().equalsIgnoreCase(user.getGender())) {
                metCriteria++;
            } else {
                reasons.add("Scheme is for " + scheme.getGender() + " only");
            }
        }

        // 3. Income check
        if (scheme.getMaxIncome() != null && user.getAnnualIncome() != null) {
            totalCriteria++;
            if (user.getAnnualIncome().compareTo(scheme.getMaxIncome()) <= 0) {
                metCriteria++;
            } else {
                reasons.add("Annual income ₹" + user.getAnnualIncome() + " exceeds limit of ₹" + scheme.getMaxIncome());
            }
        }

        // 4. Category check
        if (scheme.getEligibleCategories() != null && !scheme.getEligibleCategories().isBlank()) {
            totalCriteria++;
            List<String> eligibleCats = Arrays.asList(scheme.getEligibleCategories().split(","));
            if (user.getCategory() != null && eligibleCats.contains(user.getCategory().trim())) {
                metCriteria++;
            } else {
                reasons.add("Category " + user.getCategory() + " not eligible. Required: " + scheme.getEligibleCategories());
            }
        }

        // 5. Occupation check
        if (scheme.getEligibleOccupations() != null && !scheme.getEligibleOccupations().isBlank()
                && !scheme.getEligibleOccupations().equals("ALL")) {
            totalCriteria++;
            List<String> eligibleOccs = Arrays.asList(scheme.getEligibleOccupations().split(","));
            if (user.getOccupation() != null && eligibleOccs.contains(user.getOccupation().trim())) {
                metCriteria++;
            } else {
                reasons.add("Occupation '" + user.getOccupation() + "' not eligible for this scheme");
            }
        }

        // 6. Document check
        if (scheme.getRequiredDocuments() != null && !scheme.getRequiredDocuments().isBlank()) {
            List<String> requiredDocs = Arrays.asList(scheme.getRequiredDocuments().split(","));
            for (String doc : requiredDocs) {
                totalCriteria++;
                String docKey = doc.trim();
                boolean hasDoc = userHasDocument(user, docKey);
                if (hasDoc) {
                    metCriteria++;
                } else {
                    missingDocs.add(getFriendlyDocName(docKey));
                    reasons.add("Missing document: " + getFriendlyDocName(docKey));
                }
            }
        }

        // Compute score
        int score = totalCriteria > 0 ? (int) Math.round((double) metCriteria / totalCriteria * 100) : 50;
        boolean eligible = reasons.isEmpty();

        return new EligibilityResult(eligible, score, reasons, missingDocs);
    }

    private boolean userHasDocument(User user, String docKey) {
        return switch (docKey.toUpperCase()) {
            case "AADHAAR" -> Boolean.TRUE.equals(user.getHasAadhaar());
            case "PAN" -> Boolean.TRUE.equals(user.getHasPan());
            case "INCOME_CERTIFICATE" -> Boolean.TRUE.equals(user.getHasIncomeCertificate());
            case "CASTE_CERTIFICATE" -> Boolean.TRUE.equals(user.getHasCasteCertificate());
            case "DOMICILE" -> Boolean.TRUE.equals(user.getHasDomicile());
            case "RATION_CARD" -> Boolean.TRUE.equals(user.getHasRationCard());
            case "BANK_PASSBOOK" -> Boolean.TRUE.equals(user.getHasBankPassbook());
            default -> false;
        };
    }

    private String getFriendlyDocName(String docKey) {
        return switch (docKey.toUpperCase()) {
            case "AADHAAR" -> "Aadhaar Card";
            case "PAN" -> "PAN Card";
            case "INCOME_CERTIFICATE" -> "Income Certificate";
            case "CASTE_CERTIFICATE" -> "Caste Certificate";
            case "DOMICILE" -> "Domicile Certificate";
            case "RATION_CARD" -> "Ration Card";
            case "BANK_PASSBOOK" -> "Bank Passbook";
            default -> docKey;
        };
    }

    private String toJson(List<String> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            return "[]";
        }
    }

    public List<String> fromJson(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public List<RecommendationResponse> getExistingRecommendations(Long userId) {
        List<Recommendation> recs = recommendationRepository.findByUserId(userId);
        List<RecommendationResponse> responses = new ArrayList<>();
        for (Recommendation rec : recs) {
            RecommendationResponse r = RecommendationResponse.builder()
                    .schemeId(rec.getScheme().getId())
                    .schemeName(rec.getScheme().getName())
                    .schemeDescription(rec.getScheme().getDescription())
                    .category(rec.getScheme().getCategory())
                    .ministry(rec.getScheme().getMinistry())
                    .schemeType(rec.getScheme().getSchemeType())
                    .benefits(rec.getScheme().getBenefits())
                    .officialLink(rec.getScheme().getOfficialLink())
                    .isEligible(rec.getIsEligible())
                    .eligibilityScore(rec.getEligibilityScore())
                    .ineligibilityReasons(fromJson(rec.getIneligibilityReasons()))
                    .missingDocuments(fromJson(rec.getMissingDocuments()))
                    .aiExplanation(rec.getAiExplanation())
                    .build();
            responses.add(r);
        }
        responses.sort((a, b) -> {
            if (a.getIsEligible() && !b.getIsEligible()) return -1;
            if (!a.getIsEligible() && b.getIsEligible()) return 1;
            return Integer.compare(b.getEligibilityScore(), a.getEligibilityScore());
        });
        return responses;
    }

    record EligibilityResult(boolean eligible, int score, List<String> reasons, List<String> missingDocs) {}
}
