package com.example.demo.api;

public record ContactRequest(
    String name,
    String email,
    String subject,
    String message,
    String category
) {}
