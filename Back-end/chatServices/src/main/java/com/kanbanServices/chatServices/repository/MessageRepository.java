package com.kanbanServices.chatServices.repository;

import com.kanbanServices.chatServices.domain.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String>
{
    // fetches all messages between two users — regardless of who sent or received.
    // (sender = john AND receiver = mary)
    //OR
    //(sender = mary AND receiver = john)
    List<Message> findBySenderAndReceiverOrReceiverAndSender(String sender, String receiver, String sender2, String receiver2);
}
