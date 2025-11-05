package com.kanbanServices.userAuthenticationServices.service;

import com.kanbanServices.userAuthenticationServices.domain.UserProfileImage;
import com.kanbanServices.userAuthenticationServices.exception.ImageNotFoundException;
import com.kanbanServices.userAuthenticationServices.repository.UserProfileImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.ImagingOpException;
import java.io.IOException;
import java.util.Optional;

@Service
public class UserProfileImageService
{
    private final UserProfileImageRepository profileImageRepository;

    @Autowired
    public UserProfileImageService(UserProfileImageRepository profileImageRepository)
    {
        this.profileImageRepository = profileImageRepository;
    }

    // save image
    public Boolean saveImage(MultipartFile file, Long userId)
    {
        try
        {
            // delete previous image ---- allow re-upload
            Optional<UserProfileImage> existing = profileImageRepository.findByUserId(userId);
            existing.ifPresent(oldImage -> profileImageRepository.delete(oldImage));

            UserProfileImage profileImage = new UserProfileImage();
            profileImage.setImage_Id(file.getOriginalFilename());
            profileImage.setContentType(file.getContentType());
            profileImage.setUserId(userId);
            profileImage.setImageData(file.getBytes());        // this may throw io exception

            profileImageRepository.save(profileImage);
            return true;
        }
        catch (IOException e)
        {
            e.printStackTrace();
            return false;
        }

    }

    // get image
    public UserProfileImage getImage(Long userId) throws ImageNotFoundException
    {

        return profileImageRepository.findByUserId(userId)
                .orElseThrow(() -> new ImageNotFoundException());
    }
}
