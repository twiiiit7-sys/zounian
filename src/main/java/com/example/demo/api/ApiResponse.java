package com.example.demo.api;

public record ApiResponse(
    boolean ok,
    String message,
    String id
) {}
