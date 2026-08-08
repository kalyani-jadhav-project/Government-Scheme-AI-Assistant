package com.govassist.controller;

import com.govassist.dto.*;
import com.govassist.entity.User;
import com.govassist.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;
    private final UserService userService;
    private final RecommendationService recommendationService;

    // AI Chatbot
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChatRequest request) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(aiService.chat(request, user));
    }

    // Explain eligibility for a scheme
    @PostMapping("/explain")
    public ResponseEntity<Map<String, String>> explainEligibility(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody RecommendationResponse rec) {
        User user = userService.findByEmail(userDetails.getUsername());
        String explanation = aiService.explainEligibility(user, rec);
        return ResponseEntity.ok(Map.of("explanation", explanation));
    }

    // Get alternative scheme suggestions
    @PostMapping("/alternatives")
    public ResponseEntity<Map<String, List<String>>> getAlternatives(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body) {
        User user = userService.findByEmail(userDetails.getUsername());
        String schemeName = (String) body.get("schemeName");
        List<String> reasons = (List<String>) body.get("reasons");
        List<String> alternatives = aiService.suggestAlternatives(user, schemeName, reasons);
        return ResponseEntity.ok(Map.of("alternatives", alternatives));
    }

    // Application guidance
    @GetMapping("/guidance/{schemeName}")
    public ResponseEntity<ChatResponse> getGuidance(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String schemeName) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(aiService.getApplicationGuidance(schemeName, user));
    }
}
