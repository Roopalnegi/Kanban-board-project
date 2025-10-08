package com.kanbanServices.userAuthenticationServices.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "users_data")
public class User
{
    // private variables
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String emailId;
    private String password;
    private String role;

    // empty constructor
    public User()
    {}

    // parameterized constructor
    public User(Long userId, String emailId, String password, String role)
    {
        this.userId = userId;
        this.emailId = emailId;
        this.password = password;
        this.role = role;
    }

    // getters and setters
    public Long getUserId() {return userId;}
    public void setUserId(Long userId) {this.userId = userId;}
    public String getEmailId() {return emailId;}
    public void setEmailId(String emailId) {this.emailId = emailId;}
    public String getPassword() {return password;}
    public void setPassword(String password) {this.password = password;}
    public String getRole() {return role;}
    public void setRole(String role) {this.role = role;}

    // toString()
    @Override
    public String toString() {
        return "User{" +
                "userId='" + userId + '\'' +
                ", emailId='" + emailId + '\'' +
                ", password='" + password + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
