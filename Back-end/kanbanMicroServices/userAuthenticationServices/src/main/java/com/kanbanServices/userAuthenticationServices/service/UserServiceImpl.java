package com.kanbanServices.userAuthenticationServices.service;

import com.kanbanServices.userAuthenticationServices.domain.User;
import com.kanbanServices.userAuthenticationServices.exception.InvalidPasswordException;
import com.kanbanServices.userAuthenticationServices.exception.UserNotFoundException;
import com.kanbanServices.userAuthenticationServices.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpl implements IUserService
{
    private final IUserRepository userRepository;

    @Autowired
    public UserServiceImpl(IUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }


    // method to login user
    @Override
    public User loginUser(User user) throws UserNotFoundException, InvalidPasswordException
    {
        // find user by its emailId
        User foundUser = userRepository.findByEmailId(user.getEmailId());

        // if user not found
        if(foundUser == null)
        {
            throw new UserNotFoundException("User not found with email : " + user.getEmailId());
        }

        // if user found, check password
        if(!foundUser.getPassword().equals(user.getPassword()))
        {
            throw new InvalidPasswordException("Invalid password");
        }

        // if both username and password match, return user
        return foundUser;
    }





}
