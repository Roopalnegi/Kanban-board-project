package com.kanbanServices.userAuthenticationServices.repository;

import com.kanbanServices.userAuthenticationServices.domain.User;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryTest
{
    private User user1;

    @Autowired
    private IUserRepository userRepository;

    @BeforeEach
    public void setUp()
    {
        user1 = new User(null, "user1@gmail.com", "password1", "user");
    }

    @AfterEach
    public void tearDown()
    {
        user1 = null;
        userRepository.deleteAll();          // clean from DB
    }

    @Test
    @DisplayName("Should return user if given correct password and emailId")
    public void testFindByEmailId_Success()
    {
        // save the user
        userRepository.save(user1);

        // find the user by emailId
        User foundUser = userRepository.findByEmailId("user1@gmail.com");

        // Assertions
        Assertions.assertNotNull(foundUser);
        Assertions.assertEquals("user1@gmail.com", foundUser.getEmailId());
        Assertions.assertEquals("password1", foundUser.getPassword());

    }

    @Test
    @DisplayName("Should return null when user not found by emailId")
    public void testFindByEmailId_Failure()
    {

        // find the user by emailId (noone@gmail.com is not exist in DB)
        User foundUser = userRepository.findByEmailId("noone@gmail.com");

        // Assertions
        Assertions.assertNull(foundUser);

    }

}
