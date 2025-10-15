package com.kanbanServices.taskServices.filter;

import com.kanbanServices.taskServices.proxy.UserAuthClient;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
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
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;
        ServletOutputStream pw = httpServletResponse.getOutputStream();

        // fetch Authorization in "header" from request
        String authHeader = httpServletRequest.getHeader("Authorization");

        // check if header contains bearer token or not
        if(authHeader == null || !authHeader.startsWith("Bearer"))
        {
            httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            pw.println("Missing or Invalid Token");
            pw.close();
            return;
        }

        try
        {
            // call user authentication service via feign client
            Map<String,String> userData = userAuthClient.validateToken(authHeader);

            // pass email and role forward in the request
            httpServletRequest.setAttribute("email", userData.get("email"));
            httpServletRequest.setAttribute("role", userData.get("role"));

            // pass the claims in the request
            filterChain.doFilter(servletRequest,servletResponse);
        }
        catch(Exception e)
        {
            httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }

    }

}
