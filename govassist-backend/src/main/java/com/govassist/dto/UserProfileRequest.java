package com.govassist.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileRequest {
    private Integer age;
    private String gender;
    private String state;
    private String district;
    private String occupation;
    private String education;
    private BigDecimal annualIncome;
    private String category;

    // Documents
    private Boolean hasAadhaar;
    private Boolean hasPan;
    private Boolean hasIncomeCertificate;
    private Boolean hasCasteCertificate;
    private Boolean hasDomicile;
    private Boolean hasRationCard;
    private Boolean hasBankPassbook;
}
