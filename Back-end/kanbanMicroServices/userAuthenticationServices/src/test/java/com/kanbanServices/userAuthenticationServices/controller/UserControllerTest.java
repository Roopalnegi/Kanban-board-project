package com.kanbanServices.userAuthenticationServices.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kanbanServices.userAuthenticationServices.domain.User;
import com.kanbanServices.userAuthenticationServices.exception.InvalidPasswordException;
import com.kanbanServices.userAuthenticationServices.exception.UserNotFoundException;
import com.kanbanServices.userAuthenticationServices.service.SecurityTokenGenerator;
import com.kanbanServices.userAuthenticationServices.service.UserServiceImpl;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest
{
    @Mock
    private UserServiceImpl userService;

    @Mock
    private SecurityTokenGenerator securityTokenGenerator;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;
    private User user1;

    @BeforeEach
    public void setUp()
    {
       user1 = new User(null,"user1","user1@gmail.com", "password1", "employee");
       mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @AfterEach
    public void tearDown()
    {
        user1 = null;
        mockMvc = null;
    }

    @Test
    @DisplayName("Should login successfully with correct credentials")
    public void testLoginUser_Success() throws Exception
    {
        // mock userService and token generator
        when(userService.loginUser(any())).thenReturn(user1);
        when(securityTokenGenerator.generateToken(any(User.class)))
                .thenReturn(Map.of("token", "dummyToken", "message", "User logged-in successfully"));

        mockMvc.perform(post("/api/v1/user/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonToString(user1)))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

        verify(userService,times(1)).loginUser(any(User.class));
        verify(securityTokenGenerator,times(1)).generateToken(any(User.class));
    }


    @Test
    @DisplayName("Should Login failure - UserNotFoundException")
    public void testLoginUser_UserNotFound() throws Exception
    {
        when(userService.loginUser(any())).thenThrow(UserNotFoundException.class);

        mockMvc.perform(post("/api/v1/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonToString(user1)))
                .andExpect(status().isNotFound())
                .andDo(MockMvcResultHandlers.print());

        verify(userService,times(1)).loginUser(any(User.class));
        verify(securityTokenGenerator,never()).generateToken(any(User.class));         // token should not generate of user not found
    }

    @Test
    @DisplayName("Should return Login Failure - InvalidPasswordException")
    public void testLoginUser_InvalidPassword() throws Exception
    {
        when(userService.loginUser(any())).thenThrow(InvalidPasswordException.class);

        mockMvc.perform(post("/api/v1/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonToString(user1)))
                .andExpect(status().isUnauthorized())
                .andDo(MockMvcResultHandlers.print());

        verify(userService,times(1)).loginUser(any());
        verify(securityTokenGenerator,never()).generateToken(any(User.class));         // token should not generate if wrong password is given

    }


    // helper method to convert java object to json string
    private static String jsonToString(final Object obj) throws JsonProcessingException
    {
        String result;
        try
        {
            ObjectMapper mapper = new ObjectMapper();
            String jsonContent = mapper.writeValueAsString(obj);
            result = jsonContent;
        }
        catch (JsonProcessingException e)
        {
            result = "Json Processing error";
        }
        return result;
    }



}
