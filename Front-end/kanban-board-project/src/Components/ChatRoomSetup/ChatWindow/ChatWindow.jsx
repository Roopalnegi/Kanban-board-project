import styles from "./ChatWindow.module.css";

function ChatWindow({senderEmail, receiver, filteredMessages, getUserName})
{
   return (
    <>
    <Box className = {styles.messageContainer}>
            {
              filteredMessages.map(msg => (
                                            <Box
                                              key={msg.messageId || msg.timeStamp}
                                              className={`${styles.messageBubble} 
                                                          ${msg.sender === senderEmail ? styles.sentMessage : styles.receivedMessage}`}
                                              
                                            >
                                                
                                                <Typography variant="body2" sx={{textAlign: msg.sender === senderEmail ? "right" : "left"}}>
                                                    <strong>{getUserName(msg.sender)}</strong>
                                                </Typography>
                                                
                                                <Typography variant="body1" sx={{textAlign: msg.sender === senderEmail ? "left" : "right"}}>
                                                  {msg.content}
                                                </Typography>
                                                
                                                <Typography variant="subtitle2" sx={{textAlign: msg.sender === senderEmail ? "right" : "left", opacity: 0.7 }}>
                                                  {new Date(msg.timeStamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </Typography>

                                            </Box>
                                          ))
          }
          </Box>

          <Divider sx={{borderBottomWidth: 3, borderColor: "black", width: "100%", alignSelf: "stretch"}} />
          </>
   );
}

export default ChatWindow;