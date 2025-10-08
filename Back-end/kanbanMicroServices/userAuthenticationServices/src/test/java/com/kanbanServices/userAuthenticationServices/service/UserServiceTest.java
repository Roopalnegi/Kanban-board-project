package com.kanbanServices.userAuthenticationServices.service;

import com.kanbanServices.userAuthenticationServices.domain.User;
import com.kanbanServices.userAuthenticationServices.exception.InvalidPasswordException;
import com.kanbanServices.userAuthenticationServices.exception.UserNotFoundException;
import com.kanbanServices.userAuthenticationServices.repository.IUserRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest
{
    @Mock
    private IUserRepository userRepository;
    @InjectMocks
    private UserServiceImpl userService;

    User user1;

    @BeforeEach
    public void setUp()
    {
        user1 = new User(null,"user1@gmail.com", "password1","user");
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
        when(userRepository.findByEmailId("user1@gmail.com")).thenReturn(user1);

        User foundUser = userService.loginUser(user1);

        Assertions.assertNotNull(foundUser);
        Assertions.assertEquals("user1@gmail.com", foundUser.getEmailId());
        Assertions.assertEquals("password1", foundUser.getPassword());

        verify(userRepository, times(1)).findByEmailId("user1@gmail.com");
    }

    @Test
    @DisplayName("Should throw UserNotFound exception if user does not exist")
    public void testLoginUser_UserNotFound() throws UserNotFoundException, InvalidPasswordException
    {
        when(userRepository.findByEmailId(anyString())).thenReturn(null);

        Assertions.assertThrows(UserNotFoundException.class,
                   () -> userService.loginUser(new User(null, "user2@gmail.com", "password2", "user")));

        verify(userRepository, times(1)).findByEmailId(anyString());
    }

    @Test
    @DisplayName("Should throw InvalidPassword exception if user enter wrong password")
    public void testLoginUser_InvalidPassword() throws UserNotFoundException, InvalidPasswordException
    {
        when(userRepository.findByEmailId("user1@gmail.com")).thenReturn(user1);

        Assertions.assertThrows(InvalidPasswordException.class,
                () -> userService.loginUser(new User(null, "user1@gmail.com", "wrongpassword", "user")));

        verify(userRepository, times(1)).findByEmailId("user1@gmail.com");;
    }

}
