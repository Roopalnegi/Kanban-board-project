package com.kanbanServices.chatServices.service;

import com.kanbanServices.chatServices.domain.Message;
import com.kanbanServices.chatServices.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class MessageService
{
    private final MessageRepository messageRepository;


    @Autowired
    public MessageService(MessageRepository messageRepository)
    {
        this.messageRepository = messageRepository;
    }


    // Save new message
    public Message saveMessage(Message message)
    {
        message.setTimeStamp(Instant.now());
        return messageRepository.save(message);
    }


    // Fetch conversation between two users
    public List<Message> getConversation(String user1, String user2)
    {
        return messageRepository.findBySenderAndReceiverOrReceiverAndSender(user1, user2, user1, user2);
    }


}
