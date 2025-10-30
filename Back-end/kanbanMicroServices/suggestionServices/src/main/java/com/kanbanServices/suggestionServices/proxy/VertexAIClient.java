package com.kanbanServices.suggestionServices.proxy;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;


@FeignClient(name = "vertexAIClient", url = "https://generativelanguage.googleapis.com/v1beta")
public interface VertexAIClient
{

    // Gemini supports x-goog-api-key header ... so put key in header rather than url

    @PostMapping(value = "/models/{model}:generateContent",  consumes = "application/json", produces = "application/json")
    String generateContent(
            @RequestHeader("x-goog-api-key") String apiKey,
            @PathVariable("model") String model,
            @RequestBody String requestBody
    );
}

