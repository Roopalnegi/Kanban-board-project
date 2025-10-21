import { Box, Button, Typography, useTheme } from "@mui/material";
import {useNavigate} from 'react-router-dom';
import styles from './HomePage.module.css';

function HomePage() 
{
  const theme = useTheme();
  const navigate = useNavigate();

  return (
         
         <Box className = {styles.stackContainer}>

            {/* Left side */}
            <Box component = "img"
                 src = "./landing-page-image.png" alt = "home-page" 
                 sx={{width: { xs: "100%", sm: "300px", md: "500px" },
                      height: "auto"}}
            />

            {/*Right side */}
            <Box className = {styles.boxContainer}>

              <Typography variant="h3" sx = {{fontWeight: 800, mb: 2,textAlign: {sm:"center",md: "right"} }}>
                 Organize Chaos, Visualize Progress
              </Typography>

              <Typography component="p" sx={{ mt: 3,px:4,color: theme.colors.bodyText, textAlign: "center" }}>
                  Tool used to manage tasks and workflow,making work processes transparent and manageable, helping individuals and 
                  teams organized work efficiently by limiting the number of tasks, maximize productivity.
              </Typography>
              
              <Button variant = "contained"  sx={{bgcolor: theme.colors.buttons, px: 4, py:1, mt:2}}
                     onClick = {()=> navigate("/register")}>
                Get Started
              </Button>
             </Box>

         </Box>

    
        );
}

export default HomePage;
