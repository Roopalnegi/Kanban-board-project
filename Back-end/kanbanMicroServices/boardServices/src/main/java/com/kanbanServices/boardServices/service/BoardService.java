package com.kanbanServices.boardServices.service;

import com.kanbanServices.boardServices.domain.Board;
import com.kanbanServices.boardServices.execption.BoardAlredyExistsException;
import com.kanbanServices.boardServices.execption.BoardNotFoundExecption;

import java.util.List;

public interface BoardService {

    //view task in board
    public Board getByTaskId(String taskId);
    // create new board
    public Board createBoard(Board board) throws BoardAlredyExistsException;
//view single board details
    public Board getBoardById(int boardId)throws BoardNotFoundExecption;
//view all board details
    public List<Board>getAllBoard();
//update board by id and update board like status,priority
    public Board updateBoard(int boardId,Board updateData)throws BoardNotFoundExecption;
//deleting board
    public boolean deleteBoard(int boardId)throws BoardNotFoundExecption;
//view board by its status
    public List<Board>getBoardByStatus(String status);
    //view to see assigned task under board
    public List<Board>getBoardAssignedTo(String assignedTo);
    //archive board
    public Board moveToArchive(int boardId)throws BoardNotFoundExecption;
    //restore board task from archive
    public Board restoreFromArchive(int boardId) throws BoardNotFoundExecption;
    }


