import { useState, useEffect } from "react";
import {Box,Grid,Paper,Typography} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { getAllBoards, deleteBoard } from "../../Services/BoardServices";
import { Icon } from "../../Components/IconComponent/Icon";
import { deleteBoardImg } from "../../Components/IconComponent/Icon";
import CreateBoardForm from "../../Components/Board/CreateBoardForm";



function AdminDashboard() 
{
  const [boards, setBoards] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllBoards = async () => {
      try 
      {
        const allBoards = await getAllBoards();
        setBoards(allBoards);
      } 
      catch (error) 
      {
        console.error("Error fetching boards:", error.message);
      }
    };
    fetchAllBoards();
  }, []);


  const handleDeleteBoard = async (boardId) => {
    try 
    {
      const response = await deleteBoard(boardId);
      enqueueSnackbar(response || "Board deleted successfully!", {variant: "success"});
      setBoards((prev) => prev.filter((b) => b.boardId !== boardId));     // so that immediately UI reflected if board is deleted 
    } 
    catch (error) 
    {
      enqueueSnackbar(error?.message || "Delete failed", { variant: "error" });
    }
  };


  const handleBoardOpen = (boardId) => {
    navigate(`/board/${boardId}`);
  };


  const handleBoardCreated = (newBoard) => {
    setBoards((prev) => [...prev, newBoard]);
    setShowCreateForm(false);
  };


  return (
    <Box
      sx={{
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 6,
      }}
    >
      
      <Grid container spacing={4} maxWidth="lg">
      
        {/* LEFT SIDE */}
        <Grid item xs={12} md={5} lg={4}>
      
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              transition: "all 0.3s ease",
            }}
          >
            {!showCreateForm ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => setShowCreateForm(true)}
              >
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
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="#2E2E2E"
                    sx={{ mb: 0.3 }}
                  >
                    Create Board
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click here to create a new board and organize your tasks.
                  </Typography>
                </Box>
              </Box>
            ) : (
              <CreateBoardForm onBoardCreated={handleBoardCreated} 
              onCancel={() => setShowCreateForm(false)} />
            )}
          </Paper>
        </Grid>

        {/* RIGHT SIDE - Board Overview */}
        <Grid item xs={12} md={7} lg={8}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              minHeight: 320,
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Board Overview
            </Typography>

            {boards.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No boards created yet. Click “Create Board” to add one.
              </Typography>
            ) : (
              boards.map((board) => (
                <Box
                  key={board.boardId}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={1.5}
                  mb={1.5}
                  borderRadius={2}
                  sx={{
                    backgroundColor: "#fafafa",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": { boxShadow: "0px 2px 8px rgba(0,0,0,0.12)" },
                  }}
                  onClick={() => handleBoardOpen(board.boardId)}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <DashboardIcon sx={{ color: "#7b61ff" }} />
                    <Typography fontWeight="bold">{board.boardName}</Typography>
                  </Box>
                  <Icon
                    src={deleteBoardImg}
                    alt="Delete"
                    sx={{
                      cursor: "pointer",
                      width: 20,
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBoard(board.boardId);
                    }}
                  />
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}


export default AdminDashboard;







