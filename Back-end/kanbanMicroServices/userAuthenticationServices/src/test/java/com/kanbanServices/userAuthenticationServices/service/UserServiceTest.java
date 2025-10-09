package com.kanbanServices.userAuthenticationServices.service;

import com.kanbanServices.userAuthenticationServices.domain.User;
import com.kanbanServices.userAuthenticationServices.exception.InvalidPasswordException;
import com.kanbanServices.userAuthenticationServices.exception.UserAlreadyExistsException;
import com.kanbanServices.userAuthenticationServices.exception.UserNotFoundException;
import com.kanbanServices.userAuthenticationServices.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest
{
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private UserServiceImpl userService;

    User user1;

    @BeforeEach
    public void setUp()
    {
        user1 = new User(null,"user1","user1@gmail.com", "password1","employee");
    }

    @AfterEach
    public void tearDown()
    {
        user1 = null;
    }

    @Test
    @DisplayName("Should return if correct emailId and password are given")
    public void testLoginUser_Success() throws UserNotFoundException, InvalidPasswordException
    {
        when(userRepository.findByEmail("user1@gmail.com")).thenReturn(Optional.of(user1));

        User foundUser = userService.loginUser(user1);

        Assertions.assertNotNull(foundUser);
        Assertions.assertEquals("user1@gmail.com", foundUser.getEmail());
        Assertions.assertEquals("password1", foundUser.getPassword());

        verify(userRepository, times(1)).findByEmail("user1@gmail.com");
    }

    @Test
    @DisplayName("Should throw UserNotFound exception if user does not exist")
    public void testLoginUser_UserNotFound() throws UserNotFoundException, InvalidPasswordException
    {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        Assertions.assertThrows(UserNotFoundException.class,
                   () -> userService.loginUser(new User(null, "user2","user2@gmail.com", "password2", "user")));

        verify(userRepository, times(1)).findByEmail(anyString());
    }

    @Test
    @DisplayName("Should throw InvalidPassword exception if user enter wrong password")
    public void testLoginUser_InvalidPassword() throws UserNotFoundException, InvalidPasswordException
    {
        when(userRepository.findByEmail("user1@gmail.com")).thenReturn(Optional.of(user1));

        Assertions.assertThrows(InvalidPasswordException.class,
                () -> userService.loginUser(new User(null, "user1","user1@gmail.com", "wrongpassword", "user")));

        verify(userRepository, times(1)).findByEmail("user1@gmail.com");;
    }

    @Test
    @DisplayName("Should register if new credentials are given")
    public void testRegisterUser_Success() throws UserAlreadyExistsException
    {
        when(userRepository.findByEmail(user1.getEmail())).thenReturn(Optional.empty());
        when(userRepository.save(user1)).thenReturn(user1);

        User savedUser = userService.registerUser(user1);

        Assertions.assertNotNull(savedUser);
        Assertions.assertEquals(user1.getEmail(), savedUser.getEmail());
        verify(userRepository, times(1)).findByEmail(user1.getEmail());
        verify(userRepository, times(1)).save(user1);
    }

    @Test
    @DisplayName("Should throw UserAlreadyExists exception if email already registered")
    public void testRegisterUser_UserAlreadyExists() throws UserAlreadyExistsException
    {
        when(userRepository.findByEmail(user1.getEmail())).thenReturn(Optional.of(user1));

        Assertions.assertThrows(UserAlreadyExistsException.class,
                () -> userService.registerUser(user1));

        verify(userRepository, times(1)).findByEmail(user1.getEmail());
        verify(userRepository, never()).save(any());
    }


}
