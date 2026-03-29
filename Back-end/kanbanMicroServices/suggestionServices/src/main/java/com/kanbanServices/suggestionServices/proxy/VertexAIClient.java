package com.kanbanServices.suggestionServices.proxy;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;



@FeignClient(name = "vertexAIClient", url = "${gemini.base.url}")
public interface VertexAIClient
{

    // Gemini supports x-goog-api-key header ... so put key in header rather than url

    @PostMapping(
            value = "/v1/models/{model}:generateContent",
            consumes = "application/json"
    )
    String generateContent(
            @PathVariable("model") String model,
            @RequestParam("key") String apiKey,
            @RequestBody Map<String, Object> request
    );
}
