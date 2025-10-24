package com.example.NotificationService.service;

import com.example.NotificationService.domain.Notification;
import com.example.NotificationService.exception.NotificationNotFoundException;

import java.time.LocalDate;
import java.util.List;

public interface NotificationService
{

    // save new notification
    Notification saveNotification(Notification notification);

    // mark notification as read
    Notification markNotificationAsRead(Long notificationId) throws NotificationNotFoundException;

    // fetch user (recipient) notifications
    List<Notification> fetchRecipientNotification(String recipient);

    // filter user notification based on date
    List<Notification> findNotificationByDate(String recipient, LocalDate date);

    // filter user notification based on month and year
    List<Notification> findNotificationByMonthAndYear(String recipient, int month, int year);

    // find user unread notifications
    List<Notification> findUserUnreadNotification(String recipient);

    // count user unread notifications
    long countUnreadNotifications(String recipient);
}

