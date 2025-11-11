import { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useSnackbar } from "notistack";
import { useNavigate, Link } from "react-router-dom";
import { getAllBoards, deleteBoard } from "../../Services/BoardServices";
import { Icon, deleteBoardImg, reportGif } from "../../Components/IconComponent/Icon";
import CreateBoardForm from "../../Components/Board/CreateBoardForm";
import styles from "./AdminDashboard.module.css";
import ChatButton from "../../Components/ChatRoomSetup/ChatButton/ChatButton";


function AdminDashboard({ setShowHeaderFooter }) 
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
      enqueueSnackbar(response || "Board deleted successfully!", {
        variant: "success",
      });

      // Remove from UI instantly
      setBoards((prev) =>prev.filter((b) => b.boardId !== boardId));
    } 
    catch (error) 
    {
      enqueueSnackbar(error?.message || "Failed to delete board!", {
        variant: "error",
      });
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
    <Box className={styles.adminDashboardContainer}>
      <Grid container spacing={6} className={styles.dashboardGrid}>
        {/* LEFT SIDE */}
        <Grid item xs={12} md={5} lg={4}>
          <Paper className={styles.createBoardPaper}>
            {!showCreateForm ? (
              <Box
                className={styles.createBoardBox}
                onClick={() => setShowCreateForm(true)}
              >
                <Box className={styles.createIcon}>
                  <AddCircleOutlineIcon />
                </Box>
                <Box>
                  <Typography className={styles.createTitle}>
                    Create Board
                  </Typography>
                  <Typography className={styles.createSubtitle}>
                    Click here to create a new board and organize your tasks.
                  </Typography>
                </Box>
              </Box>
            ) : (
              <CreateBoardForm
                onBoardCreated={handleBoardCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            )}
          </Paper>

          {/* Employee Progress Report link */}
          <Box className={styles.reportBoard}>
            <Link to = "/employeeProgressReport">
             See How the Employee Is Progressing <Icon src={reportGif} width="50" height= "50"/>
            </Link>
          </Box>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid item xs={12} md={7} lg={8}>
          <Paper className={styles.boardPaper}>
            <Typography className={styles.boardTitle}>
              Board Overview
            </Typography>

            {boards.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No boards created yet.
              </Typography>
            ) : (
              boards.map((board) => (
                <Box
                  key={board.boardId}
                  className={styles.boardItem}
                  onClick={() => handleBoardOpen(board.boardId)}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <DashboardIcon sx={{ color: "#2a71bdff" }} />
                    <Typography fontWeight="bold">
                      {board.boardName}
                    </Typography>
                  </Box>

                  {/* Delete Icon */}
                  <Icon
                    src={deleteBoardImg}
                    alt="Delete"
                    className={styles.deleteIcon}
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

      {/* Chat icon */}
      <ChatButton setShowHeaderFooter={setShowHeaderFooter} />
    </Box>
  );
}

export default AdminDashboard;
