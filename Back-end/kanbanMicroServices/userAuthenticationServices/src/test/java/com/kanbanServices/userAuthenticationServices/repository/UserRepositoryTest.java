//package com.kanbanServices.userAuthenticationServices.repository;
//
//import com.kanbanServices.userAuthenticationServices.domain.User;
//import org.junit.jupiter.api.*;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//
//import java.util.Optional;
//
//@ExtendWith(SpringExtension.class)
//@DataJpaTest
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
//public class UserRepositoryTest
//{
//    private User user1;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @BeforeEach
//    public void setUp()
//    {
//        user1 = new User(null, "user1","user1@gmail.com", "password1", "employee");
//    }
//
//    @AfterEach
//    public void tearDown()
//    {
//        user1 = null;
//        userRepository.deleteAll();          // clean from DB
//    }
//
//    @Test
//    @DisplayName("Should return user if given correct password and emailId")
//    public void testFindByEmailId_Success()
//    {
//        // save the user
//        userRepository.save(user1);
//
//        // find the user by emailId
//        User foundUser = userRepository.findByEmail("user1@gmail.com").get();
//
//        // Assertions
//        Assertions.assertNotNull(foundUser);
//        Assertions.assertEquals("user1@gmail.com", foundUser.getEmail());
//        Assertions.assertEquals("password1", foundUser.getPassword());
//
//    }
//
//    @Test
//    @DisplayName("Should return null when user not found by emailId")
//    public void testFindByEmailId_Failure()
//    {
//
//        // find the user by emailId (noone@gmail.com is not exist in DB)
//        Optional<User> foundUser = userRepository.findByEmail("noone@gmail.com");
//
//        // Assertions
//        Assertions.assertTrue(foundUser.isEmpty());
//
//    }
//
//}
