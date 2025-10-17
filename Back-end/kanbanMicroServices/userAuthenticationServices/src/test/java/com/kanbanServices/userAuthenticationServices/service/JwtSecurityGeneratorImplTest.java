//package com.kanbanServices.userAuthenticationServices.service;
//
//
//import com.kanbanServices.userAuthenticationServices.domain.User;
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import org.junit.jupiter.api.*;
//
//import java.util.Map;
//
//public class JwtSecurityGeneratorImplTest
//{
//    private User user1;
//    private JwtSecurityGeneratorImpl jwtGenerator;
//
//    @BeforeEach
//    public void setUp()
//    {
//        jwtGenerator = new JwtSecurityGeneratorImpl();
//        user1 = new User(null, "user1","user1@gmail.com", "password1", "employee");
//    }
//
//    @AfterEach
//    public void tearDown()
//    {
//        jwtGenerator = null;
//        user1 = null;
//    }
//
//    @Test
//    @DisplayName("Should return token if correct credentials is given")
//    public void testTokenGenerate_Success()
//    {
//        Map<String,String> generatedToken = jwtGenerator.generateToken(user1);
//
//        String generatedTokenMessage = generatedToken.get("message");
//        String generatedTokenValue = generatedToken.get("token");
//
//        Assertions.assertNotNull(generatedToken);
//        Assertions.assertFalse(generatedTokenValue.isEmpty());
//        Assertions.assertEquals("User logged-in successfully", generatedTokenMessage);
//
//        // decode the token and validate claims
//        Claims claims = Jwts.parser()
//                        .setSigningKey("secretKey123")
//                        .parseClaimsJws(generatedTokenValue)
//                        .getBody();
//
//        Assertions.assertEquals("user1@gmail.com", claims.getSubject());
//        Assertions.assertEquals("employee", claims.get("role"));
//
//    }
//
//
//    @Test
//    @DisplayName("Should throw null pointer exception if user is null")
//    public void testTokenGenerate_NullUser()
//    {
//        Assertions.assertThrows(NullPointerException.class, () -> jwtGenerator.generateToken(null));
//    }
//
//}
