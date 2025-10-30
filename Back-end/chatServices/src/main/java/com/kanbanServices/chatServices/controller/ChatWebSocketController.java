package com.kanbanServices.chatServices.controller;


import com.kanbanServices.chatServices.domain.Message;
import com.kanbanServices.chatServices.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;


@Controller
public class ChatWebSocketController
{

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatWebSocketController (MessageService messageService, SimpMessagingTemplate messagingTemplate)
    {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    // send message to all subscriber
    @MessageMapping("/chat/sendMessage/All")
    @SendTo("/topic/public")                // All connected clients will receive
    public Message sendMessageToAll(@Payload Message message)
    {
        message.setTimeStamp(Instant.now());
        messageService.saveMessage(message); // Save in MongoDB
        return message; // Sent to frontend in real-time
    }


    // send message to 1-to-1 or one person
    @MessageMapping("/sendPrivateMessage")
    public void sendPrivateMessage(@Payload Message message)
    {
        message.setTimeStamp(Instant.now());
        messageService.saveMessage(message);

        // send only to the receiver
        messagingTemplate.convertAndSendToUser(message.getReceiver(), "/queue/messages", message);
    }

}

