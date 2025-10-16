package com.kanbanServices.boardServices.controller;

import com.kanbanServices.boardServices.domain.Board;
import com.kanbanServices.boardServices.domain.Column;
import com.kanbanServices.boardServices.execption.BoardAlredyExistsException;
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
@CrossOrigin(origins = "http://localhost:3001")//allow ui(react) to call api
public class BoardController {

    private final BoardService boardService;
    private final RequestHelper requestHelper;

    @Autowired
    public BoardController(BoardService boardService, RequestHelper requestHelper) {
        this.boardService = boardService;
        this.requestHelper=requestHelper;
    }

    /*
     * Create a new board
     * POST http://localhost:8080/api/v1/board
     */

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
    /*
     * Get a board by ID
     * GET http://localhost:8080/api/v1/board/getboard/{boardId}
     */
    @GetMapping("/getboard/{boardId}")
    public ResponseEntity<?>getBoardById(@PathVariable int boardId){
        try {
            Board board=boardService.getBoardById(boardId);
            return new ResponseEntity<>(board,HttpStatus.OK);

        }catch (BoardNotFoundExecption execption){
            return new ResponseEntity<>(execption.getMessage(),HttpStatus.NOT_FOUND);
        }
    }
    /*
     * Get all boards
     * GET http://localhost:8080/api/v1/board/getallboards
     */
    @GetMapping("/getallboards")
    public ResponseEntity<List<Board>> getAllBoards() {
        List<Board> boards = boardService.getAllBoard();
        return new ResponseEntity<>(boards, HttpStatus.OK);
    }

    /*
     * Delete a board by ID
     * DELETE http://localhost:8080/api/v1/board/deleteboard/{boardId}
     */
    @DeleteMapping("/deleteboard/{boardId}")
    public ResponseEntity<?> deleteBoard(@PathVariable int boardId) {
        try {
            boolean deleted = boardService.deleteBoard(boardId);
            return new ResponseEntity<>("Board deleted successfully", HttpStatus.OK);
        } catch (BoardNotFoundExecption e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
        /*
        * Create a column inside a board
         * POST http://localhost:8080/api/v1/board/{boardId}/createcolumn
         * */
    @PostMapping("/{boardId}/createcolumn")
    public ResponseEntity<Board>createColumn(@PathVariable int boardId, @RequestBody Column column){
        try {
            Board uppdatedBoard=boardService.createBoardColumn(boardId,column);
            return new ResponseEntity<>(uppdatedBoard,HttpStatus.CREATED);
        }catch (BoardNotFoundExecption e){
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }catch (ColumnAlreadyExistsException e){
            return new ResponseEntity<>(null,HttpStatus.CONFLICT);
        }
    }
    /*
     * Get a column by ID
     * GET http://localhost:8080/api/v1/board/getcolumn/{columnId}
     */
    @GetMapping("/getcolumn/{columnId}")
    public ResponseEntity<Column> getColumnById(@PathVariable int columnId) {
        try {
            Column column = boardService.getColumnById(columnId);
            return new ResponseEntity<>(column, HttpStatus.OK);
        } catch (ColumnNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    /*
     * Get a column by name
     * GET http://localhost:8080/api/v1/board/getcolumnbyname/{columnName}
     */
    @GetMapping("/getcolumnbyname/{columnName}")
    public ResponseEntity<Column> getColumnByName(@PathVariable String columnName) {
        try {
            Column column = boardService.getColumnByName(columnName);
            return new ResponseEntity<>(column, HttpStatus.OK);
        } catch (ColumnNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    /*
     * Get all columns by position/order in a board
     * GET http://localhost:8080/api/v1/board/{boardId}/getcolumnsbyposition/{position}
     */
    @GetMapping("/{boardId}/getcolumnsbyposition/{position}")
    public ResponseEntity<List<Column>> getColumnsByPosition(
            @PathVariable int boardId,
            @PathVariable int position
    ) {
        List<Column> columns = boardService.getColumnsByPosition(boardId, position);
        return new ResponseEntity<>(columns, HttpStatus.OK);
    }

    // ===== Optional Checks ===== //

    /*
     * Check if a board exists
     * GET http://localhost:8080/api/v1/board/checkboard/{boardId}
     */
    @GetMapping("/checkboard/{boardId}")
    public ResponseEntity<Boolean> checkBoardExists(@PathVariable int boardId) {
        return new ResponseEntity<>(boardService.checkBoardExist(boardId), HttpStatus.OK);
    }
    /*
     * Check if a column exists (in any board)
     * GET http://localhost:8080/api/v1/board/checkcolumn/{columnId}
     */
    @GetMapping("/checkcolumn/{columnId}")
    public ResponseEntity<Boolean> checkColumnExists(@PathVariable int columnId) {
        return new ResponseEntity<>(boardService.checkColumnExists(columnId), HttpStatus.OK);
    }






}
