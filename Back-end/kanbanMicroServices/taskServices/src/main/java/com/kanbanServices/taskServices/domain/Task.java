package com.kanbanServices.taskServices.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;


@Document(collection = "Task")
@EnableMongoAuditing
public class Task
{
    @Id
    private String taskId;                     // MongoDB document ID
    private String title;                  // name of the task
    private String task_description;       // detailed info about task
    private Long columnId;                 // reference to which Kanban column
    private Long previousColumnId;         // reference to which restore task from archive column
    private Long boardId;                  // reference to which board (project / team)
    private String priority;               // low, high, medium
    private String assignedTo;             // employee name
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;         // deadline for the task
    @CreatedDate
    private LocalDate createdAt;       // when the task was created
    @LastModifiedDate
    private LocalDate updatedAt;       // when it was last modified
    private String comments;           // comments on tasks


    // empty constructor
    public Task()
    {}


    // parameterized constructor
    public Task(String taskId, String title, String task_description, Long columnId, Long previousColumnId, Long boardId, String priority, String assignedTo, LocalDate dueDate, LocalDate createdAt, LocalDate updatedAt, String comments)
    {
        this.taskId = taskId;
        this.title = title;
        this.task_description = task_description;
        this.columnId = columnId;
        this.previousColumnId = previousColumnId;
        this.boardId = boardId;
        this.priority = priority;
        this.assignedTo = assignedTo;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.comments = comments;
    }


    // getters and setters
    public String getTaskId() {return taskId;}
    public void setTaskId(String id) {this.taskId = taskId;}
    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}
    public String getTask_description() {return task_description;}
    public void setTask_description(String task_description) {this.task_description = task_description;}
    public Long getColumnId() {return columnId;}
    public void setColumnId(Long columnId) {this.columnId = columnId;}
    public Long getPreviousColumnId() {return previousColumnId;}
    public void setPreviousColumnId(Long previousColumnId) {this.previousColumnId = previousColumnId;}
    public Long getBoardId() {return boardId;}
    public void setBoardId(Long boardId) {this.boardId = boardId;}
    public String getPriority() {return priority;}
    public void setPriority(String priority) {this.priority = priority;}
    public String getAssignedTo() {return assignedTo;}
    public void setAssignedTo(String assignedTo) {this.assignedTo = assignedTo;}
    public LocalDate getDueDate() {return dueDate;}
    public void setDueDate(LocalDate dueDate) {this.dueDate = dueDate;}
    public LocalDate getCreatedAt() {return createdAt;}
    public void setCreatedAt(LocalDate createdAt) {this.createdAt = createdAt;}
    public LocalDate getUpdatedAt() {return updatedAt;}
    public void setUpdatedAt(LocalDate updatedAt) {this.updatedAt = updatedAt;}
    public String getComments() {return comments;}
    public void setComments(String comments) {this.comments = comments;}

    // toString()
    @Override
    public String toString() {
        return "Task{" +
                "taskId='" + taskId + '\'' +
                ", title='" + title + '\'' +
                ", task_description='" + task_description + '\'' +
                ", columnId=" + columnId +
                ", previousColumnId=" + previousColumnId +
                ", boardId=" + boardId +
                ", priority='" + priority + '\'' +
                ", assignedTo='" + assignedTo + '\'' +
                ", dueDate=" + dueDate +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", comments=" + comments +
                '}';
    }


   /*
   LocalDateTime -- class in Java Date and Time API (java.time package)
                 -- represent date and time but without timezone
                 -- ex:- 2025-10-09T15:27:48.123 (before T - date and after T time)

   use MongoDB auditing feature - track when document is created, updated, and who made changes
                                - use @EnableMongoAuditing, @CreatedDate and @LastModifiedDate

    --@EnableMongoAuditing -- activate both annotation for the document
                           -- for this, write separated configuration class
                           -- do not write over entity class, separately have to make configuration class

    --@CreatedDate -- automatically store timestamp when a document is first inserted in MongoDB
    --@LastModifiedDate -- automatically store timestamp whenever a document is updated in MongoDB

    -- @JsonFormat -- to specify custom date format

    */



}
