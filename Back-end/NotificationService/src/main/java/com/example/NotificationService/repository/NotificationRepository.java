package com.example.NotificationService.repository;

import com.example.NotificationService.domain.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;


@Repository
public interface NotificationRepository extends JpaRepository<Notification,Long>
{
   // find notification for a user (recipient)
   /*
      Select * from notification n
      inner join notification_recipient nr
      on n.notification_id = nr.notification_id where nr.recipients = "any name";
    */
   @Query(value =  "select n.* from notification n join n.recipients nr on n.notification_Id = nr.notification_Id where nr.recipients =  :recipient", nativeQuery = true)
   Page<Notification> findAllByRecipient(String recipient, Pageable pageable);



   // find notification for a user on specific date
   /*
      Select * from notification n
      inner join notification_recipient nr
      on n.notification_id = nr.notification_id where nr.recipients = "any name" and DATE(n.createdOn) = "any date";
    */
   @Query(value = "select n.* from notification n join n.recipients nr on n.notification_Id = nr.notification_Id where nr.recipients =  :recipient and DATE(n.createdOn) = :date", nativeQuery = true)
   Page<Notification> findByRecipientAndDate (String recipient, LocalDate date, Pageable pageable);




   // find notification for a user by month and year
   /*
     Select * from notification n
     inner join notification_recipients nr
     on n.notification_id = nr.notification_id where nr.recipients = "any name"
                                                     and MONTH(n.createdOn) = "any month no" and YEAR(n.createdOn) = "any year";
    */
     @Query(value = "select n.* from notification n join n.recipients nr on n.notification_Id = nr.notification_Id where nr.recipients =  :recipient and MONTH(n.createdOn) = :month and YEAR(n.createdOn) = :year" , nativeQuery = true)
     Page<Notification> findByRecipientAndMonthAndYear(String recipient,int month, int year, Pageable pageable);



   // find unread notification for a user
   /*
     Select * from notification n
     inner join notification_recipients nr
     on n.notification_id = nr.notification_id where nr.recipients = "any name" and isRead = false;
    */
   @Query(value = "select n.* from notification n join n.recipients nr on n.notification_Id = nr.notification_Id where nr.recipients =  :recipient and nr.isRead = false" , nativeQuery = true)
   Page<Notification> findByRecipientsContainsAndIsReadFalse (String recipient, Pageable pageable);



   // count no. of unread notification for a user
   /*
     Select count(n) from notification n
     inner join notification_recipients nr
     on n.notification_id = nr.notification_id where nr.recipients = "any name" where isRead = false;
    */
   @Query(value = "select count(n) from notification n join n.recipients nr on n.notification_Id = nr.notification_Id where nr.recipients =  :recipient and nr.isRead = false", nativeQuery = true)
   long countUnreadNotifications(String recipient);


}



/*
 Date(n.createdOn) -- extract only date (not time)
 nativeQuery -- tells to use actual SQL
 nr.recipients = :recipient ---> matches exactly the recipient string

 -----> REMEMBER ---- hibernate usually converts camelCase (sentBy) as sent_by
*/



/*
I use Pagging and Sorting repository --- to support pagination and sorting by desc date

  1. Page -- sublist of list of object
          -- hold info about the position of it in the entire list

   2. Pageable -- interface and has many methods :-
                  i. getPageNumber() -- return no. of page returned
                  ii. getPageSize() -- return no. of items to be returned
                  iii. getSort() -- return sorting parameters

    Thus, Repository method must return Page<Notification> and accept Pageable.
          Service method builds PageRequest with page number, size, sort.
 */