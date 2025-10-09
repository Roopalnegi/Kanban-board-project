package com.kanbanServices.taskServices.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// when given tasks id is not found -- 404 NOT FOUND

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class TaskNotFoundException extends Exception
{
    public TaskNotFoundException(String message) {
        super(message);
    }
}
