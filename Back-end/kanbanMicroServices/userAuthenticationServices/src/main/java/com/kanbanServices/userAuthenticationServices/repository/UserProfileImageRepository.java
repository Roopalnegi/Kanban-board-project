package com.kanbanServices.userAuthenticationServices.repository;

import com.kanbanServices.userAuthenticationServices.domain.UserProfileImage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserProfileImageRepository extends MongoRepository<UserProfileImage, String>
{
    Optional<UserProfileImage> findByUserId(Long userId);
}
