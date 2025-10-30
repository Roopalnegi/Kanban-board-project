package com.kanbanServices.suggestionServices.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.kanbanServices.suggestionServices.exception.FailedToGenerateSuggestionException;

import java.util.List;

public interface SuggestionService
{
    List<String> getSuggestions(String prompt) throws JsonProcessingException, FailedToGenerateSuggestionException;
}
