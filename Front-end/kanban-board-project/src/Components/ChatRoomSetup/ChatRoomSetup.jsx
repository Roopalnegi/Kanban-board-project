import { useState, useEffect, useRef} from 'react';
import { Grid} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axiosInstance from '../../Services/axiosConfig';

import MessageInputArea from './MessageInputArea/MessageInputArea';
import ChatWindow from './ChatWindow/ChatWindow';
import MembersList from './MemberList/MemberList';

function ChatRoomSetup({setShowHeaderFooter})
{
   
    const navigate = useNavigate();

    const [membersList, setMembersList] = useState([]);          // all registered users
    const [onlineUserList, setOnlineUserList] = useState([]);           // track if web socket is connected or disconnected
    const [messages, setMessages] = useState([]);                // store new and old messages 
    const [messageInput, setMessageInput] = useState("");        // text types by current user
    const [receiver, setReceiver] = useState(null);              // store email of user currently chatting with
    const stompClientRef = useRef(null);                         // hold active stomp client 

    // extract token and current user email
    const token = localStorage.getItem("token");
    const senderEmail = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    // to store generated colors for each email
    const [avatarColors, setAvatarColors] = useState({});


    // fetch memeber list
    useEffect(() => {
        const fetchRegisteredUsers = async () => {
            try
            {
                 const response = await axiosInstance.get("http://localhost:8081/api/v1/user/fetchAllRegisteredUsers");
                 setMembersList(response.data);
            }
            catch(error)
            {
                console.error("Failed to fetch all registered users data : ", error);
            }

        };
        fetchRegisteredUsers();
    },[]);



    // connect to  web socket 
    useEffect(() => {
        if(!token || stompClientRef.current)  return;         // check if token exist and to prevent duplicate connection

        // if token exist, then create stomp object
        const client = new Client ({
            webSocketFactory: () => new SockJS(`http://localhost:8086/ws-chat?token=${token}`),     //define web socket connection
            reconnectDelay: 5000,                                                                  // auto reconnect every 5 sec if connection drops
        });


        // connecting and subscribing 
        client.onConnect = (frame) => {
             console.log("Connected as : ", senderEmail);
            // subscribe to private chat
            client.subscribe('/user/queue/messages', (message) => {

                  const body = JSON.parse(message.body);
                  console.log("Private Message recieved : ", body);

                  // Skip if already exists 
                 setMessages(prev => {
                   const alreadyExists = prev.some(m => m.messageId === body.messageId);
                   if(alreadyExists) return prev;
                   return [...prev, body];   // always store new message, regardless of current open chat
                 });
            }); 
            
            // subscribe to online users
            client.subscribe('/topic/onlineUsers', (message) => {
               const users = JSON.parse(message.body);
               console.log("Online users list recived", users);
               setOnlineUserList(users);
            });

        };


        // handling errors
        client.onStompError = (frame) => {
            console.error("STOMP error : ", frame.headers['message']);
            console.error("Deatils : ", frame.body);
        };


        // start connection
        client.activate();
        stompClientRef.current = client;

        // clean up code
        return () => {
            if(stompClientRef.current)
            {
              stompClientRef.current.deactivate();
              stompClientRef.current = null;
            } 
        };


    },[token,senderEmail]);



    // fetching old messages
    useEffect( () => {
       if(!receiver) return;

       const fetchOldMessage = async () => {    
            try
            {
                 const response = await axiosInstance.get(`http://localhost:8086/chat/fetchMessages/${senderEmail}/${receiver}`);
                 const lastTen = response.data.slice(-20);                                                                        // show last 20 messages only  
                 setMessages(lastTen);
            }
            catch(error)
            {
                console.error("Error in fetching old messages b/w two users : ", error);
            }
        };

        fetchOldMessage();

    },[senderEmail,receiver])



    // sending message
    const sendMessage = async () => {
        if(!messageInput.trim() || !receiver || receiver === senderEmail) return;


        const messageObj = {sender : senderEmail,
                            receiver : receiver,
                            timeStamp :  new Date().toISOString(),
                            content : messageInput,
                            type: "CHAT"
                           };
        try
        {
          
          setMessageInput('');
          
          stompClientRef.current.publish({
                  destination: '/app/sendPrivateMessage',
                  body: JSON.stringify(messageObj),
          });
          
        }
        catch(error)
        {
            console.error("Error in saving message in backend : ", error);
        }
        };



    // store selected receiver
    const handleReceiver = (member) =>{
        setReceiver(member.email);       
    };


    // filtering messages based on user
    const filteredMessages = messages.filter(msg => (msg.sender === senderEmail && msg.receiver === receiver) 
                                                      || (msg.sender === receiver && msg.receiver === senderEmail)
                                            );

    // get username from memberlist using email for showing person name on msg box
    const getUserName = (email) => {
       const user = membersList.find(mem => mem.email === email);
       return user ? user.username : email;
    };                                       


    // function to generate color based for avtar
   const getRandomColor = () => {
         const r = Math.floor(Math.random() * 256); // Red: 0-255
         const g = Math.floor(Math.random() * 256); // Green: 0-255
         const b = Math.floor(Math.random() * 256); // Blue: 0-255
         return `rgb(${r}, ${g}, ${b})`;
    }; 



    // whenever new members are fetched, generate color only for new ones
    useEffect(() => {
      if (membersList.length > 0) 
      {
        setAvatarColors(prevColors => 
        {
          const updated = { ...prevColors };
          membersList.forEach(mem => {
                                       if (!updated[mem.email]) 
                                           updated[mem.email] = getRandomColor();
            
                                     });
          return updated;
        });
      }
      
    }, [membersList]);
    


    return (

      <Grid container sx={{ height: "100vh", bgcolor: "#f4f6f8" }}>

          {/* LEFT COLUMN — Members List */}
          <Grid item xs={3} sm={3} md={3} 
                sx={{ bgcolor: "#262837ff", color: "white", boxShadow: 3 }}>

            <MembersList membersList={membersList} senderEmail={senderEmail}
                        onlineUserList={onlineUserList}  avatarColors={avatarColors}
                        handleReceiver={handleReceiver}  navigate={navigate}
                        role={role} setShowHeaderFooter={setShowHeaderFooter} />
    
          </Grid>
        
        {/* RIGHT COLUMN — Chat Window */}

        <Grid item xs={3} sm={9} md={9} 
              sx={{ display: "flex", flexDirection: "column", height: "100vh",bgcolor: "#ffffff63", flexGrow: 1 }}>
          
          {/* Messages section */}
          <ChatWindow senderEmail={senderEmail} receiver={receiver} 
                     filteredMessages={filteredMessages} getUserName={getUserName} />
        
          {/* Input section */}
          <MessageInputArea messageInput={messageInput} setMessageInput={setMessageInput} 
                            sendMessage={sendMessage} />
          
        </Grid>

    </Grid>
    );

}

export default ChatRoomSetup;


/*
Why We Need stompClientRef

-- React re-renders the component every time state changes.
-- If you store the WebSocket client (stompClient) in a state variable, it would:
-- Trigger extra re-renders every time you set or update the client.
-- Sometimes create new WebSocket connections on re-render.
-- Lose the reference during cleanup if re-render happens too early.
-- Instead, using useRef() keeps one stable, mutable object through the entire lifecycle of the component.
*/