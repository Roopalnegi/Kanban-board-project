package com.kanbanServices.userAuthenticationServices.repository;

import com.kanbanServices.userAuthenticationServices.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUserRepository extends JpaRepository<User,Long>
{
    // finder method to find user by emailId
    public User findByEmailId(String emailId);

}
