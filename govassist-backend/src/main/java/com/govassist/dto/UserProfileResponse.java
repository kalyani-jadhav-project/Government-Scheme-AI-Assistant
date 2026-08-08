package com.govassist.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private Integer age;
    private String gender;
    private String state;
    private String district;
    private String occupation;
    private String education;
    private BigDecimal annualIncome;
    private String category;
    private Boolean hasAadhaar;
    private Boolean hasPan;
    private Boolean hasIncomeCertificate;
    private Boolean hasCasteCertificate;
    private Boolean hasDomicile;
    private Boolean hasRationCard;
    private Boolean hasBankPassbook;
    private Boolean profileCompleted;
    private LocalDateTime createdAt;
}
