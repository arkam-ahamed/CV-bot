package com.arkam.cv_bot_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    public String analyzeCv(String cv, String jobDescription) {
        String promptText = """
            You are an expert technical recruiter and career coach for software engineers.
            Analyze the following CV and the following Job Description.

            CV:
            ---
            %s
            ---

            JOB DESCRIPTION:
            ---
            %s
            ---

            Perform the following analysis and provide the output in Markdown format:
            1. **Keyword Mismatch:** List the key technical skills and qualifications from the Job Description that are missing or not clearly visible in the CV.
            2. **Experience Rephrasing:** Suggest 2-3 improved bullet points for the CV's experience section that better align with the job description.
            3. **Summary Generation:** Write a new, tailored 4-sentence professional summary for the top of the CV.
            """.formatted(cv, jobDescription);

        RestTemplate restTemplate = new RestTemplate();

        // This is how this model requires the request body
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", promptText);
        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));
        contents.add(content);

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", contents);
        requestBody.put("generationConfig", generationConfig);


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    GEMINI_API_URL + apiKey,
                    request,
                    Map.class
            );

            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                var candidates = (java.util.List<Map<String, Object>>) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> candidateContent = (Map<String, Object>) candidate.get("content");
                    java.util.List<Map<String, Object>> parts = (java.util.List<Map<String, Object>>) candidateContent.get("parts");
                    if (!parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
            return "Failed to get a valid response from Gemini (no candidates or parts found).";

        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            return "Error calling Gemini API: " + e.getMessage();
        }
    }
}