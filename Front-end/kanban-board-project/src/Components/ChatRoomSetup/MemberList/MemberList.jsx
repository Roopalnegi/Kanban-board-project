import { Box, Divider, Button,
         List, ListItemText, ListItemButton,
         Tooltip, Typography, Avatar, Badge,} from "@mui/material";
import { styled } from "@mui/material/styles";
import styles from './MemberList.module.css';

function MembersList({ membersList, senderEmail, onlineUserList, avatarColors, handleReceiver, navigate, role, setShowHeaderFooter}) 
{
  
    // Styled badge for online/offline indicator
    const StyledBadge = styled(Badge)(({ isonline }) => ({
       "& .MuiBadge-badge": 
        {
         backgroundColor: isonline === "true" ? "#06f82eff" : "#5a5454ff",
         color: isonline === "true" ? "#06f82eff" : "#5a5454ff",
         width: 10,
         height: 10,
         borderRadius: "50%",
       },
  }));

  return (
    <Box className={styles.leftColumn}>
      
      <Typography variant="h4" sx={{ textAlign: "center", p: 2 , mb:1}}>
        Members
      </Typography>

      <Divider sx={{ borderBottomWidth: 3, borderColor: "white" }} />

      <List>
        {
         membersList.filter((mem) => mem.email !== senderEmail)
                    .map((mem) => (
                                      <Tooltip key={mem.email} title={mem.email} placement="right"
                                               componentsProps={{ tooltip: {sx: {bgcolor: "whitesmoke",color: "black",fontSize: 14,}}}}>
                                        
                                        <ListItemButton onClick={() => handleReceiver(mem)} sx={{ color: "whitesmoke" }}>

                                            {/* Avatar + Badge */}
                                            <Box sx={{ position: "relative", display: "inline-flex", mr: 2 }}>

                                              <StyledBadge overlap="circular" variant="dot"
                                                           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                                           isonline={onlineUserList.includes(mem.email).toString()}
                                              >
                                                    <Avatar sx={{
                                                                 bgcolor: avatarColors[mem.email] || "lightgray",
                                                                 color: "white",
                                                                 border: "2px solid white",
                                                                 width: 36,
                                                                 height: 36,
                                                                 fontSize: "0.9rem",
                                                                 fontWeight: "bold",
                                                               }}
                                                    >
                                                        {mem.username?.slice(0, 2).toUpperCase()}
                                                     </Avatar>
                                              </StyledBadge>
                                            </Box>

                                            <ListItemText primary={mem.username} />
                                        </ListItemButton>

                                        <Divider sx={{ borderColor: "whitesmoke", borderBottomWidth: 2 }}/>
                                    </Tooltip>
                                ))}
      </List>

      <Box sx={{ textAlign: "center", p: 2 }}>
        
        <Button
          variant="contained"
          bgcolor="#d0d3efff"
          onClick={() => {
                          navigate(role === "employee" ? "/employee-dashboard" : "/admin-dashboard");
                          setShowHeaderFooter(true);
          }}
        >
          Back to Dashboard
        </Button>

      </Box>
      
    </Box>
  );
}

export default MembersList;
