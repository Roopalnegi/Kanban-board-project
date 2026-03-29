package com.kanbanServices.suggestionServices.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kanbanServices.suggestionServices.exception.FailedToGenerateSuggestionException;
import com.kanbanServices.suggestionServices.proxy.VertexAIClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class SuggestionServiceImpl implements SuggestionService {

    private VertexAIClient aiClient;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    @Autowired
    public SuggestionServiceImpl(VertexAIClient aiClient) {
        this.aiClient = aiClient;
    }

    @Override
    public List<String> getSuggestions(String prompt) throws JsonProcessingException, FailedToGenerateSuggestionException {

        if (prompt == null || prompt.isBlank()) {
            throw new FailedToGenerateSuggestionException("Prompt cannot be empty");
        }


        // prompt is modified to get accurate reuslt
        String modifiedPrompt = """
                    You are an intelligent assistant for a Kanban board application.
                    The user will provide an input that could be related to:
                    - a board title,
                    - a board description,
                    - a task title, or
                    - a task description
                
                    Generate at least 10 short, creative, and relevant suggestions for the given input.
                
                    If the input looks like a description request, make sure each suggestion is concise and under 50 characters.
                    Return only a pure JSON array of strings without markdown formatting or explanations.
                    The response must start with '[' and end with ']'.
                
                    Example:
                    ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5", "Idea 6", "Idea 7", "Idea 8", "Idea 9", "Idea 10"]
                
                    Input: "%s"
                """.formatted(prompt);


        // request body
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of(
                                                "text", modifiedPrompt
                                        )
                                )
                        )
                )
        );


        // call gemini via feign client
        String response = aiClient.generateContent(
                model,
                apiKey,
                requestBody
        );

        // parse json array from response
        return parseJsonArray(response);
    }


    private List<String> parseJsonArray(String response) throws FailedToGenerateSuggestionException {
        try {
            // read top-level object
            JsonNode root = mapper.readTree(response);

            // navigate to candidates → content → parts → text
            String arrayText = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            // now parse the text as JSON array
            return mapper.readValue(arrayText, new TypeReference<List<String>>() {});

        } catch (Exception e) {
            throw new FailedToGenerateSuggestionException("Failed to parse Gemini response: " + response, e);
        }
    }

}


/*
Jackson library --- serialize and deserialize json object

JsonNode & ObjectMapper is class under this library
ObjectMapper --- we manipulate one single json object

JsonNode --- we manipulate JSON content in hierarchical tree

since the response comes from gemini in hierarchical structure , we use json node
 */