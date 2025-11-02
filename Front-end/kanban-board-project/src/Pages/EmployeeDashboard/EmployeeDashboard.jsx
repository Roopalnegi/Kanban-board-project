import { useEffect, useState } from "react";
import { Typography, CircularProgress, Box, useTheme } from "@mui/material";
import { useSnackbar } from "notistack";
import { getTasksByEmployee } from "../../Services/TaskServices";
import { getBoardDetails } from "../../Services/BoardServices";
import BoardList from "../../Components/Board/BoardList";
import ChatButton from "../../Components/ChatRoomSetup/ChatButton/ChatButton";


export default function EmployeeDashboard({ setShowHeaderFooter, userData }) 
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
        enqueueSnackbar(error.response?.data || "Failed to fetch assigned boards !",{ variant: "error" });
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
    <Box sx={{ p: 3 , backgroundImage:`url("./Icons/employee-dashbaord-bg-1.png")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "bottom center",
                      backgroundSize: "contain",
                      backgroundAttachment: "fixed", // optional: creates a nice parallax effect
                      backgroundColor: "rgba(255,255,255,0.9)", // adds transparency overlay
                      backgroundBlendMode: "overlay", // blends color + image for transparency
                      minHeight: "90vh",
    }}>
      

      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", 
                 textAlign: "center", p: 4, borderRadius: 3,marginTop: 4}}>


          <Typography variant="h4" fontWeight={700} sx={{   color: "#2E2E2E",   letterSpacing: "0.5px",   mb: 1, }}>
                  Welcome, {userData.username}!
          </Typography>


          <Typography variant="body1" sx={{ color: "#3b2f0d", opacity: 0.9, mb: 1 }}>
                  Here are your<b> assigned boards </b>— let’s get things done!
          </Typography>


          <Typography variant="body2" sx={{   color: "#6B4E23",   fontStyle: "italic", }}>
              Stay organized, stay productive 🚀
          </Typography>
          
      </Box>

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
        
    {/* Chat icon */}
     <ChatButton setShowHeaderFooter={setShowHeaderFooter} />
                           
    </Box>
  );

}
