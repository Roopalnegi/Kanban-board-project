package com.kanbanServices.userAuthenticationServices.service;

import com.kanbanServices.userAuthenticationServices.domain.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtSecurityGeneratorImpl implements SecurityTokenGenerator
{

    @Override
    public Map<String, String> generateToken(User user)
    {
        String jwtToken = null;

        jwtToken = Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role",user.getRole())
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, "secretKey123")
                .compact();

        Map<String,String> map = new HashMap<>();
        map.put("token",jwtToken);
        map.put("message", "User logged-in successfully");

        return map;
    }
}
