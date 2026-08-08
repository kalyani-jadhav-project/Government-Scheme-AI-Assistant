package com.govassist.repository;

import com.govassist.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByUserId(Long userId);
    List<Recommendation> findByUserIdAndIsEligibleTrue(Long userId);
    List<Recommendation> findByUserIdAndIsEligibleFalse(Long userId);
    Optional<Recommendation> findByUserIdAndSchemeId(Long userId, Long schemeId);
    void deleteAllByUserId(Long userId);
}
