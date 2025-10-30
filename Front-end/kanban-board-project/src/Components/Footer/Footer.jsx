
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() 
{



  return (
         <Box component="footer" className={styles['footer-bar']}>
      
      {/* Left side */}
      
      <Box component="p" sx={{ m: 0, fontSize: "1rem"}}>
        <b><i>2025 Kanban Board &copy; Copyright</i></b>
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



