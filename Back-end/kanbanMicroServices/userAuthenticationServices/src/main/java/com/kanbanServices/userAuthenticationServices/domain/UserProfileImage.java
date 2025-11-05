package com.kanbanServices.userAuthenticationServices.domain;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


import java.util.Arrays;

@Document(collection = "user_profile_image")
public class UserProfileImage
{
    @Id
    private String image_Id;
    private Long userId;
    private String fileName;
    private String contentType;
    private byte[] imageData;            // store raw binary data i.e. image data


    public UserProfileImage()
    {}


    public UserProfileImage(String image_Id, Long userId, String fileName, String contentType, byte[] imageData)
    {
        this.image_Id = image_Id;
        this.userId = userId;
        this.fileName = fileName;
        this.contentType = contentType;
        this.imageData = imageData;
    }


    public String getImage_Id() {return image_Id;}
    public void setImage_Id(String image_Id) {this.image_Id = image_Id;}
    public Long getUserId() {return userId;}
    public void setUserId(Long userId) {this.userId = userId;}
    public String getFileName() {return fileName;}
    public void setFileName(String fileName) {this.fileName = fileName;}
    public String getContentType() {return contentType;}
    public void setContentType(String contentType) {this.contentType = contentType;}
    public byte[] getImageData() {return imageData;}
    public void setImageData(byte[] imageData) {this.imageData = imageData;}


    @Override
    public String toString() {
        return "UserProfileImage{" +
                "image_Id='" + image_Id + '\'' +
                ", userId=" + userId +
                ", fileName='" + fileName + '\'' +
                ", contentType='" + contentType + '\'' +
                ", imageData=" + Arrays.toString(imageData) +
                '}';
    }
}
