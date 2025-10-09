package com.kanbanServices.userAuthenticationServices.repository;

import com.kanbanServices.userAuthenticationServices.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long>
{
    // finder method to find user by email
    Optional<User> findByEmail(String email);

}
