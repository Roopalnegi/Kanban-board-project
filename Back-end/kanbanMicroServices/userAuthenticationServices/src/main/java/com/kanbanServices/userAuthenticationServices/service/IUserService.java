package com.kanbanServices.userAuthenticationServices.service;

import com.kanbanServices.userAuthenticationServices.domain.User;
import com.kanbanServices.userAuthenticationServices.exception.InvalidPasswordException;
import com.kanbanServices.userAuthenticationServices.exception.UserNotFoundException;


public interface IUserService
{

   // login method
   public User loginUser(User user) throws UserNotFoundException, InvalidPasswordException;


}
