package com.example.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateQuestions(String topic, int count) {
        if ("YOUR_GEMINI_API_KEY".equals(apiKey) || apiKey.isEmpty()) {
            return null;
        }

        String prompt = String.format(
                "Generate %d multiple choice questions about '%s' for students. " +
                        "Return ONLY a raw JSON array of objects. " +
                        "CRITICAL: Use exactly these keys: 'question' (string), 'options' (array of 4 strings), 'correctAnswer' (string). "
                        +
                        "The 'correctAnswer' MUST be identical to one of the strings in the 'options' array. " +
                        "Do not include markdown tags, backticks, or any text other than the JSON array.",
                count, topic);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", Collections.singletonList(part));
            requestBody.put("contents", Collections.singletonList(content));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(API_URL + apiKey, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                String responseBody = response.getBody();
                System.out.println("DEBUG_GEMINI: Raw response length: "
                        + (responseBody != null ? responseBody.length() : "null"));

                JsonNode root = objectMapper.readTree(responseBody);
                String text = root.path("candidates")
                        .get(0)
                        .path("content")
                        .path("parts")
                        .get(0)
                        .path("text")
                        .asText();

                System.out.println("DEBUG_GEMINI: Extracted text: " + text);

                // Clean markdown and extract JSON array more robustly
                if (text.contains("[") && text.contains("]")) {
                    text = text.substring(text.indexOf("["), text.lastIndexOf("]") + 1);
                } else {
                    System.out.println("DEBUG_GEMINI: No JSON array found in text");
                    return null;
                }

                System.out.println("DEBUG_GEMINI: Final cleaned JSON: " + text);
                return text;
            } else {
                System.out.println("DEBUG_GEMINI: API returned status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("DEBUG_GEMINI: Error: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
}
