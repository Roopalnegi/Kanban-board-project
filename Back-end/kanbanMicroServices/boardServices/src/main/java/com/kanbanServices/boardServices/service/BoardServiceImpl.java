package com.kanbanServices.boardServices.service;

import com.kanbanServices.boardServices.domain.Board;
import com.kanbanServices.boardServices.domain.Column;
import com.kanbanServices.boardServices.execption.BoardAlredyExistsException;
import com.kanbanServices.boardServices.execption.BoardNotFoundExecption;
import com.kanbanServices.boardServices.execption.ColumnAlreadyExistsException;
import com.kanbanServices.boardServices.execption.ColumnNotFoundException;
import com.kanbanServices.boardServices.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.spel.ast.OpAnd;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        if(boardRepository.findByBoardIdAndBoardName(board.getBoardId(),board.getBoardName()).isPresent())
        {
            throw new BoardAlredyExistsException("Board already exists with id : " + board.getBoardId());
        }
        board.setCreatedAt(LocalDate.now());

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


    //delete
    @Override
    public boolean deleteBoard(int boardId) throws BoardNotFoundExecption {
        if (!boardRepository.existsById(boardId)){
            throw new BoardNotFoundExecption("Board not found with id"+boardId);
        }
        boardRepository.deleteById(boardId);
        return true;
    }

    //checking board exists

    @Override
    public boolean checkBoarExist(int boardId) {
        return boardRepository.findByBoardId(boardId).isPresent();
    }

    @Override
    public boolean checkColumnExists(int columnId) {
        return boardRepository.findByColumnId(columnId).isPresent();
    }

    public Board createBoardColumn(int boardId, Column column)throws ColumnAlreadyExistsException,BoardNotFoundExecption{
        Board board=getBoardById(boardId);//validate board exists
        if(board.getColumns()==null){
            board.setColumns(new ArrayList<>());
        }
        //check if column already exists
        boolean columnExist=board.getColumns().stream().anyMatch(c->c.getColumnId()==column.getColumnId()||
                c.getColumnName().equalsIgnoreCase(column.getColumnName()));
        if(columnExist){
            throw new ColumnAlreadyExistsException("column already exixts");
        }
        board.getColumns().add(column);
        return boardRepository.save(board);

    }

//get column by id (searching through board)
    public Column getColumnById(int columnId)throws ColumnNotFoundException{
        Board board=boardRepository.findByColumnId(columnId).orElseThrow(()->
                new ColumnNotFoundException("column not found by this id"));
        return board.getColumns().stream().filter(c->c.getColumnId()==columnId)
                .findFirst()
                .orElseThrow(()->new ColumnNotFoundException("column not found"));
    }

    @Override
    public Column getColumnByName(String columnName) throws ColumnNotFoundException {
        List<Board>boards=boardRepository.findByColumnName(columnName);
        if (boards.isEmpty()){
            throw new ColumnNotFoundException(("no column found by id"));
        }

        for (Board board:boards){
            for (Column column:board.getColumns()){
                if (column.getColumnName().equalsIgnoreCase(columnName)){
                    return column;
                }
            }
        }
        throw new ColumnNotFoundException("column with name"+columnName);
    }

    @Override
    public List<Column> getColumnsByPosition(int boardId, int position) {
        Optional<Board>board=boardRepository.findByBoardId(boardId);
        if (board.isEmpty()||board.get().getColumns()==null){
            return new ArrayList<>();
        }
        Board boards=board.get();
        List<Column>match=new ArrayList<>();
        for (Column c:boards.getColumns()){
            if (c.getColumnOrder()==position){
                match.add(c);
            }
        }
        return match;
    }
}
