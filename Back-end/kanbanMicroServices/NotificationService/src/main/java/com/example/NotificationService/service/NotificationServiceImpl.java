package com.example.NotificationService.service;

import com.example.NotificationService.domain.Notification;
import com.example.NotificationService.exception.NotificationNotFoundException;
import com.example.NotificationService.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService
{

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository)
    {
        this.notificationRepository = notificationRepository;
    }

    // save new notification
    @Override
    public Notification saveNotification(Notification notification)
    {
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    // mark notification as read
    @Override
    public Notification markNotificationAsRead(Long notificationId)
    {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    // fetch user (recipient) notifications (all, no pagination)
    @Override
    public List<Notification> fetchRecipientNotification(String recipient)
    {
        return notificationRepository.findAllByRecipient(recipient);
    }

    // filter user notifications by date
    @Override
    public List<Notification> findNotificationByDate(String recipient, LocalDate date)
    {
        return notificationRepository.findByRecipientAndDate(recipient, date);
    }

    // filter user notifications by month and year
    @Override
    public List<Notification> findNotificationByMonthAndYear(String recipient, int month, int year)
    {
        return notificationRepository.findByRecipientAndMonthAndYear(recipient, month, year);
    }

    // find user unread notifications
    @Override
    public List<Notification> findUserUnreadNotification(String recipient)
    {
        return notificationRepository.findByRecipientsContainsAndIsReadFalse(recipient);
    }

    // count user unread notifications
    @Override
    public long countUnreadNotifications(String recipient)
    {
        return notificationRepository.countUnreadNotifications(recipient);
    }
}

