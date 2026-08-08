package com.govassist.service;

import com.govassist.dto.ChatRequest;
import com.govassist.dto.ChatResponse;
import com.govassist.dto.RecommendationResponse;
import com.govassist.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    @Value("${ai.gemini.api-key}")
    private String geminiApiKey;

    @Value("${ai.gemini.base-url}")
    private String geminiBaseUrl;

    @Value("${ai.gemini.model}")
    private String geminiModel;

    private final WebClient.Builder webClientBuilder;

    // ─── Chat with AI about schemes ───────────────────────────
    public ChatResponse chat(ChatRequest request, User user) {
        String systemContext = buildUserContext(user);
        String prompt = systemContext + "\n\nUser question: " + request.getMessage();

        if (request.getSchemeContext() != null && !request.getSchemeContext().isBlank()) {
            prompt += "\n\n(Context: User is asking about scheme: " + request.getSchemeContext() + ")";
        }

        String reply = callGemini(prompt);
        return ChatResponse.builder()
                .reply(reply)
                .schemeContext(request.getSchemeContext())
                .build();
    }

    // ─── Explain eligibility for a specific scheme ────────────
    public String explainEligibility(User user, RecommendationResponse rec) {
        String prompt = String.format("""
            You are a helpful government scheme advisor in India.
            
            User Profile:
            - Name: %s
            - Age: %s
            - Gender: %s
            - State: %s
            - Occupation: %s
            - Annual Income: ₹%s
            - Category: %s
            
            Scheme: %s
            Eligible: %s
            Eligibility Score: %s%%
            Reasons (if not eligible): %s
            Missing Documents: %s
            
            Please explain in simple Hindi/English whether this user is eligible for this scheme,
            what they need to do to apply, and if not eligible, what they can do to become eligible.
            Keep it friendly, concise, and in simple language (2-3 sentences).
            """,
            user.getName(), user.getAge(), user.getGender(), user.getState(),
            user.getOccupation(), user.getAnnualIncome(), user.getCategory(),
            rec.getSchemeName(), rec.getIsEligible(), rec.getEligibilityScore(),
            rec.getIneligibilityReasons(), rec.getMissingDocuments()
        );

        return callGemini(prompt);
    }

    // ─── Suggest alternative schemes ──────────────────────────
    public List<String> suggestAlternatives(User user, String schemeName, List<String> ineligibilityReasons) {
        String prompt = String.format("""
            A user with profile (Age: %s, Income: ₹%s, Category: %s, Occupation: %s, State: %s)
            is not eligible for scheme: "%s" due to: %s
            
            List 3 alternative Indian government schemes they might be eligible for.
            Return ONLY a comma-separated list of scheme names, nothing else.
            """,
            user.getAge(), user.getAnnualIncome(), user.getCategory(),
            user.getOccupation(), user.getState(), schemeName, ineligibilityReasons
        );

        String result = callGemini(prompt);
        if (result == null || result.isBlank()) return List.of();
        return List.of(result.split(",")).stream()
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();
    }

    // ─── Application guidance ─────────────────────────────────
    public ChatResponse getApplicationGuidance(String schemeName, User user) {
        String prompt = String.format("""
            You are a government scheme application guide for India.
            Help this user apply for: "%s"
            
            User's available documents: Aadhaar=%s, PAN=%s, Income Certificate=%s,
            Caste Certificate=%s, Ration Card=%s, Bank Passbook=%s
            
            Provide step-by-step application guide in simple English/Hindi.
            Include: where to apply (online/offline), what documents to carry,
            and any important tips. Keep it to 4-5 bullet points.
            """,
            schemeName,
            user.getHasAadhaar(), user.getHasPan(), user.getHasIncomeCertificate(),
            user.getHasCasteCertificate(), user.getHasRationCard(), user.getHasBankPassbook()
        );

        String reply = callGemini(prompt);
        return ChatResponse.builder().reply(reply).schemeContext(schemeName).build();
    }

    // ─── Internal: Call Gemini API ────────────────────────────
    private String callGemini(String prompt) {
        try {
            WebClient client = webClientBuilder.baseUrl(geminiBaseUrl).build();

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(Map.of("text", prompt)))
                )
            );

            Map response = client.post()
                    .uri("/models/" + geminiModel + ":generateContent?key=" + geminiApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("candidates")) {
                List candidates = (List) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    List parts = (List) content.get("parts");
                    if (!parts.isEmpty()) {
                        return ((Map<String, String>) parts.get(0)).get("text");
                    }
                }
            }
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
        }
        return "I'm unable to provide AI assistance at the moment. Please try again later.";
    }

    private String buildUserContext(User user) {
        return String.format("""
            You are GovAssist AI, a helpful assistant for Indian government schemes.
            
            Current user profile:
            - Name: %s, Age: %s, Gender: %s
            - State: %s, District: %s
            - Occupation: %s, Education: %s
            - Annual Income: ₹%s, Category: %s
            
            Answer questions about government schemes, eligibility, and application processes.
            Be helpful, accurate, and use simple language. Answer in English.
            """,
            user.getName(), user.getAge(), user.getGender(),
            user.getState(), user.getDistrict(),
            user.getOccupation(), user.getEducation(),
            user.getAnnualIncome(), user.getCategory()
        );
    }
}
