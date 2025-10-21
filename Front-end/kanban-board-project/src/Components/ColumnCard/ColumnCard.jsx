import { Card,CardContent, CardHeader, CardActions, Typography} from "@mui/material";
import { useSnackbar } from "notistack";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TaskCard from "../TaskCard/TaskCard";
import InlineEditableField from "../InlineEditableField/InlineEditableField";
import { updateColumnName } from "../../Services/ColumnServices";

function ColumnCard({boardId,column,tasks, onColumnNameChange})
{

   const{enqueueSnackbar} = useSnackbar();

    
   // function to save column name
   const handleSaveColumnName = async (newName) => {
     try
     {
       await updateColumnName(boardId, column.columnId, newName);
       enqueueSnackbar("Column name updated !", {variant: "success",
                                                 autoHideDuration: 2000,
                                                 anchorOrigin: {vertical: "top", horizontal: "right"},
                                                });
       // update board state
       if(onColumnNameChange)
          onColumnNameChange(column.columnId, newName);                                         
                                              
     }
     catch(error)
     {
         enqueueSnackbar(error?.message || "Failed to update column name !", {variant: "error",
                                                                              autoHideDuration: 2000,
                                                                              anchorOrigin: {vertical: "top", horizontal: "right"},
                                                                              }); 
     }
            
   };

    return (
      <Card sx = {{maxWidth: 400}} raised>

        {/* Editable Column Name */ }
        {/* <InlineEditableField label = ""
                             value = {column.columnName}
                             onSave = {handleSaveColumnName}
        />                      */}

        <CardHeader
        title={
          <InlineEditableField
            label=""
            value={column.columnName}
            onSave={handleSaveColumnName}
          />
        }
        sx={{
          pb: 0,
          "& .MuiCardHeader-title": {
            fontWeight: "bold",
            fontSize: "1rem",
          },
        }}
      />

          
        <CardContent>
        
         {
           tasks.length > 0 ? (
                                 tasks.map(t => <TaskCard key = {t.taskId} task = {t} />)
                               )
                            : (
                               <Typography variant = "body2" component = "span" sx = {{textAlign: "center"}}> No tasks yet </Typography>
                              )  
         }
          

        </CardContent> 
           
        <CardActions>

            <DeleteForeverIcon sx = {{cursor: "pointer"}} onClick = {() => alert("This is delete forever icon")} />
            <AddCircleIcon sx = {{cursor: "pointer"}} onClick = {() => alert("add task form will come")} /> 
        
        </CardActions> 
      </Card>
    );
}

export default ColumnCard;