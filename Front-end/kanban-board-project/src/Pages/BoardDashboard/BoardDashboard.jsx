import {useState, useEffect} from 'react';
import {Typography,Stack, CircularProgress} from '@mui/material';
import InlineEditableBoardInfo from '../../Components/Board/InlineEditBoardInfo';
import ColumnCard from '../../Components/ColumnCard/ColumnCard';
import { getBoardDetails, deleteBoard } from '../../Services/BoardServices';
import { getAllTasksOfBoardId } from '../../Services/TaskServices';
import { addColumnToBoard } from '../../Services/ColumnServices';
import { enqueueSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
import { addColumnImg,helpImg,deleteBoardImg  } from '../../Components/IconComponent/Icon';
import SpeedDialLayout from '../../Components/SpeedDialLayout/SpeedDialLayout';

function BoardDashboard()
{

   const navigate = useNavigate();

   const {boardId} = useParams();

   const [board, setBoard] = useState({columns: []});            // store baord data

   const [taskList, setTaskList] = useState([]);        // store all task belongs to board

   const [loading, setLoading] = useState(true);       // track data loading status 
   

   // fetch board and its tasks
   useEffect(() => {
     
     const fetchBoard = async () => {
        
        try
        {
            // fetch board data (including column info)
            const boardData = await getBoardDetails(boardId);

            // fetch all tasks data belong to baord
            const taskData = await getAllTasksOfBoardId(boardId); 
            

            setBoard(boardData);
            setTaskList(taskData);
            setLoading(false);

        }
        catch (error) 
        {
            enqueueSnackbar(error?.message || "Failed to fetch board or tasks", { variant: "error"});
        }
        
    };    

     fetchBoard();

   },[boardId]);



   // function to add column to a board
   const handleAddColumn = async () => {
     try
     {
        const newColumn = {columnName : "Untitled"};   // create a deafult column name
        await addColumnToBoard(boardId, newColumn);
      
        enqueueSnackbar("New column created!", { variant: "success" });

        // re-fetch baord after adding column
        const updatedBoard = await getBoardDetails(boardId);
        setBoard(updatedBoard);
     }
     catch(error)
     {
       enqueueSnackbar(error?.message || "Failed to create column", { variant: "error" });
     }
   };


     const handleDeleteBoard = async (boardId) => {
     try
     {
       const response = await deleteBoard(boardId);
       enqueueSnackbar(response || "Board Deleted Successfully !", {variant: "success"});    
       
       navigate("/admin-dashboard");                                                                                                          
     }
     catch(error)
     {
      enqueueSnackbar(error?.message, {variant: "error"});
     }
   };



    // update column name in board state (app lift state)
    const handleColumnNameChange = (columnId, newName) => {
    setBoard(prev => ({ ...prev,
                        columns: prev.columns.map(col => col.columnId === columnId ? { ...col, columnName: newName } : col),
                     }));
    };

    
     // update column name in board state (app lift state)
    const handleColumnDelete = (columnId) => {
    setBoard(prev => ({ ...prev,
                        columns: prev.columns.filter(col => col.columnId !== columnId)
                     }));
  };


   

   // opeartions / actions perform on board
   const actions = [
     { 
       src : addColumnImg, 
       name: 'Add Column',
       onClick : handleAddColumn, 
     },
    { 
       src : deleteBoardImg, 
       name: 'Delete Board',
       onClick : () => handleDeleteBoard(boardId),
    },
    { 
     src : helpImg, 
     name: 'Help',
     onClick : () => alert("Help Clicked !"),
    },
   ];

  

   // custom message if baord data or task data is failed to fetch
   if(!board || loading)
   {
    return <Typography variant = "h4" sx = {{m:3, textAlign: "center"}}> 
     <CircularProgress size = "30px" color = "inherit" /> Loading ....</Typography>
   }



   return (<div>

          <Stack direction = "column" spacing={2}>
              {/* Display Boad Info */}
              <InlineEditableBoardInfo board = {board} />
    
              {/* Helper Tools */}
              <SpeedDialLayout actions = {actions} direction = "left"/>
          </Stack>
          
          
          {/* overflowX -- allow horizontally acrolling if column overflow */}
          <div style={{ display: "flex", gap: "40px", overflowX: "auto", padding: "16px 0"}}>
              
             {/* filter tasks by columnid for each column card */}
             {
                board.columns?.map( col => (
                                                <ColumnCard key = {col.columnId}
                                                            boardId = {boardId}
                                                            column = {col} 
                                                            tasks = {taskList.filter(t => t.columnId === col.columnId)}
                                                            onColumnNameChange = {handleColumnNameChange}
                                                            onColumnDelete = {handleColumnDelete}/>
                                            
                                           ))
             }
     
           </div>
  
      </div>
   );
}

export default BoardDashboard;