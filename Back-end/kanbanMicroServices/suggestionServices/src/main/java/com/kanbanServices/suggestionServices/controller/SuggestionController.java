package com.kanbanServices.suggestionServices.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.kanbanServices.suggestionServices.exception.FailedToGenerateSuggestionException;
import com.kanbanServices.suggestionServices.service.SuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/suggestion")
@CrossOrigin(origins = "http://localhost:3000")
public class SuggestionController
{

    private final SuggestionService suggestionService;

    @Autowired
    public SuggestionController(SuggestionService suggestionService)
    {
        this.suggestionService = suggestionService;
    }


    @PostMapping("/generate")
    public ResponseEntity<?> generateSuggestions(@RequestBody String promptRequest)
    {
        try
        {
            if(promptRequest == null || promptRequest.trim().isEmpty())
            {
                return new ResponseEntity<>("Prompt cannot be empty", HttpStatus.BAD_REQUEST);
            }

            List<String> suggestions = suggestionService.getSuggestions(promptRequest);
            return new ResponseEntity<>(suggestions, HttpStatus.OK);
        }
        catch (FailedToGenerateSuggestionException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (JsonProcessingException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
