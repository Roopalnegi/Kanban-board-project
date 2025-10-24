package com.example.NotificationService.controller;

import com.example.NotificationService.domain.Notification;
import com.example.NotificationService.exception.NotificationNotFoundException;
import com.example.NotificationService.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/notification")
public class NotificationController
{
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService)
    {
        this.notificationService = notificationService;
    }

    // method to handle saving  notification
    @PostMapping("/saveNotification")
    public ResponseEntity<?> handleSaveNotification(@RequestBody Notification notification)
    {
        try
        {
            Notification savedNotification = notificationService.saveNotification(notification);
            return new ResponseEntity<>(savedNotification, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // method to handle mark notification as read
    @PostMapping("/markNotificationAsRead/{notificationId}")
    public ResponseEntity<?> handleMarkNotificationAsRead(@PathVariable Long notificationId)
    {
        try
        {
            Notification markedNotification = notificationService.markNotificationAsRead(notificationId);
            return new ResponseEntity<>(markedNotification, HttpStatus.OK);
        }
        catch(NotificationNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // method to handle getting user notification with sorting and pagging
    @GetMapping("/getNotification")
    public ResponseEntity<?> handleFetchRecipientNotification(@RequestParam("recipient") String recipient)
    {
        try
        {
            Page<Notification> notifications = notificationService.fetchRecipientNotification(recipient);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle getting user notification based on date with pagging and sorting
    @GetMapping("/getNotificationByDate")
    public ResponseEntity<?> handleFindNotificationByDate(@RequestParam("recipient") String recipient, @RequestParam("date") LocalDate date)
    {
        try
        {
            Page<Notification> notifications = notificationService.findNotificationByDate(recipient,date);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle getting user notification based on month and year with pagging and sorting
    @GetMapping("/getNotificationByMonthAndYear")
    public ResponseEntity<?> handleGetUnreadNotificationsOfUser(@RequestParam("recipient") String recipient, @RequestParam("month") int month, @RequestParam("year") int year)
    {
        try
        {
            Page<Notification> notifications = notificationService.findNotificationByMonthAndYear(recipient, month, year);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        }
        catch (NotificationNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle getting unread notification with sorting and pagging
    @GetMapping("/getUnreadNotification")
    public ResponseEntity<?> handleGetNotificationsByMonthAndYear(@RequestParam("recipient") String recipient)
    {
        try
        {
            Page<Notification> notifications = notificationService.findUserUnreadNotification(recipient);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        }
        catch (NotificationNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle counting unread notification of a user
    @GetMapping("/countUnreadNotification")
    public ResponseEntity<?> handleCountUnreadNotifications(@RequestParam("recipient") String recipient)
    {
        try
        {
            return new ResponseEntity<>(notificationService.countUnreadNotifications(recipient), HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

/*
@RequestParam -- bind method argument to url query string
 */
