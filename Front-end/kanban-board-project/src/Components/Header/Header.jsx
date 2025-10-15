import {Box,useTheme} from '@mui/material';
import {useNavigate,Link} from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from './Header.module.css';

function Header({loginStatus, setLoginStatus, userData})
{
   
  const theme = useTheme();

  const navigate = useNavigate();

  const logout = () => {
    setLoginStatus(false);
    localStorage.removeItem("token");           // clear JWT token from localStorage
    console.log("token is removed");            // confirm message if token has removed successfully 
    navigate("/");
   };
    

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
                                         <span> {userData?.username} </span>
                                       </li>
                                       <li onClick = {logout}>Logout</li> 
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