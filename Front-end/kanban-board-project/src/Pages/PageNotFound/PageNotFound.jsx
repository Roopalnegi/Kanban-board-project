import { Typography, Box } from "@mui/material";
import { Link } from 'react-router-dom';
import styles from './PageNotFound.module.css';

function PageNotFound()
{
     return (
       <Box className={styles.stackContainer}>

          {/* Left Side */}
          <Box component="img"
               src = "../Images/error-page.png" alt = "404 Error"
               sx={{width: { xs: "100%", sm: "500px", md: "600px" },
                      height: "auto"}} 
          />

          {/* Right side */}
          <Box className={styles.boxContainer}>
            <Typography variant = "h1"> 404 </Typography>
            <Typography variant = "h5" component="p">
                  We're sorry, the page you requested could not be found.
            </Typography>
             <Typography variant = "h5" component="p">
                  Please go back to <Link to="/">HomePage.</Link>
            </Typography>
          </Box>

       </Box>
     );
}

export default PageNotFound;