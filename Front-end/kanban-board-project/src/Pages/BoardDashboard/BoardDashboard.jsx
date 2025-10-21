import {useState, useEffect} from 'react';
import {Grid,Typography,Stack, CircularProgress} from '@mui/material';
import InlineEditableBoardInfo from '../../Components/Board2/EditBoardInfo';
import ColumnCard from '../../Components/ColumnCard/ColumnCard';
import { getBoardDetails } from '../../Services/BoardServices';
import { getAllTasksOfBoardId } from '../../Services/TaskServices';
import { addColumnToBoard } from '../../Services/ColumnServices';
import { enqueueSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { addColumnImg, deleteImg, helpImg } from '../../Components/IconComponent/Icon';
import LeftSideSpeedDial from '../../Components/LeftSideSpeedDial/LeftSideSpeedDial';

function BoardDashboard()
{

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
            enqueueSnackbar(error?.message || "Failed to fetch board or tasks", { variant: "error",
                                                                         autoHideDuration: 2000,
                                                                         anchorOrigin: { vertical: "top", horizontal: "right" },
                                                                       });
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


    // update column name in board state
    const handleColumnNameChange = (columnId, newName) => {
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.columnId === columnId ? { ...col, columnName: newName } : col
      ),
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
       src : deleteImg, 
       name: 'Delete Column',
       onClick : () => alert("delete column clicked"),
    },
    { 
     src : helpImg, 
     name: 'Help',
     onClick : () => alert("help clicked"),
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
              <LeftSideSpeedDial actions={actions}/>
          </Stack>
          
          
     
          <Grid container spacing = {7} sx={{ my: 2, alignItems: 'flex-start' }}>
              
             {/* filter tasks by columnid for each column card */}
             {
                board.columns?.map( col => (<Grid item key = {col.columnId} xs = {12} md = {4}>
                                                <ColumnCard boardId = {boardId}
                                                            column = {col} 
                                                            tasks = {taskList.filter(t => t.columnId === col.columnId)}
                                                            onColumnNameChange = {handleColumnNameChange}/>
                                            </Grid>
                                           ))
             }
     
           </Grid>
  
      </div>
   );
}

export default BoardDashboard;