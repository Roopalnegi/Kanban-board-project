package com.kanbanServices.boardServices.controller;

import com.kanbanServices.boardServices.domain.Board;
import com.kanbanServices.boardServices.domain.Column;
import com.kanbanServices.boardServices.execption.BoardAlreadyExistsException;
import com.kanbanServices.boardServices.execption.BoardNotFoundExecption;
import com.kanbanServices.boardServices.execption.ColumnAlreadyExistsException;
import com.kanbanServices.boardServices.execption.ColumnNotFoundException;
import com.kanbanServices.boardServices.service.BoardService;
import com.kanbanServices.boardServices.utility.RequestHelper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/board")
public class BoardController
{

    private final BoardService boardService;
    private final RequestHelper requestHelper;

    @Autowired
    public BoardController(BoardService boardService, RequestHelper requestHelper)
    {
        this.boardService = boardService;
        this.requestHelper=requestHelper;
    }


    // ---------------- board related --------------------

    // method handle creating new board
    // will have same post url - http://localhost:8082/api/v1/board
    @PostMapping
    public ResponseEntity<?> createBoard (@RequestBody Board board, HttpServletRequest request)
    {
        try
        {
            // check if user is admin
            requestHelper.checkAdminRole(request);
            Board created = boardService.createBoard(board);
            System.out.println("Check create board :" + created);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        }
        catch (AccessDeniedException e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN);
        }
        catch (BoardAlreadyExistsException e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.CONFLICT);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // method to handle getting specific board by id
    @GetMapping("/getBoard/{boardId}")
    public ResponseEntity<?>getBoardById(@PathVariable String boardId)
    {
        try
        {
            Board board=boardService.getBoardById(boardId);
            return new ResponseEntity<>(board,HttpStatus.OK);
        }
        catch (BoardNotFoundExecption e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle getting all boards info
    @GetMapping("/getAllBoards")
    public ResponseEntity<?> getAllBoards()
    {
        try
        {
            List<Board> boards = boardService.getAllBoard();
            return new ResponseEntity<>(boards, HttpStatus.OK);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle deleting board by id
    @DeleteMapping("/deleteBoard/{boardId}")
    public ResponseEntity<?> deleteBoard(@PathVariable String  boardId,HttpServletRequest request)
    {
        try
        {
            // check if user is admin
            requestHelper.checkAdminRole(request);
            boolean deleted = boardService.deleteBoard(boardId);
            return new ResponseEntity<>("Board deleted successfully", HttpStatus.OK);
        }
        catch (AccessDeniedException e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN);
        }
        catch (BoardNotFoundExecption e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle updating board details
    @PutMapping("/updateBoard/{boardId}")
    public ResponseEntity<?>updateBoard(@PathVariable String boardId,@RequestBody Board updateBoardData)
    {
        try
        {
            Board updatedBoard=boardService.updateBoard(boardId,updateBoardData);
            return new ResponseEntity<>(updatedBoard,HttpStatus.OK);
        }
        catch (BoardNotFoundExecption e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    // ----------- column related ------------------



    // method to handle creating a board inside the column
    @PostMapping("/{boardId}/createColumn")
    public ResponseEntity<?> createColumn (@PathVariable String  boardId, @RequestBody Column column)
    {
        try
        {
            Column addedColumn = boardService.createBoardColumn(boardId,column);
            return new ResponseEntity<>(addedColumn,HttpStatus.CREATED);
        }
        catch (BoardNotFoundExecption e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        catch (ColumnAlreadyExistsException e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.CONFLICT);
        } catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle getting specific column by id
    @GetMapping("/getColumn/{columnId}")
    public ResponseEntity<?> getColumnById(@PathVariable String columnId)
    {
        try
        {
            Column column = boardService.getColumnById(columnId);
            return new ResponseEntity<>(column, HttpStatus.OK);
        }
        catch (ColumnNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle updating only column name
    @PutMapping("/{boardId}/updateColumnName/{columnId}")
    public ResponseEntity<?> updateColumnName(@PathVariable String boardId, @PathVariable String columnId, @RequestBody String columnNewName)
    {
        try
        {
            Column updatedColumn = boardService.updateBoardColumnName(boardId,columnId,columnNewName);
            return new ResponseEntity<>(updatedColumn, HttpStatus.OK);
        }
        catch (ColumnNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch(BoardNotFoundExecption e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle getting column by name
    @GetMapping("/getColumnByName/{columnName}")
    public ResponseEntity<?> getColumnByName(@PathVariable String columnName)
    {
        try
        {
            Column column = boardService.getColumnByName(columnName);
            return new ResponseEntity<>(column, HttpStatus.OK);
        }
        catch (ColumnNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    //method to handle deleting column from a board
    @DeleteMapping("/{boardId}/deleteColumn/{columnId}")
    public ResponseEntity<?> deleteBoardColumn(@PathVariable String boardId, @PathVariable String columnId)
    {
        try
        {
            boolean isDeleted = boardService.deleteBoardColumn(boardId, columnId);
            if (isDeleted)
            {
                return new ResponseEntity<>("Column deleted successfully.", HttpStatus.OK);
            }
            else
            {
                return new ResponseEntity<>("Column could not be deleted.", HttpStatus.BAD_REQUEST);
            }
        }
        catch (ColumnNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage() + columnId, HttpStatus.NOT_FOUND);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    // ----------- task service helpers ------------

    // method to handle checking board exist before assigning a task
    @GetMapping("/checkBoard/{boardId}")
    public ResponseEntity<?> checkBoardExists(@PathVariable String  boardId)
    {
        try
        {
            return new ResponseEntity<>(boardService.checkBoardExistForTask(boardId), HttpStatus.OK);
        }
        catch (BoardNotFoundExecption e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle checking if column with a given ID belongs to that specific board
    @GetMapping("{boardId}/checkColumn/{columnId}")
    public ResponseEntity<?> checkColumnExists(@PathVariable String boardId, @PathVariable String columnId)
    {
        try
        {
            return new ResponseEntity<>(boardService.columnExistsInBoardForTask(boardId,columnId), HttpStatus.OK);
        }
        catch (BoardNotFoundExecption e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        catch (ColumnNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // method to handle fetch archive column id
    @GetMapping("/calculateArchiveColumnId/{boardId}")
    public ResponseEntity<?> calculateArchiveColumnId(@PathVariable String boardId)
    {
        try
        {
            String archivePosition = boardService.calculateArchiveColumnId(boardId);
            return new ResponseEntity<>(archivePosition, HttpStatus.OK);
        }
        catch (BoardNotFoundExecption e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }







}