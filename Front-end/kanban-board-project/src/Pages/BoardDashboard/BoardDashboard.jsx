import {useState, useEffect} from 'react';
import {Typography,Stack, CircularProgress, Box, Tooltip} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
import InlineEditableBoardInfo from '../../Components/Board/InlineEditBoardInfo';
import ColumnCard from '../../Components/ColumnCard/ColumnCard';
import SpeedDialLayout from '../../Components/SpeedDialLayout/SpeedDialLayout';
import SearchBar from '../../Components/SearchPerBoard/SearchBar';
import FilterButton from '../../Components/FilterPerBoard/FilterButton';
import { getBoardDetails, deleteBoard } from '../../Services/BoardServices';
import { getAllTasksOfBoardId, moveTaskByColumn, searchTasksByKeyword, updateTask } from '../../Services/TaskServices';
import { addColumnToBoard, updateColumnName } from '../../Services/ColumnServices';
import { addColumnImg, helpImg, deleteBoardImg } from '../../Components/IconComponent/Icon';
import { Icon, backArrowIcon } from '../../Components/IconComponent/Icon';
import { DndContext } from '@dnd-kit/core';
import styles from "./BoardDashboard.module.css";


function BoardDashboard({userData})
{

   const {enqueueSnackbar} = useSnackbar();
   const navigate = useNavigate();
   const {boardId} = useParams();
   
    const isEmployee = userData?.role?.toLowerCase() === "employee"; // ✅ check role

   const [board, setBoard] = useState({columns: []});            // store baord data
   const [tasks, setTasks] = useState([]);        // store all task belongs to board
   const [loading, setLoading] = useState(true);       // track data loading status 
   

   const [searchTerm, setSearchTerm] = useState('');     // search compoenent since searching is done per board
   const [filterOption, setFilterOption] = useState(false);     // filter task since filter is done per board

   
   // fetch boards and task based on assignee
   useEffect(() => {
    
    const fetchData = async () => {

         try {
         
           // Always fetch board details first
           const boardData = await getBoardDetails(boardId);
           setBoard(boardData);
     
           let tasksData = [];
     
           // search 
           if (searchTerm.trim() !== "") 
           {
             tasksData = await searchTasksByKeyword(boardId, searchTerm);
           } 
           else 
           {
             tasksData = await getAllTasksOfBoardId(boardId);
           }
     
           // Role-based filtering (for employees)
           if (isEmployee) 
           {
             tasksData = tasksData.filter(task => task.assignedTo?.includes(userData.email));
           }
     
           setTasks(tasksData);
         } 
         catch (error) 
         {
           console.error("Error fetching board or tasks:", error);
           enqueueSnackbar(error.response?.data || "Failed to fetch board or tasks !",{ variant: "error" });
         } 
         finally 
         {
           setLoading(false);
         }
  };

  fetchData();

}, [boardId, searchTerm, userData.email]);

    

   // add new column
   const handleAddColumn = async () => {
     if (isEmployee) 
     {
      enqueueSnackbar("Employees cannot add columns !", { variant: "warning" });
      return;
     }

     try
     {
        const newColumn = {columnName : "Untitled"};   // create a deafult column name
        await addColumnToBoard(boardId, newColumn);
        const updatedBoard = await getBoardDetails(boardId);
        setBoard(updatedBoard);
        enqueueSnackbar("New column added !", { variant: "success"});
     }
     catch(error)
     {
        enqueueSnackbar(error.response?.data || "Failed to fetch create column !", { variant: "error"});
     }
   };


    // delete board 
    const handleDeleteBoard = async (boardId) => {
      if (isEmployee) 
      {
        enqueueSnackbar("Employees cannot delete boards !", { variant: "warning" });
        return;
      }
      try
      {
        await deleteBoard(boardId);
        enqueueSnackbar("Board deleted successfully !", {variant: "success"});    
        navigate("/admin-dashboard");                                                                                                          
      }
      catch(error)
      {
        enqueueSnackbar(error.response?.data || "Failed to delete board !", { variant: "error"});
      }
   };



    // --------- Column handlers lifted up -------------

    // update column name  (app lift up state)
    const handleColumnNameChange = async (columnId, updatedColumn) => {
      if (isEmployee) 
      {
        enqueueSnackbar("Employees cannot delete boards. !", { variant: "warning" });
        return;
      }
      try
      {
        await updateColumnName(boardId, columnId, updatedColumn);
        const updatedBoard = await getBoardDetails(boardId);
        setBoard(updatedBoard);
      }
      catch(error)
      {
        enqueueSnackbar(error.response?.data || "Failed to sync updated column name !", { variant: "error"});
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



    // handle dragging
    const handleDragEnd = async ({active, over}) => {
        if(!active || !over) return;

        // only employee allowed to drag
        if(!isEmployee)
        {
           enqueueSnackbar("Only employees can move tasks !", {variant: "error"});
           return;
        }

        const taskId = String(active.id);             // dnd-kit compares ids strictly
        const newColumnId = String(over.id);

        // find current task and its column
        const currentTask = tasks.find(t => String(t.taskId) === taskId);
        if(!currentTask) return;

        const prevColumnId = String(currentTask.columnId || '');

        if(prevColumnId === newColumnId) return;      // nothing changed

        // move task in local state
        setTasks (prev => 
                  prev.map(task => String(task.taskId) === taskId ? {...task, columnId: newColumnId}: task));
        
        // update task on backend
        try
        {
          await moveTaskByColumn(taskId, newColumnId, userData.username);
           enqueueSnackbar("Task moved successfully !", { variant: "success" });
           // const updatedTasks = await getAllTasksOfBoardId(boardId);
    // setTasks(updatedTasks);

        } 
        catch(error)
        {
           // rollback on failure
           setTasks(prev => prev.map(t => (String(t.taskId) === taskId ? { ...t, columnId: prevColumnId } : t)));
           enqueueSnackbar("Failed to update task on server !", {variant: "error"});
        }
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
     onClick : () => enqueueSnackbar("Contact ✉️ roopalnegi147@gmail.com for further query.", {variant: "info"}),
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


   return (<div className={styles.pageBackground}>

          <Stack direction = "column" spacing={2} className={styles.boardDashboardWrapper}>

              {/* Display Board Info  + Back Button*/}
              <Box className={styles.boardHeaderRow}>
                 
                 <Tooltip title = "Back to Dashboard">
                     <Icon src={backArrowIcon} alt = "Back Arrow Icon" width="38" height= "38"
                       onClick={() => navigate(isEmployee ? "/employee-dashboard" : "/admin-dashboard")}/>
                 </Tooltip>
                
                 <Box sx={{ flexGrow: 1}}>
                    <InlineEditableBoardInfo board={board} userData={userData}/>
                 </Box>
              </Box>
         
                 
  
              {/* Helper Tools */}
              <Box className={styles.helperTools}>

                <SearchBar setSearchTerm = {setSearchTerm} />
                
                <FilterButton boardId = {boardId} setTasks = {setTasks} setFilterOption = {setFilterOption} userData = {userData} />

                 {
                   !isEmployee && <SpeedDialLayout actions = {actions} direction = "left"/>
                 }
              

              </Box>
          </Stack>
          
          
          
          {/* overflowX -- allow horizontally acrolling if column overflow */}
          <div className={styles.columnsContainer}>

              
             {/* filter tasks by columnid for each column card */}
             {
                (searchTerm.trim() !== "" && tasks.length === 0 )
                                    ? ( <Typography variant = "h4" className={styles.noTasksText}>
                                         No tasks found !!
                                        </Typography> 

                                    )
                                   : (
                                        <DndContext onDragEnd={handleDragEnd}>
                                            <div className={styles.columnsGroup}>

                                                { board.columns?.filter(col => { if (isEmployee && col.columnName.toLowerCase() === "archive")         // filter columns that are not archive for employee only 
                                                                                    { return false;}
                                                                                return true; 
                                                                              })
                                                                .map( col => (
                                                                     <ColumnCard key = {col.columnId}
                                                                                 boardId = {boardId}
                                                                                 column = {col} 
                                                                                 tasks = {tasks.filter(task => task.columnId === col.columnId)}
                                                                                 onColumnNameChange = {handleColumnNameChange}
                                                                                 onColumnDelete = {handleColumnDelete}
                                                                                 onTaskAdded = {handleTaskAdded}
                                                                                 onTaskUpdate = {handleTaskUpdated}
                                                                                 onTaskArchive = {handleTaskArchive}
                                                                                 onTaskRestore = {handleTaskRestore}
                                                                                 onTaskDelete = {handleTaskDeleted}
                                                                                 userData = {userData}
                                                                     />
                                                    
                                                   ))}
                                            </div>
                                        </DndContext>   
                                   )  
                                              
             }
     
           </div>
  
      </div>
   );
}

export default BoardDashboard;