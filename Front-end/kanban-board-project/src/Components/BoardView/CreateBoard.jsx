import React from "react";
import {Card, CardContent,  IconButton, Typography}from '@mui/material'
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import boardService from "../../Services/BoardServices";
function CreateBoard(){
    const handleCreateBoard = async () => {
    try {
      const newBoard = {
        boardId: Math.floor(Math.random() * 1000), // temporary unique ID
        boardName: "New Board",
        description: "Created from frontend",
      };

      const created = await boardService.createBoard(newBoard);
      console.log(" Board created:", created);
      alert("Board created successfully!");
    } catch (error) {
      console.error(" Error creating board:", error);
      alert("Failed to create board. Check console for details.");
    }
  };
    return (
        <Card
             variant="outlined"
            onClick={handleCreateBoard}
            sx={{
                display:"flex",
                alignItems:"center",
                padding:3,
                cursor:"pointer",
                borderColor:"#d1c4e9",
                "&:hover":{boxShadow:3}
                }}
            >
                <IconButton color="primary" sx={{marginRight:2}}>
                    <AddCircleOutlineIcon sx={{fontSize:40}}/>
                </IconButton>
                <CardContent sx={{flexGrow:1}}>
                    <Typography variant="h6"color="primary">
                                    Create new board
                    </Typography>
                    <Typography variant="boady2"color="text.secondary">
                                    Create a board to organize tasks, projects, and team workflow.
                    </Typography>
                </CardContent>

            </Card>
                    
        )
}
export default CreateBoard();