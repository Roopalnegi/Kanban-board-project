import {useState, useEffect} from 'react';
import {Typography,Stack, CircularProgress} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
import InlineEditableBoardInfo from '../../Components/Board/InlineEditBoardInfo';
import ColumnCard from '../../Components/ColumnCard/ColumnCard';
import SpeedDialLayout from '../../Components/SpeedDialLayout/SpeedDialLayout';
import { getBoardDetails, deleteBoard } from '../../Services/BoardServices';
import { getAllTasksOfBoardId } from '../../Services/TaskServices';
import { addColumnToBoard, updateColumnName } from '../../Services/ColumnServices';
import { addColumnImg,helpImg,deleteBoardImg  } from '../../Components/IconComponent/Icon';


function BoardDashboard()
{

   const {enqueueSnackbar} = useSnackbar();
   const navigate = useNavigate();
   const {boardId} = useParams();

   const [board, setBoard] = useState({columns: []});            // store baord data
   const [tasks, setTasks] = useState([]);        // store all task belongs to board
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
            setTasks(taskData);
            setLoading(false);
        }
        catch (error) 
        {
            enqueueSnackbar(error.response?.data|| "Failed to fetch board or tasks !", { variant: "error", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
        }
        
    };    

     fetchBoard();

   },[boardId, enqueueSnackbar]);



   // add new column
   const handleAddColumn = async () => {
     try
     {
        const newColumn = {columnName : "Untitled"};   // create a deafult column name
        await addColumnToBoard(boardId, newColumn);
        const updatedBoard = await getBoardDetails(boardId);
        setBoard(updatedBoard);
        enqueueSnackbar("New column added !", { variant: "success", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
     }
     catch(error)
     {
        enqueueSnackbar(error.response?.data || "Failed to fetch create column !", { variant: "error", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
     }
   };


    // delete board 
    const handleDeleteBoard = async (boardId) => {
      try
      {
        await deleteBoard(boardId);
        enqueueSnackbar("Board deleted successfully !", {variant: "success", anchorOrigin: {horizontal: "bottom", vertical: "right"}});    
        navigate("/admin-dashboard");                                                                                                          
      }
      catch(error)
      {
        enqueueSnackbar(error.response?.data || "Failed to delete board !", { variant: "error", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
      }
   };



    // --------- Column handlers lifted up -------------

    // update column name  (app lift up state)
    const handleColumnNameChange = async (columnId, updatedColumn) => {
      try
      {
        await updateColumnName(boardId, columnId, updatedColumn);
        const updatedBoard = await getBoardDetails(boardId);
        setBoard(updatedBoard);
      }
      catch(error)
      {
        enqueueSnackbar(error.response?.data || "Failed to sync updated column name !", { variant: "error", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
      }
    };


    // delete column (app lift up state)
    const handleColumnDelete = (columnId) => {
      setBoard(prev => ({ ...prev,
                        columns: prev.columns.filter(col => col.columnId !== columnId)
                     }));

      // also remove tasks of that column  
      setTasks(prev => prev.filter(t => t.columnId !== columnId));              
    };



    // --------- Task handlers lifted up -----------

    // added new task (app lift up state)
    const handleTaskAdded = (newTask) => {
        setTasks(prev => [...prev, newTask]);
    };


    // update task (app lift up state)
    const handleTaskUpdated = (updatedTask) => {
      setTasks(prev => prev.map(t => t.taskId === updatedTask.taskId ? updatedTask : t));  
    };


    // remove task permanently (app lift up state)
    const handleTaskDeleted = (taskId) => {
       setTasks(prev => prev.filter(t => t.taskId !== taskId));
    };


    // archive task
    const handleTaskArchive = (updatedTask) => {
      setTasks(prev => prev.map(t => t.taskId === updatedTask.taskId ? updatedTask : t));
    };


    // restore task
    const handleTaskRestore = (updatedTask) => {
        setTasks(prev => prev.map(t => t.taskId === updatedTask.taskId ? updatedTask : t));
    };



   // opeartions / actions perform on board
   const actions = [
     { src : addColumnImg, 
       name: 'Add Column',
       onClick : handleAddColumn, 
     },
    { 
       src : deleteBoardImg, 
       name: 'Delete Board',
       onClick : handleDeleteBoard,
    },
    { 
     src : helpImg, 
     name: 'Help',
     onClick : () => enqueueSnackbar("Contact ✉️ roopalnegi147@gmail.com for further query.", {variant: "info", anchorOrigin: {horizontal: "top", vertical: "right"}}),
    },
   ];

  

   // custom message if baord data or task data is failed to fetch
   if(loading)
   {
      return ( <Typography variant = "h4" sx = {{m:3, textAlign: "center"}}> 
                     <CircularProgress size = "30px" color = "inherit" /> Loading ....
               </Typography>
             );  
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
                                                            tasks = {tasks.filter(t => t.columnId === col.columnId)}
                                                            onColumnNameChange = {handleColumnNameChange}
                                                            onColumnDelete = {handleColumnDelete}
                                                            onTaskAdded = {handleTaskAdded}
                                                            onTaskUpdate = {handleTaskUpdated}
                                                            onTaskArchive = {handleTaskArchive}
                                                            onTaskRestore = {handleTaskRestore}
                                                            onTaskDelete = {handleTaskDeleted}
                                                />
                                            
                                           ))
             }
     
           </div>
  
      </div>
   );
}

export default BoardDashboard;