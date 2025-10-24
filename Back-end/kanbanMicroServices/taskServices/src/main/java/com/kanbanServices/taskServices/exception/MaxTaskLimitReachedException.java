package com.kanbanServices.taskServices.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
@ResponseBody
public class MaxTaskLimitReachedException extends Exception
{
    public MaxTaskLimitReachedException(String message) {super(message);}
}

/*
@ResponseBody forces Spring to serialize the exception message properly.
Axios will then get the message in response.data.
 */