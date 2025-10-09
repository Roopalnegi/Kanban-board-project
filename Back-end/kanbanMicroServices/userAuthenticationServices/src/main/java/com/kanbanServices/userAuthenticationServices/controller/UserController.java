package com.kanbanServices.userAuthenticationServices.controller;


import com.kanbanServices.userAuthenticationServices.domain.User;
import com.kanbanServices.userAuthenticationServices.exception.InvalidPasswordException;
import com.kanbanServices.userAuthenticationServices.exception.UserNotFoundException;
import com.kanbanServices.userAuthenticationServices.service.IUserService;
import com.kanbanServices.userAuthenticationServices.service.SecurityTokenGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3001")
@RequestMapping("/api/v1/user")
public class UserController
{
   private final IUserService userService;
   private final SecurityTokenGenerator securityTokenGenerator;

   @Autowired
   public UserController(IUserService userService, SecurityTokenGenerator securityTokenGenerator)
   {
        this.userService = userService;
        this.securityTokenGenerator = securityTokenGenerator;
   }


   // method to login
   @PostMapping("/login")
   public ResponseEntity<?> loginUser(@RequestBody User user) throws UserNotFoundException,InvalidPasswordException
   {
       try
       {
           Map<String,String> token = null;
           User foundUser = userService.loginUser(user);
           token = securityTokenGenerator.generateToken(foundUser);
           return new ResponseEntity<>(token,HttpStatus.OK);      // 200 OK -- success

       }
       catch(UserNotFoundException e)
       {
           // 404 -- NOT FOUND
           return new ResponseEntity<>("User not found with email : " + user.getEmailId(),HttpStatus.NOT_FOUND);
       }
       catch (InvalidPasswordException e)
       {
           // 401 -- UNAUTHORIZED
           return new ResponseEntity<>("Invalid password", HttpStatus.UNAUTHORIZED);
       }
       catch (Exception e)
       {
           // 500 -- INTERNAL SERVER ERROR
           return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
       }
   }
}
