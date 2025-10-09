package com.kanbanServices.userAuthenticationServices.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// when user already exists -- 409 CONFLICT

@ResponseStatus(code = HttpStatus.CONFLICT)
public class UserAlreadyExistsException extends Exception
{
    public UserAlreadyExistsException(String message)
    {
        super(message);
    }
}
