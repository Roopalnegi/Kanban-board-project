import {useState, useEffect} from 'react';
import {Typography,Stack, CircularProgress, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
import InlineEditableBoardInfo from '../../Components/Board/InlineEditBoardInfo';
import ColumnCard from '../../Components/ColumnCard/ColumnCard';
import SpeedDialLayout from '../../Components/SpeedDialLayout/SpeedDialLayout';
import SearchBar from '../../Components/SearchPerBoard/SearchBar';
import FilterButton from '../../Components/FilterPerBoard/FilterButton';
import { getBoardDetails, deleteBoard } from '../../Services/BoardServices';
import { getAllTasksOfBoardId, searchTasksByKeyword } from '../../Services/TaskServices';
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
   

   const [searchTerm, setSearchTerm] = useState('');     // search compoenent since searching is done per board
   const [filterOption, setFilterOption] = useState(false);     // filter task since filter is done per board


   // fetch board and its tasks, handle searching 
   useEffect(() => {
     
     let active = true;                         // race condition -- boolean ensure updates only happen when compoenent is mounted

     // delay serach by 500ms to avoid unnecessary api call since right now even small keystroke triggers search
     const fetchBoard = setTimeout (async () => {
        
        try
        {
            // fetch board data (including column info)
            const boardData = await getBoardDetails(boardId);

            let taskData;

            if(searchTerm.trim() !== "")
            {
               // search task by keyword
               taskData = await searchTasksByKeyword(boardId, searchTerm);
            }
            else
            {
               // fetch all tasks data belong to board
               taskData = await getAllTasksOfBoardId(boardId);
            }

            if(active)
            {
                setBoard(boardData);
                setTasks(taskData);
                setLoading(false);
            }
           
        }
        catch (error) 
        {
            enqueueSnackbar(error.response?.data|| "Failed to fetch board or tasks !", { variant: "error", anchorOrigin: {horizontal: "bottom", vertical: "right"}});
        }
        
    },500);       // wait 500ms after typing stops before calling the API.   

    

     return () => {active = false // clean race condition
                  clearTimeout(fetchBoard);    // If the user types again within 500ms, it cancels the previous API call.
                  };           

   },[boardId,searchTerm, filterOption]);





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

              {/* Display Board Info */}
              <InlineEditableBoardInfo board = {board} />
    
              {/* Helper Tools */}
              <Box sx = {{display: "flex", gap: 1, jsutifyContent: "space-between", alignItems: "center"}}>

                <SearchBar setSearchTerm = {setSearchTerm} />
                
                <FilterButton boardId = {boardId} setTasks = {setTasks} setFilterOption = {setFilterOption} />

                <SpeedDialLayout actions = {actions} direction = "left"/>

              </Box>
          </Stack>
          
          
          {/* overflowX -- allow horizontally acrolling if column overflow */}
          <div style={{ display: "flex", gap: "40px", overflowX: "auto", padding: "16px 0"}}>
              
             {/* filter tasks by columnid for each column card */}
             {
                tasks.length === 0 ? ( <Typography variant = "h4" sx={{textAlign: "center", mt: 2, fontWeight: 900}}>No tasks found !!</Typography> )
                                   : (
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
                                            
                                           )))
             }
     
           </div>
  
      </div>
   );
}

export default BoardDashboard;