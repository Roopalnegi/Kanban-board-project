import {useState, useEffect} from 'react';
import {Box,useTheme, Badge} from '@mui/material';
import {useNavigate,Link} from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import styles from './Header.module.css';
import { countUnreadNotification } from '../../Services/NotificationService';


function Header({loginStatus, setLoginStatus, userData})
{
   
  const theme = useTheme();

  const navigate = useNavigate();

  const[countNotification, setCountNotification] = useState(0);

  const logout = () => {
    setLoginStatus(false);
    localStorage.removeItem("token");           // clear JWT token from localStorage
    console.log("token is removed");            // confirm message if token has removed successfully 
    navigate("/");
   };
  
   
  // getting unread notifications count
  useEffect(() => {
  
     const countUnreadNotify = async () => {
       try
       {
         const count = await countUnreadNotification(userData.username);
         setCountNotification(count);
       }
       catch(error)
       {
        console.error("Error in counting unread notification : ", error);
       }
    };

    if(userData?.username)
    {
      countUnreadNotify();
    }


  },[userData]);
  



   return(
           <Box component="header" 
                sx={{backgroundColor: theme.colors.header, color: theme.colors.headerFooterSidebarText}}
                className={styles['header-bar']}
            >    
                {/* Left Side - App Name */}
                
                <Box component="h3" sx={{ m: 0, p: 0, fontSize: "1.5rem"}}>
                  <b>Kanban Board</b>
                </Box>


                {/* Right side: links */}

                <Box component="nav" className={styles['header-links']}>
                  <ul>  
                    {
                      loginStatus ? (<>
                                       <li className={styles['user-info']}>
                                         <AccountCircleIcon className={styles['user-icon']}/> 
                                         <span> Hi {userData?.username} </span>
                                       </li>
                                       <li>
                                        <Badge color = "inherit" badgeContent = {countNotification || 0}>
                                           <NotificationsIcon onClick = {() => navigate("/notificationpanel")}/>
                                        </Badge>
                                       </li>
                                       <li onClick = {logout} className={styles['user-logout']}>Logout</li> 
                                    </>)
                                  : (<>
                                     <li><Link to = "/login">Login</Link></li> 
                                     <li><Link to = "/register">Register</Link></li>
                                     </>)
                                     
                    }
                  </ul>
                 
                </Box>
     
             </Box>
          );
}

export default Header;