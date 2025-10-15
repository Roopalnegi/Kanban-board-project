package com.kanbanServices.boardServices.domain;
// creating separate column class which will be reference to board class as an object
public class Column {
    private int columnId; //id for column
    private String columnName;// name for column like "todoList",in-progress,completed,archive
    private int columnOrder; // position on board

    //empty -constructor
    public Column(){}

    //parameterized constructor

    public Column(int columnId, String columnName, int columnOrder) {
        this.columnId = columnId;
        this.columnName = columnName;
        this.columnOrder = columnOrder;
    }

    //getter and setter


    public int getColumnId() {
        return columnId;
    }

    public void setColumnId(int columnId) {
        this.columnId = columnId;
    }

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
