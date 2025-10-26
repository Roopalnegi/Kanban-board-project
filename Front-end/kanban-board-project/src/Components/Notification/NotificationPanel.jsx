import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import NotificationFilter from "./NotificationFilter";
import NotificationCard from "./NotificationCard.jsx";
import { markNotificationAsRead, filterNotificationByDate, filterNotificationByMonthAndYear, unreadNotification} from "../../Services/NotificationService.js";


function NotificationPanel({ userData , notifications, setNotifications,setUnreadNotificationCount}) 
{

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  

  // Handle filter
  const handleFilter = async (filter) => {
    try 
    {
        let list = [];
        if (filter.type === "unread") 
        {
          list = await unreadNotification(userData.email);
        } 
        else if (filter.type === "date") 
        {
          list = await filterNotificationByDate(userData.email, filter.date);
        } 
        else if (filter.type === "month-year") 
        {
          list = await filterNotificationByMonthAndYear(userData.email, filter.month, filter.year);
        }

        setNotifications(list);
        // update unread count
         setUnreadNotificationCount(list.filter(n => n.read === false).length);
    }    
    catch (error) 
    {
      console.error("Error in filtering notifications:", error);
    }
  };



  // Mark as read
  const markClick = async (notificationId) => {
    try 
    {
        await markNotificationAsRead(notificationId);
        const updated = notifications.map(n => n.notificationId === notificationId ? { ...n, read: true } : n);
        setNotifications(updated);
        const unread = updated.filter(n => n.read === false).length;
        setUnreadNotificationCount(unread);
       
    } 
    catch (error) 
    {
      console.error("Error marking notification as read:", error);
    }
  };

  
  return (
    <Dialog open={open}
            PaperProps={{ sx: { minWidth: 800, minHeight: 500, padding: 3, borderRadius: 2 } }}
    >
      
      
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid lightgray", }} >
       
        <b>Notifications</b>
       
        <CancelIcon sx={{ cursor: "pointer", color: "red" }}
                    onClick={() => { setOpen(false);
                                     navigate(userData.role === "admin" ? "/admin-dashboard" : "/employee-dashboard");}}
        />
      </DialogTitle>


      <DialogContent>

        {/* Filter Options */}

        <NotificationFilter onFilter={handleFilter} />

        {/* Notifications list */}
        
        {
          notifications.length === 0 ? (
                                        <div style={{ textAlign: "center", marginTop: "40px" }}>
                                               <img  src="./Images/notification-image.png"  alt="Empty Notification Box !!"  
                                                     height="250px"  width="250px"  style={{ borderRadius: "10px" }} />
                                         </div>
                                      ) 
                                      : (
                                          <Box display="flex" flexDirection="column" gap={1}>
                                            {
                                              notifications.map((notification) =>  <NotificationCard key={notification.notificationId} 
                                                                                                     notification={notification} 
                                                                                                     markClick={markClick}
                                                                                   />)
                                            }
                                          </Box>
                                        )
        }

        
      </DialogContent>
      
    </Dialog>
  );
}

export default NotificationPanel;
