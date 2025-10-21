import { useEffect, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { getAllBoards } from "../../Services/BoardServices";
import CreateBoardForm from "../../Components/Board/CreateBoardForm";
import BoardList from "../../Components/Board/BoardList";

function AdminDashboard()
{
    const[boards,setBoards]=useState([]);

    const loadBoards = (newBoard) => {
       if (newBoard) 
        {
          setBoards(prev => [...prev, newBoard]); // add the new board to state
        }
    };


    // refresh page when board get deleted (app liftup state)
    const onBoardDeleted = (boardId) => {
        setBoards(prev => prev.filter(board => board.boardId !== boardId));
    };


    useEffect(()=>{

        const fetchAllBoards = async () => {
                try
                {
                    const allBoards = await getAllBoards();
                    setBoards(allBoards);
                }
                catch(error)
                {
                    console.error("Error in fetahcing all boards for board overview : ", error.message);
                }
        };

        fetchAllBoards();

    },[]);


    return(
        <Box display="flex" flexDirection="column"minHeight="100vh" bgcolor="#f5f6fa">
            <Grid container spacing={3}sx={{flex:1,padding:3}}>
                {/* leftside CreateBoard */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{
                        padding:3,
                        borderRadius:3,
                        boxShadow:4
                    }}
                    >
                        <CreateBoardForm onBoardCreated={loadBoards}/>
                    </Paper>
                </Grid>

                {/* rightSide:boardView */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{
                        padding:3,
                        borderRadius:3,
                        boxShadow:4
                    }}
                    >
                        <BoardList boards={boards} onBoardDeleted={onBoardDeleted} />
                    </Paper>

                </Grid>
            </Grid>
        </Box>


    );
}

export default AdminDashboard;

