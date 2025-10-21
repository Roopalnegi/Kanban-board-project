package com.kanbanServices.boardServices.service;

import com.kanbanServices.boardServices.domain.Board;
import com.kanbanServices.boardServices.domain.Column;
import com.kanbanServices.boardServices.execption.BoardAlreadyExistsException;
import com.kanbanServices.boardServices.execption.BoardNotFoundExecption;
import com.kanbanServices.boardServices.execption.ColumnAlreadyExistsException;
import com.kanbanServices.boardServices.execption.ColumnNotFoundException;

import java.util.List;

public interface BoardService
{

    // ------------------ board related ----------------

    // create a new board
    Board createBoard(Board board) throws BoardAlreadyExistsException;

    // view single board details by id
    Board getBoardById(String boardId) throws BoardNotFoundExecption;

    // view all boards
    List<Board> getAllBoard();

    // delete board
    boolean deleteBoard(String boardId) throws BoardNotFoundExecption;

    // update board details
    Board updateBoard (String boardId, Board updateBoardData) throws BoardNotFoundExecption;



    // ----------- column related ------------------

    // create a new column in board
    Column  createBoardColumn (String boardId, Column newColumn) throws BoardNotFoundExecption, ColumnAlreadyExistsException;

    // delete column
    Boolean deleteBoardColumn (String boardId,String columnId) throws BoardNotFoundExecption, ColumnNotFoundException;

    // update column name
    Column updateBoardColumnName(String boardId, String columnId, String columnNewName) throws BoardNotFoundExecption, ColumnNotFoundException;

    // retrieve column by id
    Column getColumnById (String columnId) throws ColumnNotFoundException;

    // can help in validate column existence by name instead of id
    Column getColumnByName (String columnName) throws ColumnNotFoundException;

    // helper method - sort columns in a board by its order / position
    List<Column> sortColumnsByOrder(List<Column> columns);





    // ---------------- board and column existence for task service  and calculating archive column position-----------

    // check board exist before assigning task
    boolean checkBoardExistForTask (String boardId) throws BoardNotFoundExecption;

    // check if column with a given ID belongs to that specific board
    boolean columnExistsInBoardForTask(String boardId, String columnId) throws BoardNotFoundExecption, ColumnNotFoundException;

    // archive column would always be permanent and at last
    String calculateArchiveColumnId(String boardId) throws BoardNotFoundExecption;
}


/*

Use columnOrder for UI rendering and drag/drop operations, not as the main unique identifier.

Keep columnId as unique identifier (String) for updates/deletes.

 */
