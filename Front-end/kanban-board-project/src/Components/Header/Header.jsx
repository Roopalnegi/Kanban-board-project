import {Box, Badge} from '@mui/material';
import {useNavigate,Link} from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import styles from './Header.module.css';
import { Icon, userIcon} from '../IconComponent/Icon';


function Header({loginStatus, setLoginStatus, userData, setUserData, setNotifications, unreadNotificationCount, setUnreadNotificationCount})
{
   
  const navigate = useNavigate();


  const logout = () => {
    setLoginStatus(false);
    setUserData(null);
    setNotifications([]);          // clear previous notifications
    setUnreadNotificationCount(0);
    localStorage.removeItem("token");           // clear JWT token from localStorage
    console.log("token is removed");            // confirm message if token has removed successfully 
    navigate("/");
   };
  
   

   return(
           <Box component="header" className={styles['header-bar']}>    
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
                                         <Icon src = {userIcon} alt = "user-icon" className={styles['user-icon']}/> 
                                         <span><b> Hi {userData?.username} </b></span>
                                       </li>
                                       <li>
                                        <Badge color = "white" badgeContent = {unreadNotificationCount || 0}>
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