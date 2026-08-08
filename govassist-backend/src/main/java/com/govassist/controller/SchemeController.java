package com.govassist.controller;

import com.govassist.dto.RecommendationResponse;
import com.govassist.entity.User;
import com.govassist.service.RecommendationService;
import com.govassist.service.SchemeService;
import com.govassist.service.UserService;
import com.govassist.entity.Scheme;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
@RequiredArgsConstructor
public class SchemeController {

    private final SchemeService schemeService;
    private final RecommendationService recommendationService;
    private final UserService userService;

    // Public endpoint - all active schemes
    @GetMapping("/all")
    public ResponseEntity<List<Scheme>> getAllSchemes() {
        return ResponseEntity.ok(schemeService.getAllActiveSchemes());
    }

    // Get single scheme
    @GetMapping("/{id}")
    public ResponseEntity<Scheme> getScheme(@PathVariable Long id) {
        return ResponseEntity.ok(schemeService.getSchemeById(id));
    }

    // Generate fresh recommendations for logged-in user
    @PostMapping("/recommend")
    public ResponseEntity<List<RecommendationResponse>> generateRecommendations(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        List<RecommendationResponse> recs = recommendationService.generateRecommendations(user);
        return ResponseEntity.ok(recs);
    }

    // Get existing recommendations
    @GetMapping("/recommendations")
    public ResponseEntity<List<RecommendationResponse>> getRecommendations(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        List<RecommendationResponse> recs = recommendationService.getExistingRecommendations(user.getId());
        return ResponseEntity.ok(recs);
    }

    // Admin: Add scheme
    @PostMapping("/admin/add")
    public ResponseEntity<Scheme> addScheme(@RequestBody Scheme scheme) {
        return ResponseEntity.ok(schemeService.saveScheme(scheme));
    }
}
