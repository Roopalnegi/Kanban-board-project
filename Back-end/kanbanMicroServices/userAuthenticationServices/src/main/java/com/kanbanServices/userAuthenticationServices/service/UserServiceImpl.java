package com.kanbanServices.userAuthenticationServices.service;

import com.kanbanServices.userAuthenticationServices.domain.User;
import com.kanbanServices.userAuthenticationServices.exception.InvalidPasswordException;
import com.kanbanServices.userAuthenticationServices.exception.UserAlreadyExistsException;
import com.kanbanServices.userAuthenticationServices.exception.UserNotFoundException;
import com.kanbanServices.userAuthenticationServices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


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

    @Override
    public Map<Long, String> fetchAllEmployees()
    {
        List<User> users = userRepository.findAll();

        // map will look like this { 101=John Doe - john@example.com}
        Map<Long, String> employeeDetails = users.stream()
                .filter(u -> "employee".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toMap(User::getUserId,                        // key -- userID
                         u -> u.getUsername() + "-" + u.getEmail()));       // value -- username - email


        return employeeDetails;
    }


    // return like that
    // {
    //    "id": 1,
    //    "username": "Alice",
    //    "email": "alice@example.com"
    //  },
    @Override
    public List<Map<String,Object>> getAllRegisteredUsers()
    {

        return userRepository.findAll()
                .stream()
                .map(u -> {
                                 Map<String, Object> map = new HashMap<>();
                                 map.put("id", u.getUserId());
                                 map.put("username", u.getUsername());
                                 map.put("email", u.getEmail());
                                 return map;
                               })
                .collect(Collectors.toList());

    }


}
