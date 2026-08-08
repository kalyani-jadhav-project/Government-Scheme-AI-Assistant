package com.govassist.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 20)
    @Builder.Default
    private String role = "USER";

    private Integer age;

    @Column(length = 10)
    private String gender;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String district;

    @Column(length = 100)
    private String occupation;

    @Column(length = 100)
    private String education;

    @Column(name = "annual_income", precision = 12, scale = 2)
    private BigDecimal annualIncome;

    @Column(length = 50)
    private String category;

    // Documents
    @Column(name = "has_aadhaar")
    @Builder.Default
    private Boolean hasAadhaar = false;

    @Column(name = "has_pan")
    @Builder.Default
    private Boolean hasPan = false;

    @Column(name = "has_income_certificate")
    @Builder.Default
    private Boolean hasIncomeCertificate = false;

    @Column(name = "has_caste_certificate")
    @Builder.Default
    private Boolean hasCasteCertificate = false;

    @Column(name = "has_domicile")
    @Builder.Default
    private Boolean hasDomicile = false;

    @Column(name = "has_ration_card")
    @Builder.Default
    private Boolean hasRationCard = false;

    @Column(name = "has_bank_passbook")
    @Builder.Default
    private Boolean hasBankPassbook = false;

    @Column(name = "profile_completed")
    @Builder.Default
    private Boolean profileCompleted = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
