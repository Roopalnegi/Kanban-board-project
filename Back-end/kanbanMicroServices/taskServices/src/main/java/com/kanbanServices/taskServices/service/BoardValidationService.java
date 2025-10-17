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


    // check if board id exist
    public void validateBoardId (Long boardId)
    {
        Boolean exists = boardServiceClient.checkBoardExists(boardId);

        if(!exists)
        {
            throw new IllegalArgumentException("Board Id " + boardId + "does not exists !");
        }
    }


    // check if column exists inside the board
    public void validateColumnId(Long boardId, Long columnId)
    {
        try
        {
            boardServiceClient.
        }
        catch (Exception e)
        {
            throw new IllegalArgumentException("Column ID " + columnId + " does not exist in board ID " + boardId);
        }
    }


}
