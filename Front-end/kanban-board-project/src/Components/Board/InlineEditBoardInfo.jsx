import {Box, Typography} from '@mui/material';
import {useState} from 'react';
import { handleUpdatingBoardInfo } from '../../Services/BoardServices';
import { enqueueSnackbar } from 'notistack';
import InlineEditableField from '../InlineEditableField/InlineEditableField';

function InlineEditableBoardInfo({board})
{
     
    const [boardName, setBoardName] = useState(board.boardName);        // hold board name value
    const [description, setDescription] = useState(board.description);    // hold board description value 

    const handleSaveField = async (field, newValue) => {
       
        const updatedData = {boardName, description, [field]: newValue};
        try
        {

            await handleUpdatingBoardInfo(board.boardId, updatedData);

            if(field === "boardName")
                 setBoardName(newValue);
            else
                setDescription(newValue);

            enqueueSnackbar("Board updated successfully !", {variant: "success"});
        }
        catch(error)
        {
            enqueueSnackbar(error?.message || "Failed to update board !", {variant: "error"}); 
        }
       
    };

    
    return (
    <Box sx={{ boxShadow: 3, p: 2, mb: 3, position: "relative" }}>

      {/* Board Name */}
      <InlineEditableField label = "Board Name"
                           value = {boardName}
                           onSave = {(newValue) => handleSaveField("boardName", newValue)}
       />                    
    
      {/* Description */}
      <InlineEditableField label = "Description"
                           value = {description}
                           onSave = {(newValue) => handleSaveField("description", newValue)}
       />
    
 
      {/* Created At (read-only / non-editable) */}
      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        <b>Created On:</b> {board.createdAt}
      </Typography>
 
    </Box>
  );
}


export default InlineEditableBoardInfo;