package com.kanbanServices.userAuthenticationServices.service;

import com.kanbanServices.userAuthenticationServices.domain.User;
import com.kanbanServices.userAuthenticationServices.exception.InvalidPasswordException;
import com.kanbanServices.userAuthenticationServices.exception.UserAlreadyExistsException;
import com.kanbanServices.userAuthenticationServices.exception.UserNotFoundException;

import java.util.Optional;


public interface IUserService
{

   // login method
   User loginUser(User user) throws UserNotFoundException, InvalidPasswordException;


   // register method
   User registerUser(User newUser) throws UserAlreadyExistsException;

   // find user by email
   Optional<User> findByEmail(String email);

}
