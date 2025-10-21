

import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { createNewBoard} from "../../Services/BoardServices";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

export default function CreateBoardForm({ onBoardCreated }) 
{
    const { enqueueSnackbar } = useSnackbar(); 
    const navigate = useNavigate();

    const [boardName, setBoardName] = useState("");
    const [description, setDescription] = useState("");
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try 
        {
            // create new board
            const newBoard = await createNewBoard({ 
                boardName, 
                description, 
                createdBy: "admin" 
            });


            // Show success snackbar message 
            enqueueSnackbar("Board created successfully!", {variant: "success",
                                                            autoHideDuration: 2000,
                                                            anchorOrigin: { vertical: "top", horizontal: "right" },
                                                           });

            // Update parent component
            if (onBoardCreated) onBoardCreated(newBoard);

            // Clear form
            setBoardName("");
            setDescription("");

            // redirect to board view
            navigate(`/board/${newBoard.boardId}`);

        } 
        catch (error) 
        {
            // Show error snackbar
            enqueueSnackbar(error?.response?.data?.message || "Failed to create board", {variant: "error",
                                                                                         autoHideDuration: 2000,
                                                                                         anchorOrigin: { vertical: "top", horizontal: "right" },
                                                                                        });
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2}
        >
            <Typography
                variant="h6"
                color="primary"
                fontWeight="bold"
                display="flex"
                alignItems="center"
                gap={1}
            >
                <AddCircleOutlineIcon />
                Create New Board
            </Typography>

            <TextField
                label="Board Name"
                variant="outlined"
                size="small"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                required
            />

            <TextField
                label="Board Description"
                variant="outlined"
                size="small"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <Button
                variant="contained"
                color="theme.colors.buttons"
                type="submit"
            >
                Create board
            </Button>
        </Box>
    );
}
