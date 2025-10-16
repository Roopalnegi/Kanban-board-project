package com.kanbanServices.boardServices.service;

import com.kanbanServices.boardServices.domain.Board;
import com.kanbanServices.boardServices.domain.Column;
import com.kanbanServices.boardServices.execption.BoardAlredyExistsException;
import com.kanbanServices.boardServices.execption.BoardNotFoundExecption;
import com.kanbanServices.boardServices.execption.ColumnAlreadyExistsException;
import com.kanbanServices.boardServices.execption.ColumnNotFoundException;

import java.util.List;

public interface BoardService {

    /**checking board exists or not*/
    boolean checkBoardExist(int boardId);

    /** create new board*/
    public Board createBoard(Board board) throws BoardAlredyExistsException;

    /**view single board details*/
    public Board getBoardById(int boardId)throws BoardNotFoundExecption;

    //view all board details
    public List<Board>getAllBoard();

    /**deleting board*/
    public boolean deleteBoard(int boardId)throws BoardNotFoundExecption;
    /**
     * create column
     */
    public Board createBoardColumn(int boardId, Column column) throws ColumnAlreadyExistsException, BoardNotFoundExecption;

    /**
     * Retrieves a column by its ID.
     */
    public Column getColumnById(int columnId) throws ColumnNotFoundException;

    /**
     * Retrieves a column by its name.
     */
   public Column getColumnByName(String columnName) throws ColumnNotFoundException;

    /**
     * Retrieves columns by their position in a board.
     */
   public List<Column> getColumnsByPosition(int boardId, int position);
    /*
    * check if column exists*/
    public boolean checkColumnExists(int columnId);

    public boolean columnExistsInBoard(int boardId, int columnId);




    }


