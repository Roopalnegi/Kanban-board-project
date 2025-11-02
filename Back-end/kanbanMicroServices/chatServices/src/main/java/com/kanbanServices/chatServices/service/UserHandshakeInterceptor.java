package com.kanbanServices.chatServices.service;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

// DefaultHandshakeHandler -- help to create custom handshake handler
//                         -- this handler tells spring which "user" (principal) owns a web socket session
public class UserHandshakeInterceptor extends DefaultHandshakeHandler
{
    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String,Object> attributes)
    {
        String email = (String) attributes.get("email");        // set by JwtHandshakeInterceptor
        return () -> email;                        // return a principal object with the email as name
    }
}
