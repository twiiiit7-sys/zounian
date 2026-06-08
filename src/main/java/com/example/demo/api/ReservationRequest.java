package com.example.demo.api;

public record ReservationRequest(
    String course,
    String date,
    String time,
    Integer guests,
    String name,
    String email,
    String phone,
    String note
) {}
