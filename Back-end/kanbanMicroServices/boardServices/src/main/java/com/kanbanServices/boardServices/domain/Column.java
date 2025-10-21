package com.kanbanServices.boardServices.domain;


import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

// creating separate column class which will be reference to board class as an object
public class Column
{
    private String columnId; //id for column
    private String columnName;// name for column like "todoList",in-progress,completed,archive
    private int columnOrder; // position on board


    //empty constructor
    public Column(){}


    //parameterized constructor
    public Column(String columnName, int columnOrder)
    {
        // This gives every column a unique string ID like "652b5a...abc", same as Mongo’s _id format.
        this.columnId = new ObjectId().toString();           // auto-generate unique ID manually
        this.columnName = columnName;
        this.columnOrder = columnOrder;
    }


    //getter and setter
    public String getColumnId() {return columnId;}
    public void setColumnId(String columnId) {this.columnId = columnId;}
    public String getColumnName() {
        return columnName;
    }
    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }
    public int getColumnOrder() {
        return columnOrder;
    }
    public void setColumnOrder(int columnOrder) {
        this.columnOrder = columnOrder;
    }


    //toString
    @Override
    public String toString() {
        return "Column{" +
                "columnId=" + columnId +
                ", columnName='" + columnName + '\'' +
                ", columnOrder=" + columnOrder +
                '}';
    }
}
