import { Card, CardContent, CardActions,
         Box, Typography, Alert, 
         Tooltip, Avatar, AvatarGroup } from '@mui/material';
import {useEffect, useState} from 'react';
import { useSnackbar } from 'notistack';
import { calculateNoOfDays, deletePermanent, archiveTask, restoreTask} from '../../Services/TaskServices';
import { Icon, pencilImg, deleteImg, restoreImg } from "../../Components/IconComponent/Icon";


function TaskCard({task, role, onTaskEdit, onTaskArchive, onTaskRestore, onTaskDelete, archiveColumnId}) 
{

   const {enqueueSnackbar} = useSnackbar();

   const [daysLeft, setDaysLeft] = useState(null);
   // track if task in column archive
   const isArchived = task.columnId ===  archiveColumnId ;
   


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




    // archive task
    const handleArchiveTask = async () => {
       try 
       {
          const updatedTask = await archiveTask(task.taskId);
          // notify parent board state when task is archived
           if(onTaskArchive) onTaskArchive(updatedTask);
          enqueueSnackbar("Task archived !", {variant: "success", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
       } 
       catch (error) 
       {
         enqueueSnackbar(error.response?.data|| "Failed to archive task !", { variant: "error", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
       }
    };



    // restore task
    const handleRestoreTask = async () => {
       try 
       {
          const updatedTask = await restoreTask(task.taskId);
          // notify parent board state when task is restored 
          if(onTaskRestore) onTaskRestore(updatedTask);
          enqueueSnackbar("Task restored !", {variant: "success", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
       } 
       catch (error) 
       {
         enqueueSnackbar(error.response?.data|| "Failed to restore task !", { variant: "error", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
       }
    };



    // delete task permanent
    const handleDeleteTask = async () => {
       try 
       {
          await deletePermanent(task.taskId);
          // notify parent board state when task is deleted
          if(onTaskDelete) onTaskDelete(task.taskId);
          enqueueSnackbar("Task deleted permanently !", {variant: "success", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
       } 
       catch (error) 
       {
         enqueueSnackbar(error.response?.data|| "Failed to delete task permanently !", { variant: "error", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
       }
    };


    // edit task
    const handleEditTask = () => {
        if(onTaskEdit)
           onTaskEdit(task);
    };




  return (
         <Card sx={{ width: 250, borderRadius: 2, boxShadow: 3,      
                     display: 'flex', flexDirection: 'column',p :2, mb:2,
                  }} raised
         >
      
         {/* Alert message if task due date passed */}
         {
           daysLeft <= 0 && <Alert severity = "warning" variant = "filled" sx = {{mb:2}}> <b>Due Date has already passed 😞! </b></Alert>
         }

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
                 task.assignedTo?.map((email,index) => {
                                                         const initial = email ? email.charAt(0).toUpperCase() : "?" ;        // ? is fallback in email does not exist
                                                         return (<Tooltip key = {`${email}-${index}`} title = {email} arrow>
                                                                    <Avatar sx={{ bgcolor: getRandomRGB(), width: 28, height: 28, fontSize: 14 }}>
                                                                       {initial}
                                                                    </Avatar>
                                                                 </Tooltip>

                                                                );
                                                       })

                }
              </AvatarGroup>

            </Box>


            {/* Row 2: Start Date , Due Date & Days Left */}

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, mt: 1,}}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                 📅 <b>Start:</b> {task.createdAt}
              </Typography>

              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                ⏰ <b>Due:</b> {task.dueDate}
              </Typography>

              <Typography variant="body2"sx={{color: daysLeft <= 2 ? "#E74C3C" : "#0d4379ff",fontWeight: 900}}>
                {daysLeft <= 1 ? `( ${daysLeft} day left )` : `( ${daysLeft} days left )`} 
              </Typography>
            </Box>

              

        </CardContent>     




        {/* Edit Button and delete button */}
        {/* if task in archive column -- show restore other wise edit & delete icon */}
        <CardActions sx = {{justifyContent: "flex-end", gap: 2}}>
            {
               role === "admin" &&(
               !isArchived ? (
                                <>
                                    <Tooltip title = "Edit" arrow>
                                        <Icon src = {pencilImg} alt = "Edit Icon" onClick = {handleEditTask} sx = {{cursor: "pointer"}}/>
                                    </Tooltip>
                                    <Tooltip title = "Archive" arrow>
                                        <Icon src = {deleteImg} alt = "Archive Icon" onClick = {handleArchiveTask} sx = {{cursor: "pointer"}}/>
                                    </Tooltip>   
                                </>
                               )
                               :(<>
                                    <Tooltip title = "Restore" arrow>
                                        <Icon src = {restoreImg} alt = "Restore Icon" onClick = {handleRestoreTask} sx = {{cursor: "pointer"}}/>
                                    </Tooltip>
                                    <Tooltip title = "Delete Permantently" arrow>
                                        <Icon src = {deleteImg} alt = "Delete Permantently Icon" onClick = {handleDeleteTask} sx = {{cursor: "pointer"}}/>
                                    </Tooltip>    
                                </>   
                               ) )
            }            
        </CardActions>
    
      </Card>
        );
}

export default TaskCard;

/*

Now the flow is:


1. User clicks Edit icon on a TaskCard  ----> TaskCard calls onTaskEdit(task) [parent handler]

2. ColumnCard recieves task ------> sets editingTask + open form

3. AddTaskForm receives task prop -------------->  edit mode triggered

4. on submit  ----------------> calls updateTask ----------> then onTaskUpdated(updatedTask) --------> Board updated instantly 

i.e. TaskCard ---> ColumnCard ---> AddTaskForm ---> TaskServices
*/
