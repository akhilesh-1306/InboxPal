package com.email.email_assistant.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.email.email_assistant.model.EmailRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Value("${gemini.api.url}")
    private String apiUrl;
    @Value("${gemini.api.key}")
    private String apiKey;

    public String generateReply(EmailRequest email){
        // Build the prompt -> Craft request -> get response -> return response
        String prompt = buildPrompt(email);

        Map<String,Object> request = Map.of(
            "contents",new Object[]{
                Map.of(
                    "parts",new Object[]{
                        Map.of(
                            "text",prompt
                        )
                    }
                )
            }
        );
        
        String response = webClient.post().uri(apiUrl+apiKey).header("Content-Type", "application/json").retrieve().bodyToMono(String.class).block();

        return extractResponse(response);
    }

    public String buildPrompt(EmailRequest email){
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email. Please dont generate subject line");
        if(email.getTone() != null && !email.getTone().isEmpty()){
            prompt.append(" Use a").append(email.getTone()).append(" tone.");
        }
        prompt.append("\nOriginal email is : \n").append(email.getEmailContent());
        return prompt.toString();
    }

    public String extractResponse(String response){
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        }catch(JsonProcessingException e){
            return "Error generating reply";
        }
    }
}
