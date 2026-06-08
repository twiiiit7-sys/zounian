package com.example.demo.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class JsonRecordStore {
  private final ObjectMapper objectMapper;
  private final Path dataDir;

  public JsonRecordStore(
      ObjectMapper objectMapper,
      @Value("${DATA_DIR:./data}") String dataDir) {
    this.objectMapper = objectMapper;
    this.dataDir = Path.of(dataDir).toAbsolutePath().normalize();
  }

  public StoredRecord append(String fileName, Map<String, Object> payload) throws IOException {
    Files.createDirectories(dataDir);
    Path filePath = dataDir.resolve(fileName);

    List<Map<String, Object>> records = new ArrayList<>();
    if (Files.exists(filePath)) {
      byte[] bytes = Files.readAllBytes(filePath);
      if (bytes.length > 0) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> parsed = objectMapper.readValue(bytes, List.class);
        if (parsed != null) {
          records.addAll(parsed);
        }
      }
    }

    String id = UUID.randomUUID().toString();
    Map<String, Object> record = new java.util.LinkedHashMap<>();
    record.put("id", id);
    record.put("receivedAt", Instant.now().toString());
    record.putAll(payload);
    records.add(record);

    Files.writeString(
        filePath,
        objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(records),
        StandardCharsets.UTF_8);

    return new StoredRecord(id, record);
  }

  public record StoredRecord(String id, Map<String, Object> value) {}
}
