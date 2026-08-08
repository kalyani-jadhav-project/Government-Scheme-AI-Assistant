package com.govassist.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String message;
    private String schemeContext; // optional scheme name for context
}
