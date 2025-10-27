import { useEffect, useState } from "react";
import { Typography, CircularProgress, Box, useTheme } from "@mui/material";
import { useSnackbar } from "notistack";
import { getTasksByEmployee } from "../../Services/TaskServices";
import { getBoardDetails } from "../../Services/BoardServices";
import BoardList from "../../Components/Board/BoardList";


export default function EmployeeDashboard({ userData }) 
{

  const theme = useTheme();

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  
  useEffect(() => {
  
    const fetchBoards = async () => {
      
        if (!userData?.email) return;                // if user email is not exist 
        console.log(userData);
         
        try 
        {
         const tasks = await getTasksByEmployee(userData.email);    // Step 1: fetch all tasks assigned to employee
     
         const boardIds = [...new Set(tasks.map((t) => t.boardId))];      // Step 2: extract unique boardIds from tasks
       
         const boardPromises = boardIds.map((id) => getBoardDetails(id));    // Step 3: fetch full board details for each boardId
         const boardsData = await Promise.all(boardPromises);
         setBoards(boardsData);
        } 
        catch (error) 
        {
        enqueueSnackbar(error.response?.data || "Failed to fetch assigned boards!",{ variant: "error" });
        } 
        finally 
        {
        setLoading(false);
        }
    };
    fetchBoards();
  }, [userData, enqueueSnackbar]);



  const handleBoardDeleted = (deletedBoardId) => {
    setBoards((prev) =>prev.filter((board) => board.boardId !== deletedBoardId));
  };



  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );


  return (
    <Box sx={{ p: 3 }}>

      <Typography variant="h5" fontWeight="bold" mb={2} sx ={{textAlign: "center"}}>
        Welcome, {userData.username} !
      </Typography>

      {
        boards.length > 0 ? (
                             <BoardList
                              boards={boards}
                              userData={userData} // pass employee info
                              onBoardDeleted={handleBoardDeleted}
                            />
      ) : (
        <Typography sx = {{color: theme.colors.bodyText}}>
          No boards assigned to you yet !.
        </Typography>
      )}
    </Box>
  );

}
