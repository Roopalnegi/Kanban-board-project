package com.kanbanServices.userAuthenticationServices.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService
{
    // JavaMailSender -- interface help to send emails from your application
    //                -- itself connect to server, authentication and send the message
    private JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender)
    {
        this.mailSender = mailSender;
    }

    // method to send email with otp
    // takes three parameters:- To, Subject, Body
    public void sendEmail(String toEmail, String subject, String body)
    {
        // for sending plain text message, use SimpleMailMessage
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);                   // recipient
        message.setSubject(subject);              // email subject
        message.setText(body);                    // email body

        try
        {
            mailSender.send(message);       // this method send email
            System.out.println("Email sent to " + toEmail);
        }
        catch (Exception e)
        {
            System.out.println("Failed to send email : " + e.getMessage());
            e.printStackTrace();
        }

    }

}
