package com.kanbanServices.chatServices.service;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

// purpose -- track which user is online or offline

@Service
public class OnlineUserTracker
{
    private final Set<String> onlineUsers = new HashSet<>();

    // add user if connected to web socket -- means user is online
    public void addUserToOnline(String email)
    {
        onlineUsers.add(email);
    }

    // remove user if disconnected to web socket -- means user is offline
    public void removerUserFromOnline (String email)
    {
        onlineUsers.remove(email);
    }

    // get all online users available
    public Set<String> getOnlineUsers()
    {
        return onlineUsers;
    }
}
