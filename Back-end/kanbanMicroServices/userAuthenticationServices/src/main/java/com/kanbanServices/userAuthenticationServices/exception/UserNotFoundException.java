package com.kanbanServices.userAuthenticationServices.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// when existence user not found i.e. 404 -- not found
@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class UserNotFoundException extends Exception
{
    public UserNotFoundException(String message)
    {
        super(message);
    }
}
