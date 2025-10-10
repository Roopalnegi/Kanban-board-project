
import React from "react";
import TypoGraphy from '@mui/'

import { Box, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() 
{

  const theme = useTheme();

  return (
         <Box component="footer"
              sx= {{ backgroundColor: theme.colors.footer,color: theme.colors.headerFooterSidebarText}}
              className={styles['footer-bar']}
         >
      
      {/* Left side */}
      
      <Box component="p" sx={{ m: 0, fontSize: "1rem"}}>
        <b><i>2025 Kanban Board &copy;Copyright</i></b>
      </Box>

      {/* Right side: links */}

      <Box component="ul" className={styles['footer-links']}>
        <li><Link to="/infopage">About Us</Link></li>
        <li><Link to="/infopage">Contact Us</Link></li>
      </Box>
    </Box>
  );
}

export default Footer;

// useTheme is a hook method -- used to access theme defined in theme.jsx file

