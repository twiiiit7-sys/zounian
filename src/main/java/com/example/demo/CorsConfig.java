package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
  private final List<String> allowedOrigins;

  public CorsConfig(@Value("${FRONTEND_ORIGINS:}") String frontendOrigins) {
    this.allowedOrigins = Arrays.stream(frontendOrigins.split(","))
        .map(String::trim)
        .filter(origin -> !origin.isEmpty())
        .collect(Collectors.toList());
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    var mapping = registry.addMapping("/api/**")
        .allowedMethods("GET", "POST", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(false);

    if (allowedOrigins.isEmpty()) {
      mapping.allowedOriginPatterns("*");
    } else {
      mapping.allowedOrigins(allowedOrigins.toArray(new String[0]));
    }
  }
}
