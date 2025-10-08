package com.kanbanServices.userAuthenticationServices.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// When user enter wrong password -- 401 unauthorized

@ResponseStatus(code = HttpStatus.UNAUTHORIZED)
public class InvalidPasswordException extends Exception
{
    public InvalidPasswordException(String message)
    {
        super(message);
    }
}

