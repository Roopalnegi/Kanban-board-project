package com.kanbanServices.taskServices.configuration;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignClientInterceptor implements RequestInterceptor
{
    // this method is called before every fiegn client request
    // RequestTemplate represent - outgoing http request

    @Override
    public void apply(RequestTemplate template)
    {
        // get the current http request
        // RequestContextHolder allows access to the HTTP request that triggered this Feign call.
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        // check for null pointer exception
        if(attributes != null)
        {
            // extract the current http servlet request
            HttpServletRequest request = attributes.getRequest();

            // get authorization header from incoming request (jwt token)
            String authHeader = request.getHeader("Authorization");

            // if token exist, forward token the board service
            if(authHeader != null)
            {
                template.header("Authorization", authHeader);
            }
        }
    }
}


/*
 why we use feign client interceptor -
   This class automatically forwards the JWT (Authorization header) from incoming requests to all outgoing Feign client requests.

 The Problem was:
   - when taskService calls BoardService via Feign client
   - BoardService requires a valid JWT token to authorize the request.
   - Instead of manually passing the token in every Feign call, this interceptor
   - adds it automatically, making the code clean and maintainable.
 */
