package com.kanbanServices.userAuthenticationServices.service;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

// this class store otp temporary so that we can compare it later
@Service
public class OtpService
{

    // map to store email -> OTP  for checking otp
    private Map<String,String> emailOtpMap = new HashMap<>();


    // map to store email -> time  for checking time expiration
    private Map<String, LocalDateTime> emailTimeMap = new HashMap<>();



    // save OTP with current time
    public void saveOtp(String email, String otp)
    {
        emailOtpMap.put(email,otp);                // store email as key , OTP as value
        emailTimeMap.put(email,LocalDateTime.now());   // store email as key, time as value
    }



    // check if OTP is expired (1 minute)
    public boolean isOtpExpired(String email)
    {
        // check if email exits
        if(!emailOtpMap.containsKey(email))
        {
            return false;
        }

        LocalDateTime savedTime = emailTimeMap.get(email);         // time when OTP was saved
        LocalDateTime now = LocalDateTime.now();                   // current time

        long minutesPassed = Duration.between(savedTime,now).toMinutes();

        return (minutesPassed >= 1);

    }


    // remove OTP data
    public void removeOtp(String email)
    {
        emailOtpMap.remove(email);
        emailTimeMap.remove(email);
    }


    // verify OTP matches
    public boolean verifyOtp(String email, String userOtp)
    {
        // check if email exist
        if(!emailOtpMap.containsKey(email))
        {
            return false;
        }

        return emailOtpMap.get(email).equals(userOtp);
    }
}


/*
 Duration - class under java.time package
          - represent teh difference (time gap) b/w two LocalDateTime values
          - give answer in min and sec
 so, use toMinutes() to convert duration into total minutes i.e. 4 min 30 sec ---> 4 min
 */