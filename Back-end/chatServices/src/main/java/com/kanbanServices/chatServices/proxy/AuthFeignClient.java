package com.kanbanServices.chatServices.proxy;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

// Connects with userAuthService (make sure the service name matches in your properties)
@FeignClient(name = "UserAuthenticationService", url = "http://localhost:8081/api/v1/user")
public interface AuthFeignClient
{
    // call a validation endpoint in UserAuthentication Service
    @GetMapping("/validateToken")
    Map<String,String> validateToken(@RequestHeader("Authorization") String token);


    // call user authentication service to get all employee details
    @GetMapping("/fetchAllEmployeeDetails")
    Map<Long,String> fetchAllEmployeeDetails();

}