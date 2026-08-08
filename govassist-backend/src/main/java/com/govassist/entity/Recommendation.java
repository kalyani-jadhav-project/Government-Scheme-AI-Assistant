package com.govassist.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "scheme_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Column(name = "eligibility_score")
    private Integer eligibilityScore; // 0-100

    @Column(name = "is_eligible")
    @Builder.Default
    private Boolean isEligible = false;

    @Column(name = "ineligibility_reasons", columnDefinition = "TEXT")
    private String ineligibilityReasons; // JSON array string

    @Column(name = "missing_documents", columnDefinition = "TEXT")
    private String missingDocuments; // JSON array string

    @Column(name = "ai_explanation", columnDefinition = "TEXT")
    private String aiExplanation;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
