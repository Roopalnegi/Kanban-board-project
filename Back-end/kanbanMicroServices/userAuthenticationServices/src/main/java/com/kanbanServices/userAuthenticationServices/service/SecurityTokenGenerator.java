package com.kanbanServices.userAuthenticationServices.service;

import com.kanbanServices.userAuthenticationServices.domain.User;

import java.util.Map;

public interface SecurityTokenGenerator
{
    // method to generate jwt token
    public Map<String,String> generateToken(User user);
}
