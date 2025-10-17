package com.kanbanServices.taskServices.service;

import com.kanbanServices.taskServices.proxy.BoardServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public void validateColumnId(String boardId, int columnId)
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


}
