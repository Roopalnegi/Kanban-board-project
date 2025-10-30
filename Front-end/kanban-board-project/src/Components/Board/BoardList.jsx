import { useState, useEffect } from "react";
import { getAllBoards } from "../../Services/BoardServices";
import { getTasksByEmployee } from "../../Services/TaskServices";
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

export default function BoardList({ userData, boards: propBoards = [], onBoardDeleted }) 
{

  const [boards, setBoards] = useState(propBoards);
  const [loading, setLoading] = useState(!propBoards.length);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isEmployee = userData?.role?.toLowerCase() === "employee";

  useEffect(() => {
    if (!userData) return;
    
    // Only fetch boards if propBoards is empty (for admin)
    if (propBoards.length > 0) 
    {
      setBoards(propBoards);
      setLoading(false);
      return;
    }
    
    const fetchBoards = async () => {
      try 
      {
        if (isEmployee) 
        {
          const tasks = await getTasksByEmployee(userData.email);
          const uniqueBoards = [];
          const boardMap = {};
          tasks.forEach((task) => {
            const board = task.board || task.boardId || null;
            if (board && !boardMap[board.boardId]) {
              boardMap[board.boardId] = true;
              uniqueBoards.push(board);
            }
          });
          setBoards(uniqueBoards);
        } 
        else 
        {
          const allBoards = await getAllBoards();
          setBoards(allBoards);
        }
      } 
      catch (error) 
      {
        enqueueSnackbar("Failed to load boards !", { variant: "error" });
      } 
      finally 
      {
        setLoading(false);
      }
    };
    fetchBoards();
  }, [propBoards, isEmployee, userData, enqueueSnackbar]);
  
  
  if (!userData) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>
        Loading user data...
      </Typography>
    );
  }

  if (loading) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>
        Loading boards...
      </Typography>
    );
  }
  
  const handleCreateBoard = () => navigate("/create-board");
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        {isEmployee ? "" : "All Boards"}
      </Typography>
      {!isEmployee && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
          onClick={handleCreateBoard}
        >
          + Create Board
        </Button>
      )}
      <Grid container spacing={2}>
        {boards.length > 0 ? (
          boards.map((board) => (
            <Grid item xs={12} sm={6} md={4} key={board.boardId}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(231, 222, 222, 1)" },
                }}
                onClick={() => navigate(`/board/${board.boardId}`)} raised
              >
                <CardContent>
                  <Typography variant="h6" sx={{py:2}}><b>{board.boardName}</b></Typography>
                  <Typography variant="body2">
                    {board.description || "No description"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {isEmployee
              ? "No boards with tasks assigned to you yet !"
              : "No boards created yet !"}
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
