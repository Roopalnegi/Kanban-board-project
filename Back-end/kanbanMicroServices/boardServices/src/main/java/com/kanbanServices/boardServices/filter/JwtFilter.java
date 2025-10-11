package com.kanbanServices.boardServices.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.security.Key;

public class JwtFilter extends GenericFilterBean {

    private static final String SECRET_KEY = "kabanprojectsecretkey@123";

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        response.setContentType("application/json");

        // Step 1: Get Authorization header
        String authHeader = request.getHeader("Authorization");

        // Step 2: Check for Bearer token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header");
            return;
        }

        // Step 3: Extract JWT token
        String token = authHeader.substring(7);

        try {
            // Step 4: Validate token

            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();

            // Step 5: Extract user info from claims
            String username = claims.getSubject();
            String role = claims.get("role", String.class);

            // Step 6: Pass data to request
            request.setAttribute("username", username);
            request.setAttribute("role", role);

            // Step 7: Continue with filter chain
            filterChain.doFilter(servletRequest, servletResponse);

        } catch (ExpiredJwtException e) {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Token has expired");
        } catch (JwtException e) {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid token: " + e.getMessage());
        } catch (Exception e) {
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error processing JWT: " + e.getMessage());
        }
    }

    private void sendError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        try (PrintWriter writer = response.getWriter()) {
            writer.write("{\"error\": \"" + message + "\"}");
            writer.flush();
        }
    }
}
