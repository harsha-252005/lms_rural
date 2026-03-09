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

    private final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateQuestions(String topic, int count) {
        if ("YOUR_GEMINI_API_KEY".equals(apiKey) || apiKey.isEmpty()) {
            return null;
        }

        String prompt = String.format(
                "You are a school teacher creating a test. Generate exactly %d multiple choice questions specifically about '%s'. "
                        +
                        "The questions MUST be factual and directly related to '%s' - test actual knowledge about this specific topic. "
                        +
                        "Do NOT create generic questions like 'What is this topic?' or 'Why is this important?'. " +
                        "Create questions that test real facts, definitions, processes, and concepts about '%s'. " +
                        "Return ONLY a raw JSON array. Each object must have exactly these keys: " +
                        "'question' (string with the question text), 'options' (array of exactly 4 string answer choices), "
                        +
                        "'correctAnswer' (string that exactly matches one of the options). " +
                        "No markdown, no backticks, no explanation - only the JSON array.",
                count, topic, topic, topic);

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
                JsonNode candidates = root.path("candidates");
                if (candidates.isMissingNode() || candidates.isEmpty()) {
                    System.out.println("DEBUG_GEMINI: No candidates found in response: " + responseBody);
                    return null;
                }

                String text = candidates.get(0)
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
                    System.out.println("DEBUG_GEMINI: No JSON array found in text: " + text);
                    return null;
                }

                System.out.println("DEBUG_GEMINI: Final cleaned JSON: " + text);
                return text;
            } else {
                System.out.println("DEBUG_GEMINI: API returned status: " + response.getStatusCode());
                System.out.println("DEBUG_GEMINI: Error body: " + response.getBody());
            }
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.out.println("DEBUG_GEMINI: HTTP Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.out.println("DEBUG_GEMINI: Unexpected Error: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
}
