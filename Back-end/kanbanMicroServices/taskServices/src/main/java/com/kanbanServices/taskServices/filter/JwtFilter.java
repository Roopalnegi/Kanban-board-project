package com.kanbanServices.taskServices.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.List;

public class JwtFilter extends GenericFilterBean
{
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
        }
        else
        {
            // decode the jwtToken
            String jwtToken = authHeader.substring(7);
            Claims claims = Jwts.parser()
                                 .setSigningKey("kabanprojectsecretkey@123")
                                 .parseClaimsJws(jwtToken)
                                 .getBody();
            String username = claims.getSubject();
            String role = claims.get("role", String.class);

            // pass the username and role forward in the request
            httpServletRequest.setAttribute("username", username);
            httpServletRequest.setAttribute("role", role);

            // pass the claims in the request
            filterChain.doFilter(servletRequest,servletResponse);
        }

    }

}
