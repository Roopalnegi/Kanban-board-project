package com.kanbanServices.boardServices.domain;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "Board")
@EnableMongoAuditing
public class Board {

    @Id
    private int boardId; //MongoDb document id
    private String boardName; //name of the bo
    private String assignedTo; //admin
    private List<String>taskId;//list of the task under board
    private String status;// "toDolist",inProgress","complete","archive"
    private String priority; // low,medium,high
    private String remarks; //admin can remark or comment about task
    @CreatedDate
    private LocalDate createdAt; //when board is created
    @LastModifiedDate
    private LocalDate updatedAt; //when the board is updated

    // empty constructors
    public Board(){}

    //parameterized constructors
    public Board(int boardId, String boardName, String assignedTo, List<String> taskId, String status, String priority, String remarks, LocalDate createdAt, LocalDate updatedAt) {
        this.boardId = boardId;
        this.boardName = boardName;
        this.assignedTo = assignedTo;
        this.taskId = taskId;
        this.status = status;
        this.priority = priority;
        this.remarks = remarks;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    //setters and getters

    public int getBoardId() {
        return boardId;
    }

    public void setBoardId(int boardId) {
        this.boardId = boardId;
    }

    public String getBoardName() {
        return boardName;
    }

    public void setBoardName(String boardName) {
        this.boardName = boardName;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public List<String> getTaskId() {
        return taskId;
    }

    public void setTaskId(List<String> taskId) {
        this.taskId = taskId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }

    //toString

    @Override
    public String toString() {
        return "Board{" +
                "boardId=" + boardId +
                ", boardName='" + boardName + '\'' +
                ", assignedTo='" + assignedTo + '\'' +
                ", taskId=" + taskId +
                ", status='" + status + '\'' +
                ", priority='" + priority + '\'' +
                ", remarks='" + remarks + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }


    /*
    --@CreatedDate --
            automatically store timestamp when a document is first inserted in MongoDB
    --@LastModifiedDate --
                automatically store timestamp whenever a document is updated in MongoDB
   --@EnableMongoAuditing --
                Spring Data MongoDB annotation used to enable automatic auditing of
    your MongoDB entities
                use MongoDB auditing feature - track when document is created, updated, and who made changes
                                - use @EnableMongoAuditing, @CreatedDate and @LastModifiedDate
    --LocalDate--
                class in Java Date API (java.time package)
                 -- represent date
                 -- ex:- 2025-10-05
     */
}
