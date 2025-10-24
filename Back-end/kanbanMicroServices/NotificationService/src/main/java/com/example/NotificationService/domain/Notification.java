package com.example.NotificationService.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.util.List;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
public class Notification
{
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long notificationId;
   private String taskName;     // to know which task this notification belongs to
   @Lob                        // for long string/ text
   private String message;    // descriptive message (e.g., "Task moved to In Progress")
   private String sentBy;     // who triggered it: "Admin" / "Employee"
   @ElementCollection
   @CollectionTable(name = "notification_recipients",
                    joinColumns = @JoinColumn(name = "notification_id"))
   private List<String> recipients; // to whom it is given
   @CreationTimestamp
   private LocalDateTime createdOn;
   private boolean isRead;           // track if notification read or not


   // empty constructor
   public Notification()
   {}


   // parameterized constructor
   public Notification(Long notificationId, String taskName, String message, String sentBy, List<String> recipients, String employeeComment, String adminReply, LocalDateTime createdOn, boolean isRead)
   {
      this.notificationId = notificationId;
      this.taskName = taskName;
      this.message = message;
      this.sentBy = sentBy;
      this.recipients = recipients;
      this.createdOn = createdOn;
      this.isRead = isRead;
   }


   //getters and setters
   public Long getNotificationId() {return notificationId;}
   public void setNotificationId(Long notificationId) {this.notificationId = notificationId;}
   public LocalDateTime getCreatedOn() {return createdOn;}
   public void setCreatedOn(LocalDateTime createdOn) {this.createdOn = createdOn;}
   public boolean isRead() {return isRead;}
   public void setRead(boolean read) {isRead = read;}
   public String getTaskName() {return taskName;}
   public void setTaskName(String taskName) {this.taskName = taskName;}
   public String getMessage() {return message;}
   public void setMessage(String message) {this.message = message;}
   public String getSentBy() {return sentBy;}
   public void setSentBy(String sentBy) {this.sentBy = sentBy;}
   public List<String> getRecipients() {return recipients;}
   public void setRecipients(List<String> recipients) {this.recipients = recipients;}


   // to String
   @Override
   public String toString() {
      return "Notification{" +
              "notificationId=" + notificationId +
              ", taskName='" + taskName + '\'' +
              ", message='" + message + '\'' +
              ", sentBy='" + sentBy + '\'' +
              ", recipients=" + recipients +
              ", createdOn=" + createdOn +
              ", isRead=" + isRead +
              '}';
   }
}

/*
 @CreationTimestamp -- hibernate specific annotation
                    -- store creation date and time automatically of a record (row)
                       when it first inserted in db
                    -- work only when hibernate is there (in spring boot it is by default)
                    --  eliminates the need to manually set timestamps in MySQL
                        (as we have to write small logic if we want this functionality and have to use @PerPersist).
 */

/*
 Why use @ElementCollection and separate table for recipients

   Problem -- mysql can't store List<String> directly in a column name i.e. can store multiple values in a column (violate single normalization)
           -- but we can store it as a comma separated string like john,anjali etc. but it will become hard to filter and maintain

  Solution -- so to overcome, we use @ElementCollection in JPA
           -- here hibernate is going to create a separate table called notification_recipients
                        --------- tn this table, each recipient is store as separate row , linked to the main notification table by using notification_id (foreign key)

       Thus, notification table --------- notification_id, taskName , message, sentBy, createdOn, isRead
             notification_recipient table -------- notification_id, recipient
             Hibernate automatically join the table

 */
