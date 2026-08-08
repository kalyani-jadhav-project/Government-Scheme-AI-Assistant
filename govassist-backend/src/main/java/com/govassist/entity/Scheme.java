package com.govassist.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "schemes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String category;

    @Column(length = 150)
    private String ministry;

    @Column(name = "scheme_type", length = 50)
    private String schemeType; // CENTRAL / STATE

    @Column(length = 100)
    private String state; // null for central

    @Column(name = "min_age")
    @Builder.Default
    private Integer minAge = 0;

    @Column(name = "max_age")
    @Builder.Default
    private Integer maxAge = 150;

    @Column(length = 10)
    @Builder.Default
    private String gender = "ALL";

    @Column(name = "max_income", precision = 12, scale = 2)
    private BigDecimal maxIncome;

    @Column(name = "eligible_occupations", columnDefinition = "TEXT")
    private String eligibleOccupations; // comma-separated

    @Column(name = "eligible_categories", columnDefinition = "TEXT")
    private String eligibleCategories; // comma-separated

    @Column(name = "eligible_education", length = 100)
    private String eligibleEducation;

    @Column(name = "required_documents", columnDefinition = "TEXT")
    private String requiredDocuments; // comma-separated

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "official_link", length = 500)
    private String officialLink;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
