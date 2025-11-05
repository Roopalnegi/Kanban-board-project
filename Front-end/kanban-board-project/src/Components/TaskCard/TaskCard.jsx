import { Card, CardContent, CardActions,
         Box, Typography, Alert, 
         Tooltip, Avatar, AvatarGroup } from '@mui/material';
import {useEffect, useState} from 'react';
import { useSnackbar } from 'notistack';
import { calculateNoOfDays, deletePermanent, archiveTask, restoreTask} from '../../Services/TaskServices';
import { Icon, pencilImg, deleteImg, restoreImg } from '../IconComponent/Icon';
import styles from './TaskCard.module.css';


function TaskCard({task, onTaskEdit, onTaskArchive,onTaskRestore, onTaskDelete, archiveColumnId, readOnly = false, profileImage}) 
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
              case "high": return "#df2417ff"; // orange
              case "medium": return "#ffee00ff"; // yellow
              case "low": return "#9dff00ff"; // green
              default: return "#75757554"; // light grey
            }
    };

    
    
     // function to generate color based on user email hash -- create a unqiue and consistent color for each user email
    const getColorFromEmail = (email) => {
         
      let hash = 0;
      
      // convert email string into no.
      for (let i=0 ; i < email.length; i++)
      {
         // hash is big no. slice it by using << / >> operators  
         // email - char At (i) give no. like a - 97 , b - 98 | << bitwise shifts to changes the final no. slightly 
         // why change hash no ? --- so that same email ---> same hash no.       ||| different email --> different hash no.
         hash = email.charCodeAt(i) + ((hash<<5) - hash)          
      }

        // extract r g b values from that no.
        const r =  (hash >> 24) & 0xff; 
        const g =  (hash >> 16) & 0xff;
        const b =  hash & 0xff;

        return `rgb(${(Math.abs(r) + 225)/2}, ${(Math.abs(g) + 255)/2}, ${(Math.abs(b) + 255) / 2})`;
    };

    
    
       // block actions for employees
  const blockAction = (message) => {
    enqueueSnackbar(message || "You cannot perform this action !", {variant: "warning"});
  };



    // archive task
    const handleArchiveTask = async () => {
       if (readOnly) return  blockAction("Employees cannot archive tasks.");
       try 
       {
          const updatedTask = await archiveTask(task.taskId);
          // notify parent board state when task is archived
           if(onTaskArchive) onTaskArchive(updatedTask);
          enqueueSnackbar("Task archived !", {variant: "success"});
       } 
       catch (error) 
       {
         enqueueSnackbar(error.response?.data|| "Failed to archive task !", { variant: "error"});
       }
    };



    // restore task
    const handleRestoreTask = async () => {
       if (readOnly) return blockAction("Employees cannot restore tasks.");
       try 
       {
          const updatedTask = await restoreTask(task.taskId);
          // notify parent board state when task is restored 
          if(onTaskRestore) onTaskRestore(updatedTask);
          enqueueSnackbar("Task restored !", {variant: "success"});
       } 
       catch (error) 
       {
         enqueueSnackbar(error.response?.data|| "Failed to restore task !", { variant: "error"});
       }
    };



    // delete task permanent
    const handleDeleteTask = async () => {
        if (readOnly) return blockAction("Employees cannot restore tasks.");
       try 
       {
          await deletePermanent(task.taskId);
          // notify parent board state when task is deleted
          if(onTaskDelete) onTaskDelete(task.taskId);
          enqueueSnackbar("Task deleted permanently !", {variant: "success"});
       } 
       catch (error) 
       {
         enqueueSnackbar(error.response?.data|| "Failed to delete task permanently !", { variant: "error"});
       }
    };


    // edit task
    const handleEditTask = () => {
        if (readOnly) return blockAction("Employees cannot restore tasks.");
        if(onTaskEdit)
           onTaskEdit(task);
    };




  return (
         <Card className={styles.card} raised>
      
         {/* Alert message if task due date passed */}
         {
           daysLeft < 0 && <Alert severity = "warning"  variant = "filled" className={styles.alert}> 
                              <b>Due Date has already passed 😞! </b>
                            </Alert>
         }

         {/* Card Header */}
         <Typography className={styles.header} > {task.title} </Typography>
         
         {/* Card Content */}
         <CardContent className={styles.cardContent}>

            {/* Task description */}
            <Typography variant="body1">{task.task_description}</Typography>


            {/* Row 1: Priority & Assigned To */}
            <Box className={styles.rowFlex}>
              
              {/* Priority Badge */}
              <Box sx={{ bgcolor: getPriorityColor(task.priority), color: task.priority === "high" ? "white" : "black",
                         px: 1.5, py: 0.3, borderRadius: 2, fontWeight: 'bold', fontSize: 14 }}
              > {task.priority} </Box>
              
              {/* Assigned To avatars with AvatarGroup */}
              <AvatarGroup spacing="large">
                {
                 task.assignedTo?.map((email,index) => {
                                                         const initial = email ? email.charAt(0).toUpperCase() : "?" ;        // ? is fallback in email does not exist
                                                         return (<Tooltip key = {`${email}-${index}`} title = {email} arrow>
                                                                    {
                                                                      profileImage ? <Avatar src= {profileImage} alt = {email} sx={{width: 28 , height : 28}} />
                                                                                   :(
                                                                                       <Avatar sx={{ bgcolor: getColorFromEmail(email), width: 28, height: 28, fontSize: 14 }}>
                                                                                          {initial}
                                                                                       </Avatar>
                                                                                    )
                                                                    }
                                                                    
                                                                 </Tooltip>

                                                                );
                                                       })

                }
              </AvatarGroup>

            </Box>


            {/* Row 2: Start Date , Due Date & Days Left */}

            <Box className={styles.rowDates}>
              <Typography variant="body2" >
                 📅 <b>Start:</b> {task.createdAt}
              </Typography>

              <Typography variant="body2">
                ⏰ <b>Due:</b> {task.dueDate}
              </Typography>

              <Typography variant="body2" className={styles.dueText} sx={{color: daysLeft <= 2 ? "#E74C3C" : "#0d4379ff",fontWeight: 900}}>
                {daysLeft < 0 ? `( ${Math.abs(daysLeft)} day overdue )` : `( ${daysLeft} days left )`} 
              </Typography>
            </Box>
            

              

        </CardContent>     




        {/* Edit Button and delete button */}
        {/* if task in archive column -- show restore other wise edit & delete icon */}
        <CardActions className={styles.actions}>
            {
               !readOnly &&(
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
