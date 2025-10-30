package com.kanbanServices.suggestionServices.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kanbanServices.suggestionServices.exception.FailedToGenerateSuggestionException;
import com.kanbanServices.suggestionServices.proxy.VertexAIClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SuggestionServiceImpl implements SuggestionService
{

    private VertexAIClient aiClient;

    @Value("${vertex.api-key}")
    private String apiKey;

    @Value("${vertex.model}")
    private String model;

    @Autowired
    public SuggestionServiceImpl(VertexAIClient aiClient)
    {
        this.aiClient = aiClient;
    }

    @Override
    public List<String> getSuggestions(String prompt) throws JsonProcessingException, FailedToGenerateSuggestionException
    {
        List<String> suggestions = new ArrayList<>();


        if (apiKey == null || apiKey.isEmpty())
        {
            throw new IllegalStateException("API key not found. Please set the KANBAN_PROJECT_GEMINI_API_KEY environment variable.");
        }

        //  prepare contextual prompt for better response  (optional)
        // three key rules:
        // Context: You are a Kanban board assistant (helps with tasks/boards).
        // Flexibility: The input (prompt) can ask for any text field (board/task title or description).
        // Character limit: If the request seems to be for a “description,” keep each suggestion under 50 characters.
        String modifiedPrompt = """
                                    You are an intelligent assistant for a Kanban board application.
                                    The user will provide an input that could be related to:
                                    - a board title,
                                    - a board description,
                                    - a task title, or
                                    - a task description or at last anything
                                   
                                   Generate at least 10 short, creative, and relevant suggestions for the given input.
                                   
                                   If the input looks like a *description request*, make sure each suggestion is concise and under 50 characters..
                                   Return only a **pure JSON array of strings** without markdown formatting or explanations.
                                   The response must start with '[' and end with ']'.

                                   Example:
                                   ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5", "Idea 6", "Idea 7", "Idea 8", "Idea 9", "Idea 10"]

                                   Input: "%s"
                                   """.formatted(prompt);

        // step 1 -build JSON request body with candidateCount and responseMimeType
        ObjectMapper objectMapper = new ObjectMapper();

        String requestBody = objectMapper.writeValueAsString(
                Map.of("contents",
                        List.of(Map.of("parts", List.of(Map.of("text", modifiedPrompt)))))
        );

        // Optional: log the request body (for debugging)
        System.out.println(">>> Gemini Request Body: " + requestBody);



        // step 2 - call gemini via feign client
        String response = aiClient.generateContent(apiKey, model, requestBody);

        // step 3 - parse JSON response --- i.e. extract "text" part from each candidate
        // parse response into json node
        JsonNode root = objectMapper.readTree(response);

        // extract candidates
        JsonNode candidates = root.path("candidates");

        if (candidates.isArray() && candidates.size() > 0)
        {
            // extract parts from content
            JsonNode parts = candidates.get(0).path("content").path("parts");
            // check if parts exist or check than 0
            if (parts.isArray() && parts.size() > 0)
            {
                // extract text
                String text = parts.get(0).path("text").asText();
                if(text != null && !text.isBlank())
                {
                    // clean gemini's markdown/code fences
                    text = text .replace("```json", "")
                            .replace("```", "")
                            .trim();

                    try
                    {
                        // Parse JSON array into List<String>
                        List<String> aiSuggestions = objectMapper.readValue(
                                text, new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {});
                        suggestions.addAll(aiSuggestions);
                    }
                    catch (Exception e)
                    {
                        // Fallback in case Gemini response isn’t valid JSON
                        suggestions.add(text);
                    }

                }
            }
        }
        if(suggestions.isEmpty())
        {
            throw new FailedToGenerateSuggestionException("Server failed to process.");
        }


        return suggestions;
    }
}

/*
Jackson library --- serialize and deserialize json object

JsonNode & ObjectMapper is class under this library
ObjectMapper --- we manipulate one single json object

JsonNode --- we manipulate JSON content in hierarchical tree

since the response comes from gemini in hierarchical structure , we use json node
 */