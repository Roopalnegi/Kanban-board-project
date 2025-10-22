import { Card, CardContent,
         Box, Typography, 
         Tooltip, Avatar, AvatarGroup } from '@mui/material';
import {useEffect, useState} from 'react';
import { calculateNoOfDays } from '../../Services/TaskServices';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function TaskCard({task}) 
{

   const [daysLeft, setDaysLeft] = useState(null);

   
   // function to calculate days left to complete task
   useEffect(() => {
    
    const fetchDaysLeft = async () => {

      try
      {
        const days = await calculateNoOfDays(task.dueDate);
        setDaysLeft(days);
      }
      catch(error)
      {
        console.log("Error in calculating no. of days to complete the task :", error);
        setDaysLeft("N/A");
      }
    };

    fetchDaysLeft();

   },[task.dueDate]);




    // function to get badge color based on priority
    const getPriorityColor = (priority) => {
            if (!priority) return "#75757554"; // fallback color for undefined/null
            switch ((priority).toLowerCase()) 
            {
              case "high": return "#f5584dff"; // orange
              case "medium": return "#ffda36"; // yellow
              case "low": return "#9ada36"; // green
              default: return "#75757554"; // light grey
            }
    };

    

    // function to get random rgb code 
    const getRandomRGB = () => {
         const r = Math.floor(Math.random() * 256); // Red: 0-255
         const g = Math.floor(Math.random() * 256); // Green: 0-255
         const b = Math.floor(Math.random() * 256); // Blue: 0-255
         return `rgb(${r}, ${g}, ${b})`;
    };



  return (
         <Card sx={{ width: 250, borderRadius: 2, boxShadow: 3,      
                     display: 'flex', flexDirection: 'column',p :2, mb:2
                  }} raised
         >
      
         {/* Card Header */}
         <Typography sx={{ fontWeight: 'bolder', fontSize: 18}} > 
          {task.title} 
         </Typography>
         
         {/* Card Content */}
         <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>


            {/* Task description */}
            <Typography variant="body1">
              {task.task_description}
            </Typography>


            {/* Row 1: Priority & Assigned To */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              {/* Priority Badge */}
              <Box sx={{ bgcolor: getPriorityColor(task.priority), color: "black",
                         px: 1.5, py: 0.3, borderRadius: 2, fontWeight: 'bold', fontSize: 14 }}
              > {task.priority} </Box>
              
              {/* Assigned To avatars with AvatarGroup */}
              <AvatarGroup spacing="large">
                {
                 task.assignedTo?.map(email => (
                                                 <Tooltip key={email} title={email} arrow>
                                                   <Avatar sx={{ bgcolor: getRandomRGB(), width: 28, height: 28, fontSize: 14 }}>
                                                     {email.charAt(0).toUpperCase()}
                                                   </Avatar>
                                                 </Tooltip>
                ))
                }
              </AvatarGroup>

            </Box>


            {/* Row 2: Due Date & Days Left */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              
            {/* Due Date  */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
  
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarMonthIcon fontSize="small" />
                <Typography variant="body2" color="black"> <b> Due Date </b> </Typography>
                </Box>
  
                <Typography variant="body2" color="black" sx={{ ml: 3 }}>
                  {task.dueDate}
                </Typography>

            </Box>
              
              
            {/* Days Left */}
              <Typography variant="body2" color="black">
                {daysLeft} days left
              </Typography>
            </Box>


        </CardContent>     
    
        </Card>
        );
}

export default TaskCard;
