package com.kanbanServices.taskServices.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Employee already has 5 active tasks : Cannot assign more !")
public class MaxTaskLimitReachedException extends Exception
{

}
