package com.govassist.service;

import com.govassist.entity.Scheme;
import com.govassist.repository.SchemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchemeService {

    private final SchemeRepository schemeRepository;

    public List<Scheme> getAllActiveSchemes() {
        return schemeRepository.findByIsActiveTrue();
    }

    public List<Scheme> getSchemesByCategory(String category) {
        return schemeRepository.findByCategoryAndIsActiveTrue(category);
    }

    public Scheme getSchemeById(Long id) {
        return schemeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheme not found: " + id));
    }

    public Scheme saveScheme(Scheme scheme) {
        return schemeRepository.save(scheme);
    }
}
