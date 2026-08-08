package com.govassist.repository;

import com.govassist.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    List<Scheme> findByIsActiveTrue();
    List<Scheme> findByCategoryAndIsActiveTrue(String category);
    List<Scheme> findBySchemeTypeAndIsActiveTrue(String schemeType);
}
