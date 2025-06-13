package com.arkam.cv_bot_backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/cv")
public class ModelController {

    @Value("${gemini.api.key}") String apiKey;
    private final String LIST_MODELS_URL = "https://generativelanguage.googleapis.com/v1beta/models?key=";

    @GetMapping("/models")
    public ResponseEntity<Object> listModels() {
        RestTemplate rest = new RestTemplate();
        return rest.getForEntity(LIST_MODELS_URL + apiKey, Object.class);
    }
}

