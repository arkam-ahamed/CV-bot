package com.arkam.cv_bot_backend.controller;

import com.arkam.cv_bot_backend.dto.AnalyzeRequest;
import com.arkam.cv_bot_backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cv")
@CrossOrigin(origins = "http://localhost:3000") // IMPORTANT: Make sure this matches your React app's URL
public class CVAnalyzerController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/analyze")
    public ResponseEntity<String> analyze(@RequestBody AnalyzeRequest request) {
        try {
            String result = geminiService.analyzeCv(request.cvText(), request.jobDescriptionText());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}