package com.kanbanServices.boardServices.execption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class BoardNotFoundExecption extends RuntimeException {
    public BoardNotFoundExecption(String message) {
        super(message);
    }
    //when given boardId is not found it says (404 not Found)
}
