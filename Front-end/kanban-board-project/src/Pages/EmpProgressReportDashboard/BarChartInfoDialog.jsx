import { Typography, Dialog, DialogContent, DialogTitle, useTheme} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Icon, starBullet } from '../../Components/IconComponent/Icon';
import styles from './BarChartInfoDialog.module.css';


function BarChartInfoDialog({open,onClose})
{
   
   const theme = useTheme();
    
    return(
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">


      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" component="span" sx = {{color: theme.colors.bodyText}}>
              <b> Efficiency Index </b>
            </Typography>
         <CancelIcon sx={{ cursor: "pointer", color: "red" }} 
                     onClick={onClose}/>
      </DialogTitle>

      
      <DialogContent sx = {{display: "flex", flexDirection: "column",gap: "20px", mt:1}}> 


        {/* formula */}
        <p style={{ fontSize: "18px", fontWeight: "500", textAlign: "center" }}>
          <b>Performance = </b>
          <span style={{ display: "inline-block", verticalAlign: "middle", margin: "0 6px" }}>
            <span style={{ borderBottom: "2px solid #000", display: "block", textAlign: "center", padding: "0 4px" }}>
              Completed&nbsp;Tasks
            </span>
            <span style={{ display: "block", textAlign: "center", padding: "0 4px" }}>
              Total Assigned Tasks
            </span>
          </span>
          ×&nbsp;100%
        </p>


     {/* bullet points */}
     <ul className={styles.listStyle}>
        <li>
            <Icon src={starBullet} /> 
            This formula tells how an employee is finishing currently assigned tasks efficienlty.
        </li>
        <br/>
        <li> 
            <Icon src={starBullet} /> 
            It ignores upcoming assigned tasks, making the % more accurate for day to day performance tracking.
        </li>
        <br/>
        <li className={styles.hintStyle}> 
            <Icon src={starBullet} /> 
            Hint :- No bar indicates no tasks assigned or 0 % completion.
        </li>
        
     </ul>
      
            

      </DialogContent>

    
     </Dialog>);
}
export default BarChartInfoDialog;