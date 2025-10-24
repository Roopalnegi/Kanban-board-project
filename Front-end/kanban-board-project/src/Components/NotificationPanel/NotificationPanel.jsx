import {useState} from 'react';
import { Dialog, DialogTitle, DialogContent, useTheme } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';

function NotificationPanel({userData})
{

   const theme = useTheme();
   const navigate = useNavigate();
   const [open, setOpen] = useState(true);
   
   
   return (
    
    <Dialog open = {open} PaperProps={{ sx: {
                                             minWidth: 400,  
                                             minHeight: 450, 
                                             padding: 3,     
                                             borderRadius: 2 
                                            }
    }}>

        <DialogTitle sx={{display:'flex',justifyContent:'space-between',alignItems:"center", borderBottom: "2px solid lightgray"}}>
                    <b>Notifications</b>
                      {/* closeIcon */}
                  <CancelIcon sx={{cursor:'pointer',color:theme.palette.error.main}}
                              onClick={() => { if(userData.role === "admin")
                                                  navigate("/admin-dashboard");
                                               else if(userData.role === "employee") 
                                                  navigate("/employee-dashboard");
                                               setOpen(false);   
                                            }}    
                  />        
        </DialogTitle>

        <DialogContent>
           {/* Filter options */}
           <TextField type = "date"
                      value = {date}
                      

        </DialogContent>

    </Dialog>
          );
}

export default NotificationPanel;