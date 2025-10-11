package com.kanbanServices.boardServices.controller;

import com.kanbanServices.boardServices.domain.Board;
import com.kanbanServices.boardServices.execption.BoardAlredyExistsException;
import com.kanbanServices.boardServices.execption.BoardNotFoundExecption;
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
@CrossOrigin(origins = "http://localhost:3001")//allow ui(react) to call api
public class BoardController {

    private final BoardService boardService;
    private final RequestHelper requestHelper;

    @Autowired
    public BoardController(BoardService boardService,RequestHelper requestHelper) {
        this.boardService = boardService;
        this.requestHelper=requestHelper;
    }

    @PostMapping
    public ResponseEntity<?>createBoard(@RequestBody Board board, HttpServletRequest request){
        try {
            requestHelper.checkAdminRole(request);
            Board created=boardService.createBoard(board);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        }catch (AccessDeniedException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN);
        }
        catch (BoardAlredyExistsException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.CONFLICT);
        }
    }
    @GetMapping("/{boardId}")
    public ResponseEntity<?>getBoardById(@PathVariable int boardId){
        try {
            Board board=boardService.getBoardById(boardId);
            return new ResponseEntity<>(board,HttpStatus.OK);

        }catch (BoardNotFoundExecption execption){
            return new ResponseEntity<>(execption.getMessage(),HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<?> deleteBoard(@PathVariable int boardId) {
        try {
            boolean deleted = boardService.deleteBoard(boardId);
            return new ResponseEntity<>("Board deleted successfully", HttpStatus.OK);
        } catch (BoardNotFoundExecption e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/status/{status}")
    public ResponseEntity<List<Board>> getBoardsByStatus(@PathVariable String status) {
        return new ResponseEntity<>(boardService.getBoardByStatus(status), HttpStatus.OK);
    }

    @GetMapping("/assignedTo/{assignedTo}")
    public ResponseEntity<List<Board>> getBoardsByAssignedTo(@PathVariable String assignedTo) {
        return new ResponseEntity<>(boardService.getBoardAssignedTo(assignedTo), HttpStatus.OK);
    }


    @PutMapping("/{boardId}/archive")
    public ResponseEntity<?> moveToArchive(@PathVariable int boardId) {
        try {
            Board archivedBoard = boardService.moveToArchive(boardId);
            return new ResponseEntity<>(archivedBoard, HttpStatus.OK);
        } catch (BoardNotFoundExecption e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }


    @PutMapping("/{boardId}/restore")
    public ResponseEntity<?> restoreFromArchive(@PathVariable int boardId) {
        try {
            Board restoredBoard = boardService.restoreFromArchive(boardId);
            return new ResponseEntity<>(restoredBoard, HttpStatus.OK);
        } catch (BoardNotFoundExecption e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/task/{taskId}")
    public ResponseEntity<?> getBoardByTaskId(@PathVariable String taskId) {
        Board board = boardService.getByTaskId(taskId);
        if (board != null)
            return new ResponseEntity<>(board, HttpStatus.OK);
        else
            return new ResponseEntity<>("No board found for task ID: " + taskId, HttpStatus.NOT_FOUND);
    }
}
