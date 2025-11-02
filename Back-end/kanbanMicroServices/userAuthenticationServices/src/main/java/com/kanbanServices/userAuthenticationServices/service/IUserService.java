package com.kanbanServices.userAuthenticationServices.service;

import com.kanbanServices.userAuthenticationServices.domain.User;
import com.kanbanServices.userAuthenticationServices.exception.InvalidPasswordException;
import com.kanbanServices.userAuthenticationServices.exception.UserAlreadyExistsException;
import com.kanbanServices.userAuthenticationServices.exception.UserNotFoundException;

import java.util.List;
import java.util.Map;
import java.util.Optional;


public interface IUserService
{

   // login method
   User loginUser(User user) throws UserNotFoundException, InvalidPasswordException;

   // register method
   User registerUser(User newUser) throws UserAlreadyExistsException;

   // find user by email
   Optional<User> findByEmail(String email);

   //----------------- helper method -------------------------
   // return userid map with email for task service assignedTo property
   Map<Long,String> fetchAllEmployees ();

   // fetch all registered users for chat
   List<Map<String,Object>> getAllRegisteredUsers();


}
