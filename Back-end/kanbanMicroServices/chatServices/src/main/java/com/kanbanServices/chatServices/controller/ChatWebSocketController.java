package com.kanbanServices.chatServices.controller;


import com.kanbanServices.chatServices.domain.Message;
import com.kanbanServices.chatServices.service.MessageService;
import com.kanbanServices.chatServices.service.OnlineUserTracker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.Instant;


@Controller
public class ChatWebSocketController
{

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final OnlineUserTracker onlineUserTracker;

    @Autowired
    public ChatWebSocketController (MessageService messageService, SimpMessagingTemplate messagingTemplate, OnlineUserTracker onlineUserTracker)
    {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
        this.onlineUserTracker = onlineUserTracker;
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

        // send to receiver
        messagingTemplate.convertAndSendToUser(message.getReceiver(), "/queue/messages", message);

        // send to sender so he can aslo see it immediately
        messagingTemplate.convertAndSendToUser(message.getSender(), "/queue/messages",message);

        System.out.println("Message sent from " + message.getSender() + " to " + message.getReceiver());

    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event)
    {
        String email = (String) event.getUser().getName();
        if(email != null)
        {
            onlineUserTracker.addUserToOnline(email);
            messagingTemplate.convertAndSend("/topic/onlineUsers", onlineUserTracker.getOnlineUsers());
            System.out.println("User connected " + email);

        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event)
    {
        String email = (String) event.getUser().getName();
        if(email != null)
        {
            onlineUserTracker.removerUserFromOnline(email);
            messagingTemplate.convertAndSend("/topic/onlineUsers", onlineUserTracker.getOnlineUsers());
            System.out.println("User disconnected " + email);

        }
    }

}

/*
@EventListener -- given by spring framework
               -- it allow a method to listen any specific application events like  websocket connect / disconnect, subscribe
               -- spring boot emits hidden "notifications" behind the scene

               1. SessionConnectEvent = a websocket client successfully connects
               2. SessionConnectedEvent = stomp session established
               3. SessionDisconnectEvent = a web socket client disconnects
               4. SessionSubscribeEvent = a client subscribes to a topic
               5. SessionUnsubscribeEvent = a client unsubscribes
               We can catch those notifications using @EventListener in any bean(@component / @service)



 */
