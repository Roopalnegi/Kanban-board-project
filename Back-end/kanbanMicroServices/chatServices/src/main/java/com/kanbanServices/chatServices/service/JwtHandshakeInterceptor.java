package com.kanbanServices.chatServices.service;

import com.kanbanServices.chatServices.proxy.AuthFeignClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.util.Map;

// This class is used when a frontend client first tries
// to open a WebSocket connection to your backend (at /ws-chat endpoint).

@Service
public class JwtHandshakeInterceptor implements HandshakeInterceptor
{
    private final AuthFeignClient authFeignClient;

    @Autowired
    public JwtHandshakeInterceptor(AuthFeignClient authFeignClient)
    {
        this.authFeignClient = authFeignClient;
    }


    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler webSocketHandler, Map<String, Object> attributes)
    {

           try
           {
               // get authorization header
               URI uri = request.getURI();

               String query = uri.getQuery();     // get token form uri


               // check if bearer token exist -- not null and start with "Bearer "
               if(query != null && query.startsWith("token="))
               {
                   String token = "Bearer " + query.substring(6);
                   Map<String, String> userData = authFeignClient.validateToken(token);

                   // attach user info to connect with websocket
                   attributes.put("email", userData.get("email"));

                   System.out.println("Connected to user : " + userData.get("email"));

                   return true;
               }
               else
               {
                   System.out.println("Missing or Invalid Token");
                   return false;
               }
           }
           catch (Exception e)
           {
               e.printStackTrace();
               System.out.println("Token invalid : " + e.getMessage());
               return false;
           }
    }


    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler webSocketHandler, Exception exception)
    {}
}
