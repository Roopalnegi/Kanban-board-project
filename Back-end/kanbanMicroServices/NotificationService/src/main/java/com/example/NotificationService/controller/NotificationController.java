package com.example.NotificationService.controller;

import com.example.NotificationService.domain.Notification;
import com.example.NotificationService.exception.NotificationNotFoundException;
import com.example.NotificationService.service.NotificationService;
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


    // method to handle saving notification
    @PostMapping("/saveNotification")
    public ResponseEntity<Boolean> handleSaveNotification(@RequestBody Notification notification)
    {
        try
        {
            notificationService.saveNotification(notification);
            return new ResponseEntity<>(true, HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();       // debugging
            return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
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
        catch (NotificationNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle getting all user notifications (no pagination)
    @GetMapping("/allNotifications")
    public ResponseEntity<?> handleFetchRecipientNotification(@RequestParam("recipient") String recipient)
    {
        try
        {
            List<Notification> notifications = notificationService.fetchRecipientNotification(recipient);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle getting user notifications by date (no pagination)
    @GetMapping("/getNotificationByDate")
    public ResponseEntity<?> handleFindNotificationByDate(@RequestParam("recipient") String recipient,
                                                          @RequestParam("date") LocalDate date)
    {
        try
        {
            List<Notification> notifications = notificationService.findNotificationByDate(recipient, date);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle getting user notifications by month and year (no pagination)
    @GetMapping("/getNotificationByMonthAndYear")
    public ResponseEntity<?> handleGetNotificationByMonthAndYear(@RequestParam("recipient") String recipient,
                                                                 @RequestParam("month") int month,
                                                                 @RequestParam("year") int year)
    {
        try
        {
            List<Notification> notifications = notificationService.findNotificationByMonthAndYear(recipient, month, year);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle getting unread notifications (no pagination)
    @GetMapping("/getUnreadNotification")
    public ResponseEntity<?> handleGetUnreadNotification(@RequestParam("recipient") String recipient)
    {
        try
        {
            List<Notification> notifications = notificationService.findUserUnreadNotification(recipient);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle counting unread notifications
    @GetMapping("/countUnreadNotification")
    public ResponseEntity<?> handleCountUnreadNotifications(@RequestParam("recipient") String recipient)
    {
        try
        {
            return new ResponseEntity<>(notificationService.countUnreadNotifications(recipient), HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

/*
@RequestParam -- binds method argument to URL query string
*/
