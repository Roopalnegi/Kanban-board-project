import { Card,CardContent,Box,Typography, Stack} from "@mui/material";
import {useState, useEffect} from 'react';
import { useSnackbar } from "notistack";
import AddTaskForm from "../../Forms/AddTask/AddTask";
import SpeedDialLayout from '../SpeedDialLayout/SpeedDialLayout';
import InlineEditableField from "../InlineEditableField/InlineEditableField";
import styles from '../SpeedDialLayout/SpeedDialLayout.module.css';
import { addTaskImg, deleteImg, pencilImg } from "../IconComponent/Icon";
import { updateColumnName, deleteColumn, getArchiveColumnId} from "../../Services/ColumnServices";
import DraggableTask from "../DragAndDrop/DraggableTask";
import { useDroppable } from "@dnd-kit/core";


function ColumnCard({boardId, column, tasks, onColumnNameChange, onColumnDelete, onTaskAdded, onTaskUpdate, onTaskArchive, onTaskRestore, onTaskDelete, userData, profileImage})
{
  
   const isEmployee = userData?.role?.toLowerCase() === "employee";
   
   const {setNodeRef} = useDroppable({id: String(column.columnId)});       // give each droppable the column id
                                                                                   // such that over.id will be columnId  

   const{enqueueSnackbar} = useSnackbar();

   const [editing, setEditing] = useState(false);                  // track column name edit mode
   const [editingTask, setEditingTask] = useState(null);           // store the task that needs to be edited
   const [showTaskForm, setShowTaskForm] = useState(false);        // control addTaskForm dialog visibility
   const [archiveId, setArchiveId] = useState(null);


   // function to get archive column id
   useEffect(() => {

       const fetchArchiveId = async () => {
         try
         {
          const id = await getArchiveColumnId(boardId);
          setArchiveId(id);
         }
         catch(error)
         {
          console.error("Failed to fetch archive Id : ", error);
         }
       };
       fetchArchiveId();
   },[boardId]);


   // function to get column color based on priority
    const getColumnColor = (columnName) => {
            if (!columnName) return "#75757554"; // fallback color for undefined/null
            switch ((columnName).toLowerCase()) 
            {
              case "to do": return "rgba(145, 200, 245, 0.32)"; 
              case "in progress": return "rgba(242, 217, 134, 0.33)"; 
              case "done": return "rgba(131, 238, 136, 0.28)"; 
              case "archive": return "rgba(127, 125, 125, 0.11)";
              default: return getRandomRGBA();
            }
    };

    

    // function to get random rgba code 
    const getRandomRGBA = (alpha = 0.1 ) => {
         const r = Math.floor(Math.random() * 256); // Red: 0-255
         const g = Math.floor(Math.random() * 256); // Green: 0-255
         const b = Math.floor(Math.random() * 256); // Blue: 0-255
         return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }; 



    // rename column name
    const handleSaveColumnName = async (newName) => {
         if(isEmployee)
         {
          enqueueSnackbar("Employees cannot rename columns !", { variant: "warning" });
      return;
         }
         try
         {
           const updatedColumn = { columnId: column.columnId, 
                                   columnName: newName, 
                                   columnOrder: column.columnOrder};

           await updateColumnName(boardId, column.columnId, updatedColumn);
           enqueueSnackbar("Column name updated !", {variant: "success"});
           setEditing(false);
    
           // notify parent board state when column name change
           if(onColumnNameChange) onColumnNameChange(column.columnId, updatedColumn);                                    
         }
         catch(error)
         {
            enqueueSnackbar(error.response?.data|| "Failed to update column name !", { variant: "error"});
         }
    };


    // delete column
    const handleDeleteColumn = async () => {
        if (isEmployee) {
      enqueueSnackbar("Employees cannot delete columns !", { variant: "warning" });
      return;
    }
        try
        {
           await deleteColumn (boardId, column.columnId);
           enqueueSnackbar("Column deleted successfully !", { variant: "success"});
           // notify parent board state when column get deleted
           if(onColumnDelete) onColumnDelete(column.columnId);   
        }
        catch(error)
        {
          enqueueSnackbar(error.response?.data|| "Failed to delete column !", { variant: "error"});
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
    const actions = !isEmployee ? [
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
       ] : [];  // employee see no actions
      


    return (
      <Card ref={setNodeRef}
            sx = {{minWidth: 300, minHeight : 350, display: "flex", flexDirection: "column", backgroundColor: getColumnColor(column.columnName)}} raised>

        {/* Card Header -- Editable Column Name for admin only */ }
        <Stack direction="row" alignItems="center" justifyContent="space-between" padding = "20px">
              <Typography variant="h4" noWrap>
                {
                 editing && !isEmployee ? (
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
               {/* Hide speed dial for employee */}
                {
                  !isEmployee  &&  <SpeedDialLayout className={styles["transparent-speed-dial"]}
                                                            actions={actions} direction="down" />
                }
               
             </Box>
        </Stack>

        
        {/* Add Task Form */}

         {
           !isEmployee && showTaskForm && (<AddTaskForm boardId = {boardId}
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
                                 tasks.map(t => <DraggableTask draggable = {isEmployee}
                                                               key = {t.taskId} 
                                                               task = {t} 
                                                               onTaskEdit = {handleEditTask}
                                                               onTaskUpdate = {onTaskUpdate}
                                                               onTaskArchive = {onTaskArchive}
                                                               onTaskRestore = {onTaskRestore}
                                                               onTaskDelete = {onTaskDelete}
                                                               archiveColumnId = {archiveId}
                                                               readOnly = {isEmployee}             // employees can't edit / archive / delete
                                                               profileImage = {profileImage}

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


                                             