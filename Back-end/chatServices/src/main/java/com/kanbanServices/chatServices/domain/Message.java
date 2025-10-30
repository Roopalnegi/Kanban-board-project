package com.kanbanServices.chatServices.domain;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;



// this class represent simple message

@Document(collection = "chatMessages")
public class Message
{

    // to represent type of message event
    public enum MessageType {
        CHAT,          // regular text message
        JOIN,          // when user join the chat
        LEAVE          // when user leave the chat
    }

    @Id
    private String messageId;
    private MessageType type;        // type of message event
    private String receiver;
    private String sender;           // who sends the message
    private String content;          // test message content
    private Instant timeStamp;      // when the message send


    public Message()
    {}


    public Message(MessageType type,String sender, String receiver, String content,Instant timeStamp)
    {
        this.type = type;
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.timeStamp = timeStamp;
    }


    public MessageType getType() {return type;}
    public void setType(MessageType type) {this.type = type;}
    public String getSender() {return sender;}
    public void setSender(String sender) {this.sender = sender;}
    public String getContent() {return content;}
    public void setContent(String content) {this.content = content;}
    public Instant getTimeStamp() {return timeStamp;}
    public void setTimeStamp(Instant timeStamp) {this.timeStamp = timeStamp;}
    public String getMessageId() {return messageId;}
    public void setMessageId(String messageId) {this.messageId = messageId;}
    public String getReceiver() {return receiver;}
    public void setReceiver(String receiver) {this.receiver = receiver;}

    @Override
    public String toString() {
        return "Message{" +
                "messageId='" + messageId + '\'' +
                ", type=" + type +
                ", receiver='" + receiver + '\'' +
                ", sender='" + sender + '\'' +
                ", content='" + content + '\'' +
                ", timeStamp=" + timeStamp +
                '}';
    }
}

/*
JavaScript sends timestamps like 2025-10-30T06:23:18.739Z (with a Z → means UTC time).
But LocalDateTime in Java cannot parse the Z suffix (it only supports formats without timezone).
 */