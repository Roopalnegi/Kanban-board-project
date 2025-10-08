package com.kanbanServices.userAuthenticationServices.service;


import com.kanbanServices.userAuthenticationServices.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.*;

import java.util.Map;

public class JwtSecurityGeneratorImplTest
{
    private User user;
    private JwtSecurityGeneratorImpl jwtGenerator;

    @BeforeEach
    public void setUp()
    {
        jwtGenerator = new JwtSecurityGeneratorImpl();
        user = new User(null, "user@gmail.com", "password", "user");
    }

    @AfterEach
    public void tearDown()
    {
        jwtGenerator = null;
        user = null;
    }

    @Test
    @DisplayName("Should return token if correct credentials is given")
    public void testTokenGenerate_Success()
    {
        Map<String,String> generatedToken = jwtGenerator.generateToken(user);

        String generatedTokenMessage = generatedToken.get("message");
        String generatedTokenValue = generatedToken.get("token");

        Assertions.assertNotNull(generatedToken);
        Assertions.assertFalse(generatedTokenValue.isEmpty());
        Assertions.assertEquals("User logged-in successfully", generatedTokenMessage);

        // decode the token and validate claims
        Claims claims = Jwts.parser()
                        .setSigningKey("secretKey123")
                        .parseClaimsJws(generatedTokenValue)
                        .getBody();

        Assertions.assertEquals("user@gmail.com", claims.getSubject());
        Assertions.assertEquals("user", claims.get("role"));

    }


    @Test
    @DisplayName("Should throw null pointer exception if user is null")
    public void testTokenGenerate_NullUser()
    {
        Assertions.assertThrows(NullPointerException.class, () -> jwtGenerator.generateToken(null));
    }

}
