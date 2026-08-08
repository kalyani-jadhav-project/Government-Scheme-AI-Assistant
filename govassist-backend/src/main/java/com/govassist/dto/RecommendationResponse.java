package com.govassist.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationResponse {
    private Long schemeId;
    private String schemeName;
    private String schemeDescription;
    private String category;
    private String ministry;
    private String schemeType;
    private String benefits;
    private String officialLink;
    private Boolean isEligible;
    private Integer eligibilityScore;
    private List<String> ineligibilityReasons;
    private List<String> missingDocuments;
    private String aiExplanation;
    private List<String> alternativeSchemes;
}
