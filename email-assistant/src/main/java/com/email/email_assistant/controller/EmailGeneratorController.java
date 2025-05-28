package com.email.email_assistant.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.email.email_assistant.model.EmailRequest;
import com.email.email_assistant.service.EmailGeneratorService;


@RestController
@RequestMapping("/api/email-generator")
@CrossOrigin(origins = "*")
public class EmailGeneratorController {
    
    private final EmailGeneratorService emailGeneratorService;

    public EmailGeneratorController(EmailGeneratorService emailGeneratorService) {
        this.emailGeneratorService = emailGeneratorService;
    }

    @GetMapping("/")
    public String index() {
        return "Email Assistant API";
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest email) {
        String response = emailGeneratorService.generateReply(email);
        return ResponseEntity.ok(response);
    }
}
