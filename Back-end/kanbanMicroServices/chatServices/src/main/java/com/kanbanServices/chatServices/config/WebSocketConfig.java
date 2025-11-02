package com.kanbanServices.chatServices.config;


import com.kanbanServices.chatServices.service.JwtHandshakeInterceptor;
import com.kanbanServices.chatServices.service.UserHandshakeInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/*
 WebSocketConfig -- class enables and configures WebSocket message handling using STOMP (simple text oriented messaging protocol)
 */


@Configuration
@EnableWebSocketMessageBroker       // enables WebSocket server and allows using @MessageMapping in controllers
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer
{

    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;


    @Autowired
    public WebSocketConfig(JwtHandshakeInterceptor jwtHandshakeInterceptor)
    {
        this.jwtHandshakeInterceptor = jwtHandshakeInterceptor;
    }


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry)
    {
        registry.addEndpoint("/ws-chat")       // Defines WebSocket endpoint (client connects to /ws)
                .addInterceptors(jwtHandshakeInterceptor)
                .setHandshakeHandler(new UserHandshakeInterceptor())        // connect custom handshake handler to endpoint
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();                  // Enables SockJS fallback for browsers that don't support WebSocket
    }



    @Override
    public void configureMessageBroker(MessageBrokerRegistry config)
    {
        // for all clients /topic i.e. server to client
        config.enableSimpleBroker("/topic", "/queue");

        // for client to sever
        config.setApplicationDestinationPrefixes("/app");

        // for 1 to 1 messaging
        config.setUserDestinationPrefix("/user");

    }
}
