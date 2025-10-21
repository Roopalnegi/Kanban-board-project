package com.kanbanServices.boardServices.domain;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Document(collection = "Board")
public class Board
{

    @Id
    private String boardId;
    private String boardName;      //name of the bo
    private String createdBy;     //admin
    private List<Column>columns;  //list type of column object embedding in board
    private String description;   //admin can remark or comment about task
    @CreatedDate
    private LocalDate createdAt; //when board is created
    @LastModifiedDate
    private LocalDate updatedAt; //when the board is updated

    // empty constructor
    public Board(){}

    //parameterized constructor


    public Board(String boardId, String boardName, String createdBy, List<Column> columns, String description, LocalDate createdAt, LocalDate updatedAt)
    {
        this.boardId = boardId;
        this.boardName = boardName;
        this.createdBy = createdBy;
        this.columns = new ArrayList<>();
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    //setters and getters
    public String getBoardId() {return boardId;}
    public void setBoardId(String boardId) {this.boardId = boardId;}
    public String getBoardName() {
        return boardName;
    }
    public void setBoardName(String boardName) {
        this.boardName = boardName;
    }
    public String getCreatedBy() {
        return createdBy;
    }
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    public List<Column> getColumns() {
        return columns;
    }
    public void setColumns(List<Column> columns) {
        this.columns = columns;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
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
                "boardId='" + boardId + '\'' +
                ", boardName='" + boardName + '\'' +
                ", createdBy='" + createdBy + '\'' +
                ", columns=" + columns +
                ", description='" + description + '\'' +
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
