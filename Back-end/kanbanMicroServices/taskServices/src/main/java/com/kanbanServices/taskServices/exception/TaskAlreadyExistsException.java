package com.kanbanServices.taskServices.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// when task is already exists -- 409 CONFLICT

@ResponseStatus(code = HttpStatus.CONFLICT)
public class TaskAlreadyExistsException extends Exception
{
    public TaskAlreadyExistsException(String message)
    {
        super(message);
    }
}
