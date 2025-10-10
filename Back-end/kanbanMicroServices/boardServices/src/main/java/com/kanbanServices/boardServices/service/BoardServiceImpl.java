package com.kanbanServices.boardServices.service;

import com.kanbanServices.boardServices.domain.Board;
import com.kanbanServices.boardServices.execption.BoardAlredyExistsException;
import com.kanbanServices.boardServices.execption.BoardNotFoundExecption;
import com.kanbanServices.boardServices.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BoardServiceImpl implements BoardService{

    private final BoardRepository boardRepository;

    @Autowired
    public BoardServiceImpl(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    //create
    @Override
    public Board createBoard(Board board) throws BoardAlredyExistsException {
        // check if task already exists by its title and boardId as two tasks can have same title but live in different boards
        if(boardRepository.findByBoardIdAndBoardName(board.getBoardName(),board.getBoardId()).isPresent())
        {
            throw new BoardAlredyExistsException("Board already exists with id : " + board.getBoardId());
        }
        board.setCreatedAt(LocalDate.now());
        board.setStatus("toDoList"); // default starting status

        return boardRepository.save(board);
    }

    //read
    @Override
    public Board getBoardById(int boardId) throws BoardNotFoundExecption {
        return boardRepository.findByBoardId(boardId).
                orElseThrow(()->new BoardNotFoundExecption("Board not found"));
    }

    //readAll

    @Override
    public List<Board> getAllBoard() {
        return boardRepository.findAll();
    }

    //update


    @Override
    public Board updateBoard(int boardId, Board updateData) throws BoardNotFoundExecption {
        Board existingBoard=getBoardById(boardId);

        if (updateData.getBoardName()!=null){
            existingBoard.setBoardName(updateData.getBoardName());
        }
        if(updateData.getAssignedTo()!=null){
            existingBoard.setAssignedTo(updateData.getAssignedTo());
        }
        if (updateData.getStatus()!=null){
            existingBoard.setStatus(updateData.getStatus());
        }
        if(updateData.getPriority()!=null){
            existingBoard.setPriority(updateData.getPriority());
        }
        if (updateData.getTaskId()!=null){
            existingBoard.setTaskId(updateData.getTaskId());
        }
        existingBoard.setUpdatedAt(LocalDate.now());
        return boardRepository.save(existingBoard);
    }

    //delete

    @Override
    public boolean deleteBoard(int boardId) throws BoardNotFoundExecption {
        if (!boardRepository.existsById(boardId)){
            throw new BoardNotFoundExecption("Board not found with id"+boardId);
        }
        boardRepository.deleteById(boardId);
        return true;
    }

    @Override
    public List<Board> getBoardByStatus(String status) {
        return boardRepository.findByStatus(status);
    }

    @Override
    public List<Board> getBoardAssignedTo(String assignedTo) {
        return boardRepository.findByAssignedTo(assignedTo);
    }

    @Override
    public Board moveToArchive(int boardId) throws BoardNotFoundExecption {
        Board board=getBoardById(boardId);
        board.setStatus("archive");
        board.setUpdatedAt(LocalDate.now());
        return boardRepository.save(board);
    }

    @Override
    public Board restoreFromArchive(int boardId) throws BoardNotFoundExecption {
        Board board=getBoardById(boardId);
        board.setStatus("toDoList");
        board.setUpdatedAt(LocalDate.now());
        return boardRepository.save(board);
    }

    @Override
    public Board getByTaskId(String taskId) {
        return boardRepository.findByTaskIdContaining(taskId);
    }
}
