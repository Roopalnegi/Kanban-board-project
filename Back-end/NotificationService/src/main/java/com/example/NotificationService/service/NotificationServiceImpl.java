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



    // fetch user (recipient) notifications with sorting and pagging
    @Override
    public Page<Notification> fetchRecipientNotification(String recipient)
    {
        // sort by createdOn descending order since newest first
        Sort sort = Sort.by(Sort.Direction.DESC, "createdOn");

        int page = 0;    // page start from 0 index value i.e. always start with first page
        int size = 10;   // no. of notification per page

        PageRequest pageRequest = PageRequest.of(page, size, sort);
        return notificationRepository.findAllByRecipient(recipient, pageRequest);
    }


    // filter user notifications based on date with sorting and pagging
    @Override
    public Page<Notification> findNotificationByDate(String recipient, LocalDate date)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdOn");
        PageRequest pageRequest = PageRequest.of(0, 10, sort);
        return notificationRepository.findByRecipientAndDate(recipient, date, pageRequest);
    }


    // filter user notifications based on month and year with sorting and pagging
    @Override
    public Page<Notification> findNotificationByMonthAndYear(String recipient, int month, int year)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdOn");
        PageRequest pageRequest = PageRequest.of(0,10,sort);
        return notificationRepository.findByRecipientAndMonthAndYear(recipient, month, year, pageRequest);
    }


    // find user unread notification with sorting and pagging
    @Override
    public Page<Notification> findUserUnreadNotification(String recipient)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdOn");
        PageRequest pageRequest = PageRequest.of(0,10,sort);
        return notificationRepository.findByRecipientsContainsAndIsReadFalse(recipient, pageRequest);
    }


    // count user unread notifications
    @Override
    public long countUnreadNotifications(String recipient)
    {
        return notificationRepository.countUnreadNotifications(recipient);
    }
}

