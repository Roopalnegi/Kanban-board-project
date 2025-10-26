import { Card, Box, Typography, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CircleIcon from "@mui/icons-material/Circle";

function NotificationCard({ notification, markClick }) 
{

  return (

    <Card sx={{ minHeight: 60, display: "flex", alignItems: "center", padding: 1, gap: 2, 
                backgroundColor: notification.isRead ? "#f9f9f9" : "#e0f0ff",}}>

      <Box flexGrow={1}>
        <Typography variant="h6" sx = {{pb:1}}>{notification.taskName}</Typography>
        <Typography variant="body1" sx = {{display: "flex", justifyContent: "space-between"}}> 
          {notification.message} <b>{`By:${notification.sentBy}`}</b>
          </Typography>
      </Box>

      <IconButton size="small"
                  onClick={() => markClick(notification.notificationId)}
                  sx={{"&:hover": { backgroundColor: "transparent"}}}>
        {
          notification.read ? ( <CheckIcon sx={{ color: "blue" }} /> )
                              : ( <CircleIcon sx={{ color: "gray" }} /> )
        }
      </IconButton>
      
    </Card>
  );
}

export default NotificationCard;
