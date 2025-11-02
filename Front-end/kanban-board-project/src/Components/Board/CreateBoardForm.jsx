import { useState } from "react";
import {Box, TextField, Button, Typography, Card, CardContent} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { createNewBoard } from "../../Services/BoardServices";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import AISuggestionButton from "../AISuggestionInput/AISuggestionInput";

function CreateBoardForm({ onBoardCreated ,onCancel}) 
{
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    try 
    {
      const newBoard = await createNewBoard({
                                             boardName,
                                             description,
                                             createdBy: "admin",
                                            });

    enqueueSnackbar("Board created successfully !", {variant: "success"});
    
    // notify parent admin dashboard wheneever new board is created
    if (onBoardCreated) onBoardCreated(newBoard);
    setBoardName("");
    setDescription("");
    navigate(`/board/${newBoard.boardId}`);
    } 
    catch (error) 
    {
      enqueueSnackbar(error?.response?.data?.message || "Failed to create board !",{ variant: "error"});
    }
  };



  const handleCancel = () => {
    setBoardName("");
    setDescription("");
    if (onCancel) onCancel();
  };



  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "#f4f6f9" }}>
      
      <Card sx={{
          borderRadius: 3,
          boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.08)",
          backgroundColor: "#fff",
          width: "100%",
          maxWidth: 420,
          p: 4,
        }}
      >

        <CardContent>

          {/* Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <Box
              sx={{
                border: "2px solid #7B61FF",
                borderRadius: "50%",
                p: 1,
                mr: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7B61FF",
              }}
            >
              <AddCircleOutlineIcon fontSize="medium" />
            </Box>

            <Box>
              <Typography variant="h6" fontWeight="bold" color="#2E2E2E">
                Create Board
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a blank board to organize your tasks, columns, and manage
                your workflow easily.
              </Typography>
            </Box>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2.5}
          >
            {/* TextField Board Name + AI*/}

            <Box display="flex" alignItems="center" gap={1}>
            
              <TextField
                label="Board Name *"
                variant="outlined"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                required
                fullWidth
              />
              <AISuggestionButton value={boardName} onSelect={(s) => setBoardName(s)} />
            </Box>

             {/* Description + AI */}
             <Box display="flex" alignItems="center" gap={1}>
              <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
              <AISuggestionButton value={description} onSelect={(s) => setDescription(s)} />
            </Box>

            <Box display="flex" justifyContent="space-between" gap={2}>
              <Button
                variant="outlined"
                type="submit"
                fullWidth
                sx={{
                  borderColor: "#7B61FF",
                  color: "#7B61FF",
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "rgba(123,97,255,0.05)",
                    borderColor: "#7B61FF",
                  },
                }}
                
              >
                Create
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                fullWidth
                sx={{
                  borderColor: "#7B61FF",
                  color: "#7B61FF",
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "rgba(123,97,255,0.05)",
                    borderColor: "#7B61FF",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CreateBoardForm;