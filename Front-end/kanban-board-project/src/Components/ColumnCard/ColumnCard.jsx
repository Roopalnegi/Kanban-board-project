import { Card,CardContent,Box,Typography, Stack} from "@mui/material";
import {useState, useEffect} from 'react';
import { useSnackbar } from "notistack";
import TaskCard from "../TaskCard/TaskCard";
import AddTaskForm from "../../Forms/AddTask/AddTask";
import SpeedDialLayout from '../SpeedDialLayout/SpeedDialLayout';
import InlineEditableField from "../InlineEditableField/InlineEditableField";
import styles from '../SpeedDialLayout/SpeedDialLayout.module.css';
import { addTaskImg, deleteImg, pencilImg } from "../IconComponent/Icon";
import { updateColumnName, deleteColumn, getArchiveColumnId} from "../../Services/ColumnServices";


function ColumnCard({boardId, column, tasks, onColumnNameChange, onColumnDelete, onTaskAdded, onTaskUpdate, onTaskArchive, onTaskRestore, onTaskDelete})
{

   const{enqueueSnackbar} = useSnackbar();

   const [editing, setEditing] = useState(false);                  // track column name edit mode
   const [editingTask, setEditingTask] = useState(null);           // store the task that needs to be edited
   const [showTaskForm, setShowTaskForm] = useState(false);        // control addTaskForm dialog visibility
   const [archiveId, setArchiveId] = useState(null);


   // function to get archive column id
   useEffect(() => {
       const archiveId = async () => {
         const id = await getArchiveColumnId(boardId);
         setArchiveId(id);
       };
       archiveId();
   },[boardId]);


   // function to get column color based on priority
    const getColumnColor = (columnName) => {
            if (!columnName) return "#75757554"; // fallback color for undefined/null
            switch ((columnName).toLowerCase()) 
            {
              case "to do": return "#64B5F6"; 
              case "in progress": return "#FFD54F"; 
              case "done": return "#81C784"; 
              case "archive": return "#BDBDBD";
              default: return getRandomRGBA();
            }
    };

    

    // function to get random rgba code 
    const getRandomRGBA = (alpha = 0.3 ) => {
         const r = Math.floor(Math.random() * 256); // Red: 0-255
         const g = Math.floor(Math.random() * 256); // Green: 0-255
         const b = Math.floor(Math.random() * 256); // Blue: 0-255
         return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }; 



    // save column name
    const handleSaveColumnName = async (newName) => {
         try
         {
           const updatedColumn = { columnId: column.columnId, 
                                   columnName: newName, 
                                   columnOrder: column.columnOrder};

           await updateColumnName(boardId, column.columnId, updatedColumn);
           enqueueSnackbar("Column name updated !", {variant: "success", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
           setEditing(false);
    
           // notify parent board state when column name change
           if(onColumnNameChange) onColumnNameChange(column.columnId, updatedColumn);                                    
         }
         catch(error)
         {
            enqueueSnackbar(error.response?.data|| "Failed to update column name !", { variant: "error", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
         }
    };


    // delete column
    const handleDeleteColumn = async () => {
        try
        {
           await deleteColumn (boardId, column.columnId);
           enqueueSnackbar("Column deleted successfully !", { variant: "success", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
           // notify parent board state when column get deleted
           if(onColumnDelete) onColumnDelete(column.columnId);   
        }
        catch(error)
        {
          enqueueSnackbar(error.response?.data|| "Failed to delete column !", { variant: "error", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
        }
    };



    // --------- Task handlers lifted up -----------

    // task added (lift up state)
    const handleTaskAdded = (newTask) => {

      // notify parent board state when task added
      if(onTaskAdded) onTaskAdded(newTask);
      setShowTaskForm(false);
    }; 
    

    // function to edit task
    const handleTaskUpdated = async (updatedTask) => {
      
      // notify parent board state when task is updated
      if(onTaskUpdate) onTaskUpdate(updatedTask);
      enqueueSnackbar("Task updated successfully !", {variant: "success"});
      
    };


    // handler to open form for editing
    const handleEditTask = (task) => {
       setEditingTask(task);     // set task to edit
       setShowTaskForm(true);    // open the add form dialog

    };


    // opeartions / actions perform on card
    const actions = [
         {
           src : pencilImg,
           name: 'Edit Column Name',
           onClick : () => setEditing(true),  
         },
         { 
           src : addTaskImg, 
           name: 'Add Task',
           onClick : () => setShowTaskForm(true), 
         },
        { 
           src : deleteImg, 
           name: 'Delete Column',
           onClick : handleDeleteColumn,
        }
       ];
      


    return (
      <Card sx = {{minWidth: 300, minHeight : 350, display: "flex", flexDirection: "column", backgroundColor: getColumnColor(column.columnName)}} raised>

        {/* Card Header -- Editable Column Name */ }
        <Stack direction="row" alignItems="center" justifyContent="space-between" padding = "20px">
              <Typography variant="h4" noWrap>
                {
                 editing ? (
                            <InlineEditableField
                              value={column.columnName}
                              onSave={handleSaveColumnName}
                              forceEditMode
                            />
                           ) : (
                                column.columnName
                               )
                }
              </Typography>

            <Box sx={{ position: "relative", width: 40, height: 40 }}>
               <SpeedDialLayout className={styles["transparent-speed-dial"]}
                                actions={actions} direction="down" />
             </Box>
        </Stack>

        
        {/* Add Task Form */}

         {
           showTaskForm && (<AddTaskForm boardId = {boardId}
                                         columnId = {column.columnId}
                                         task = {editingTask}            // pass task for edit mode 
                                         open = {showTaskForm}
                                         onClose = {() => {setShowTaskForm(false); setEditingTask(null);}}                  // passing close function
                                         onTaskAdded = {handleTaskAdded}     
                                         onTaskUpdated = {handleTaskUpdated}  
                            /> 
                           )
         }


        <CardContent style = {{flexGrow: 1}}>
        
         {
           tasks.length > 0 ? (
                                 tasks.map(t => <TaskCard key = {t.taskId} task = {t} 
                                                          onTaskEdit = {handleEditTask}
                                                          onTaskArchive = {onTaskArchive}
                                                          onTaskRestore = {onTaskRestore}
                                                          onTaskDelete = {onTaskDelete}
                                                          archiveColumnId = {archiveId}
                                                 />)
                               )
                            : (
                               <Typography variant = "body2" color = "gray" sx = {{textAlign: "center", marginTop: "16px"}}> No tasks yet </Typography>
                              )  
         }
          

        </CardContent> 

      </Card>
    );
}

export default ColumnCard;


                                             