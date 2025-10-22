package com.kanbanServices.taskServices.service;

import com.kanbanServices.taskServices.exception.TaskNotFoundException;
import com.kanbanServices.taskServices.proxy.BoardServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Service
public class BoardValidationService
{
    private final BoardServiceClient boardServiceClient;

    @Autowired
    public BoardValidationService(BoardServiceClient boardServiceClient)
    {
        this.boardServiceClient = boardServiceClient;
    }


    // check board exist before assigning task
    public void validateBoardId (String boardId)
    {
        Boolean exists = boardServiceClient.checkBoardExists(boardId);

        if(!exists)
        {
            throw new IllegalArgumentException("Board Id " + boardId + "does not exists !");
        }
    }


    // check if column with a given ID belongs to that specific board
    public void validateColumnId(String boardId, String columnId)
    {
        try
        {
            boardServiceClient.checkColumnExists(boardId,columnId);
        }
        catch (Exception e)
        {
            throw new IllegalArgumentException("Column ID " + columnId + " does not exist in board ID " + boardId);
        }
    }


    // fetch archive column id
    public String calculateArchiveColumnId(@PathVariable String boardId)
    {
        try
        {
            return boardServiceClient.calculateArchiveColumnId(boardId);
        }
        catch(Exception e)
        {
            throw new IllegalArgumentException("Failed to fetch archive column position for board ID: " + boardId + ". " + e.getMessage());
        }
    }


    // fetch done column id
    public String calculateDoneColumnId(@PathVariable String boardId)
    {
        try
        {
            return boardServiceClient.calculateDoneColumnId(boardId);
        }
        catch(Exception e)
        {
            throw new IllegalArgumentException("Failed to fetch done column position for board ID: " + boardId + ". " + e.getMessage());
        }
    }



}
