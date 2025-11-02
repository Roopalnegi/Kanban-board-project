package com.kanbanServices.chatServices.controller;

import com.kanbanServices.chatServices.domain.Message;
import com.kanbanServices.chatServices.proxy.AuthFeignClient;
import com.kanbanServices.chatServices.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// this class is mainly used for message persistence and reterival ,, for saving message in db and reteriveing old message from db
// the frontend call this class right after sending message via web socket, to store it in databse
// Token validation happens via AuthFeignClient → ensures the sender is a real, logged-in user.
// “WebSocket sends the message instantly to users;
//REST saves the same message for history.”
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
    @PostMapping("/saveMessage")
    public Message saveMessage(@RequestHeader("Authorization") String token, @RequestBody Message message)
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
    // Used when user opens a private chat to load chat history between those two users.
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
