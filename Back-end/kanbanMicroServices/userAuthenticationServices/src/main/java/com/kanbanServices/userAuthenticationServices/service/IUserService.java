package com.kanbanServices.userAuthenticationServices.service;

import com.kanbanServices.userAuthenticationServices.domain.User;
import com.kanbanServices.userAuthenticationServices.exception.InvalidPasswordException;
import com.kanbanServices.userAuthenticationServices.exception.UserAlreadyExistsException;
import com.kanbanServices.userAuthenticationServices.exception.UserNotFoundException;


public interface IUserService
{

   // login method
   User loginUser(User user) throws UserNotFoundException, InvalidPasswordException;


   // register method
   User registerUser(User newUser) throws UserAlreadyExistsException;


}
