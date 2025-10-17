package com.kanbanServices.boardServices.execption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT)
public class BoardAlredyExistsException extends RuntimeException {
    public BoardAlredyExistsException(String message) {
        super(message);
    }
    //when boardId is already present it show (409-conflict)
}
