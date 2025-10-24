package com.example.NotificationService.service;

import com.example.NotificationService.domain.Notification;
import com.example.NotificationService.exception.NotificationNotFoundException;
import com.example.NotificationService.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface NotificationService
{
    // save new notification
    Notification saveNotification(Notification notification);


    // mark notification as read
    Notification markNotificationAsRead(Long notificationId) throws NotificationNotFoundException;


    // fetch user (recipient) notifications with sorting and pagging
    Page<Notification> fetchRecipientNotification(String recipient);


    // filter user notifications based on date with sorting and pagging
    Page<Notification> findNotificationByDate(String recipient, LocalDate date);


    // filter user notifications based on month and year with sorting and pagging
    Page<Notification> findNotificationByMonthAndYear(String recipient, int month, int year);


    // find user unread notification with sorting and pagging
    Page<Notification> findUserUnreadNotification(String recipient);


    // count user unread notifications
    long countUnreadNotifications(String recipient);


}
