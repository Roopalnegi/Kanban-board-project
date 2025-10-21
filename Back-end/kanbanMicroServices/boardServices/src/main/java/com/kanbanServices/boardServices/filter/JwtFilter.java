package com.kanbanServices.boardServices.filter;

import com.kanbanServices.boardServices.proxy.UserAuthClient;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Component
public class JwtFilter extends GenericFilterBean
{
    private final UserAuthClient userAuthClient;

    @Autowired
    public JwtFilter(UserAuthClient userAuthClient)
    {
        this.userAuthClient = userAuthClient;
    }


    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException
    {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;


        // Allow preflight requests to pass through
        if ("OPTIONS".equalsIgnoreCase(request.getMethod()))
        {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        // Step 1: Get Authorization header
        String authHeader = request.getHeader("Authorization");

        // Step 2: Check for Bearer token
        if (authHeader == null || !authHeader.startsWith("Bearer "))
        {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Missing Token\"}");
            return;
        }


        try
        {
            //validate token by calling userAuthenticationService by using feign client
            Map<String,String>userData=userAuthClient.validateToken(authHeader);
            //attach user info in the request
            request.setAttribute("email",userData.get("email"));
            request.setAttribute("role",userData.get("role"));
            // continue with filter chain
            filterChain.doFilter(servletRequest, servletResponse);

        }
        catch (JwtException e)
        {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid token: " + e.getMessage());
        }
        catch (Exception e)
        {
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error processing JWT: " + e.getMessage());
        }
    }

    // helper method to send message whenever there is error like missing token, feign failure etc.
    private void sendError(HttpServletResponse response, int status, String message) throws IOException
    {
        response.setStatus(status);
        response.setContentType("application/json");                // help client to interpret the response correctly as json

        PrintWriter writer = response.getWriter();
        writer.write("{\"error\": \"" + message + "\"}");
        writer.flush();           // force response to be sent immediately to the client
    }
}


/*
getWriter() -- a method httpServletResponse class
            -- give "PrintWriter" object that send plain text (JSON) directly into http response body (to the client)

response.getWriter().write("{  \"error\" : \"Invalid token\"  }");    ----> in frontend it will be ----> {"error" : "Invalid token"}
     |-------- instead of blank paper or generic 500 error





 */