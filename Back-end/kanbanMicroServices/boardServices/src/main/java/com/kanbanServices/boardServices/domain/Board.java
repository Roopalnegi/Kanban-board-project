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
    private String createdBy;//admin
    private List<Column>columns; //list type of column object embedding in board
    private String remarks; //admin can remark or comment about task
    @CreatedDate
    private LocalDate createdAt; //when board is created
    @LastModifiedDate
    private LocalDate updatedAt; //when the board is updated

    // empty constructor
    public Board(){}

    //parameterized constructor
    public Board(int boardId, String boardName, String createdBy, List<Column> columns, String remarks, LocalDate createdAt, LocalDate updatedAt) {
        this.boardId = boardId;
        this.boardName = boardName;
        this.createdBy = createdBy;
        this.columns = columns;
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
                ", createdBy='" + createdBy + '\'' +
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
