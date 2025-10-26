package com.example.NotificationService.repository;

import com.example.NotificationService.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>
{

   // find notifications for a user (recipient)
//   @Query(value = "SELECT n.* FROM notification n " +
//           "JOIN notification_recipients nr " +
//           "ON n.notification_id = nr.notification_id " +
//           "WHERE nr.recipients = :recipient " +
//           "ORDER BY n.created_on DESC",
//           nativeQuery = true)
   List<Notification> findByRecipientsContainsOrderByCreatedOnDesc(@Param("recipient") String recipient);


   // find notifications for a user on specific date
   @Query(value = "SELECT n.* FROM notification n " +
           "JOIN notification_recipients nr " +
           "ON n.notification_id = nr.notification_id " +
           "WHERE nr.recipients = :recipient AND DATE(n.created_on) = :date " +
           "ORDER BY n.created_on DESC",
           nativeQuery = true)
   List<Notification> findByRecipientAndDate(@Param("recipient") String recipient, @Param("date") LocalDate date);


   // find notifications for a user by month and year
   @Query(value = "SELECT n.* FROM notification n " +
           "JOIN notification_recipients nr " +
           "ON n.notification_id = nr.notification_id " +
           "WHERE nr.recipients = :recipient AND MONTH(n.created_on) = :month AND YEAR(n.created_on) = :year " +
           "ORDER BY n.created_on DESC",
           nativeQuery = true)
   List<Notification> findByRecipientAndMonthAndYear(@Param("recipient") String recipient,
                                                     @Param("month") int month,
                                                     @Param("year") int year);


   // find unread notifications for a user
   @Query(value = "SELECT n.* FROM notification n " +
           "JOIN notification_recipients nr " +
           "ON n.notification_id = nr.notification_id " +
           "WHERE nr.recipients = :recipient AND n.is_read = false " +
           "ORDER BY n.created_on DESC",
           nativeQuery = true)
   List<Notification> findByRecipientsContainsAndIsReadFalse(@Param("recipient") String recipient);


   // count number of unread notifications for a user
   @Query(value = "SELECT COUNT(*) FROM notification n " +
           "JOIN notification_recipients nr " +
           "ON n.notification_id = nr.notification_id " +
           "WHERE nr.recipients = :recipient AND n.is_read = false",
           nativeQuery = true)
   long countUnreadNotifications(@Param("recipient") String recipient);

}
