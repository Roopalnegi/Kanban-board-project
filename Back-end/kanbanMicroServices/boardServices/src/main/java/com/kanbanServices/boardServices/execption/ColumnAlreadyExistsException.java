package com.kanbanServices.boardServices.execption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT)
public class ColumnAlreadyExistsException extends RuntimeException {
    public ColumnAlreadyExistsException(String message) {
        super(message);
    }
}
/*
When column with same name exists	"Column 'To Do' already exists"
https code 409 will appear with message column already exists*/