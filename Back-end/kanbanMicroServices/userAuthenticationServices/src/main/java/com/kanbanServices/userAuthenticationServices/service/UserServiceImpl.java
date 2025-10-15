package com.kanbanServices.userAuthenticationServices.service;

import com.kanbanServices.userAuthenticationServices.domain.User;
import com.kanbanServices.userAuthenticationServices.exception.InvalidPasswordException;
import com.kanbanServices.userAuthenticationServices.exception.UserAlreadyExistsException;
import com.kanbanServices.userAuthenticationServices.exception.UserNotFoundException;
import com.kanbanServices.userAuthenticationServices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserServiceImpl implements IUserService
{
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository)
    {
        this.userRepository = userRepository;
    }


    // method to login user
    @Override
    public User loginUser(User user) throws UserNotFoundException, InvalidPasswordException
    {
        // if user not found
        User foundUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email : " + user.getEmail()));


        // if user found, check password
        if(!foundUser.getPassword().equals(user.getPassword()))
        {
            throw new InvalidPasswordException("Invalid password");
        }

        // if both username and password match, return user
        return foundUser;
    }

    @Override
    public User registerUser(User newUser) throws UserAlreadyExistsException
    {
        // check if user already exists or not
        if(userRepository.findByEmail(newUser.getEmail()).isPresent())
        {
            throw new UserAlreadyExistsException("User Already Exists");
        }
        return userRepository.save(newUser);
    }


    @Override
    public Optional<User> findByEmail(String email)
    {
        return userRepository.findByEmail(email);
    }


}
