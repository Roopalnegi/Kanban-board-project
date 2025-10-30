package com.kanbanServices.chatServices.controller;

import com.kanbanServices.chatServices.domain.Message;
import com.kanbanServices.chatServices.proxy.AuthFeignClient;
import com.kanbanServices.chatServices.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
public class MessageController
{

    private final MessageService messageService;
    private final AuthFeignClient authFeignClient;

    @Autowired
    public MessageController(MessageService messageService, AuthFeignClient authFeignClient)
    {
        this.messageService = messageService;
        this.authFeignClient = authFeignClient;
    }


    // Send a message
    @PostMapping("/sendMessage")
    public Message sendMessage(@RequestHeader("Authorization") String token, @RequestBody Message message)
    {

        // Validate token using Feign client call
        Map<String, String> response = authFeignClient.validateToken(token);
        String email = response.get("email");

        if (email == null || email.isEmpty())
        {
            throw new RuntimeException("Invalid or expired token");
        }

        // Save message to MongoDB
        return messageService.saveMessage(message);
    }


    // Fetch chat history between two users
    @GetMapping("/fetchMessages/{user1}/{user2}")
    public List<Message> getMessages(@RequestHeader("Authorization") String token, @PathVariable String user1, @PathVariable String user2)
    {

        // Validate again
        Map<String, String> response = authFeignClient.validateToken(token);
        String email = response.get("email");

        if (email == null || email.isEmpty())
        {
            throw new RuntimeException("Invalid or expired token");
        }

        return messageService.getConversation(user1, user2);
    }
}
