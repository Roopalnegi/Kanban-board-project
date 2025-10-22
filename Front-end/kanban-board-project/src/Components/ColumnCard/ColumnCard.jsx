import { Card,CardContent,Box,Typography, Stack} from "@mui/material";
import {useState} from 'react';
import { useSnackbar } from "notistack";
import TaskCard from "../TaskCard/TaskCard";
import SpeedDialLayout from '../SpeedDialLayout/SpeedDialLayout';
import styles from '../SpeedDialLayout/SpeedDialLayout.module.css';
import InlineEditableField from "../InlineEditableField/InlineEditableField";
import { addTaskImg, deleteImg, pencilImg } from "../IconComponent/Icon";
import { updateColumnName, deleteColumn } from "../../Services/ColumnServices";

function ColumnCard({boardId,column,tasks, onColumnNameChange, onColumnDelete})
{

   const{enqueueSnackbar} = useSnackbar();

   const [editing, setEditing] = useState(false);  // tarck column name edit mode

   
   // function to get column color based on priority
    const getColumnColor = (columnName) => {
            if (!columnName) return "#75757554"; // fallback color for undefined/null
            switch ((columnName).toLowerCase()) 
            {
              case "to do": return "#64B5F6"; 
              case "in progress": return "#FFD54F"; 
              case "done": return "#81C784"; 
              case "archive": return "#BDBDBD";
              default: return getRandomRGB();
            }
    };

    

    // function to get random rgb code 
    const getRandomRGB = () => {
         const r = Math.floor(Math.random() * 256); // Red: 0-255
         const g = Math.floor(Math.random() * 256); // Green: 0-255
         const b = Math.floor(Math.random() * 256); // Blue: 0-255
         return `rgb(${r}, ${g}, ${b})`;
    }; 











   // function to save column name
   const handleSaveColumnName = async (newName) => {
     try
     {
       await updateColumnName(boardId, column.columnId, newName);
       enqueueSnackbar("Column name updated !", {variant: "success"});
       setEditing(false);

       // notify parent update board state when column name change
       if(onColumnNameChange) onColumnNameChange(column.columnId, newName);                                    
     }
     catch(error)
     {
         enqueueSnackbar(error?.message || "Failed to update column name !", {variant: "error"}); 
     }
            
   };


   // function to delete column from a board
      const handleDeleteColumn = async (columnId) => {
        try
        {
           await deleteColumn (boardId, columnId);
         
           enqueueSnackbar("Column deleted successfully !", { variant: "success" });
           
           // notify parent update board state when column get deleted 
           if(onColumnDelete) onColumnDelete(column.columnId);   
        }
        catch(error)
        {
          enqueueSnackbar(error?.message || "Failed to create column !", { variant: "error" });
        }
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
           onClick : () => alert("Task form Clicked!"), 
         },
        { 
           src : deleteImg, 
           name: 'Delete Column',
           onClick : () => handleDeleteColumn (column.columnId),
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

          
        <CardContent style = {{flexGrow: 1}}>
        
         {
           tasks.length > 0 ? (
                                 tasks.map(t => <TaskCard key = {t.taskId} task = {t} />)
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
                                             