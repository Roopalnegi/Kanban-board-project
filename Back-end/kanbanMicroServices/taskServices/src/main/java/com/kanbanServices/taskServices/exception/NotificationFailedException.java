package com.kanbanServices.taskServices.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
public class NotificationFailedException extends RuntimeException
{
    public NotificationFailedException(String message) {
        super(message);
    }
}
