package com.example.NotificationService.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class NotificationNotFoundException extends RuntimeException
{
    public NotificationNotFoundException(String message) {
        super(message);
    }
}
