package com.example.demo.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {
  private final JsonRecordStore store;

  public ApiController(JsonRecordStore store) {
    this.store = store;
  }

  @GetMapping("/health")
  public Map<String, Object> health() {
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("status", "ok");
    response.put("service", "zounian-api");
    response.put("timestamp", java.time.Instant.now().toString());
    return response;
  }

  @PostMapping("/reservations")
  public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) throws IOException {
    if (!isValidReservation(request)) {
      return ResponseEntity.badRequest().body(Map.of(
          "ok", false,
          "message", "Invalid reservation payload."
      ));
    }

    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("course", request.course().trim());
    payload.put("date", request.date().trim());
    payload.put("time", request.time().trim());
    payload.put("guests", request.guests());
    payload.put("name", request.name().trim());
    payload.put("email", request.email().trim());
    payload.put("phone", request.phone().trim());
    payload.put("note", request.note() == null ? "" : request.note().trim());

    JsonRecordStore.StoredRecord stored = store.append("reservations.json", payload);
    System.out.println("[reservation] " + stored.value());

    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
        "ok", true,
        "message", "Reservation received.",
        "reservationId", stored.id()
    ));
  }

  @PostMapping("/contact")
  public ResponseEntity<?> createContact(@RequestBody ContactRequest request) throws IOException {
    if (!isValidContact(request)) {
      return ResponseEntity.badRequest().body(Map.of(
          "ok", false,
          "message", "Invalid contact payload."
      ));
    }

    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("name", request.name().trim());
    payload.put("email", request.email().trim());
    payload.put("subject", request.subject().trim());
    payload.put("message", request.message().trim());
    payload.put("category", request.category() == null ? "" : request.category().trim());

    JsonRecordStore.StoredRecord stored = store.append("contacts.json", payload);
    System.out.println("[contact] " + stored.value());

    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
        "ok", true,
        "message", "Contact message received.",
        "contactId", stored.id()
    ));
  }

  private boolean isValidReservation(ReservationRequest request) {
    return request != null
        && StringUtils.hasText(request.course())
        && StringUtils.hasText(request.date())
        && StringUtils.hasText(request.time())
        && request.guests() != null
        && request.guests() >= 1
        && request.guests() <= 8
        && StringUtils.hasText(request.name())
        && isValidEmail(request.email())
        && StringUtils.hasText(request.phone());
  }

  private boolean isValidContact(ContactRequest request) {
    return request != null
        && StringUtils.hasText(request.name())
        && isValidEmail(request.email())
        && StringUtils.hasText(request.category())
        && StringUtils.hasText(request.subject())
        && StringUtils.hasText(request.message());
  }

  private boolean isValidEmail(String value) {
    return value != null && value.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
  }
}
