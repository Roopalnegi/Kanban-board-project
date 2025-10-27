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
import { getAllTasksOfBoardId, moveTaskByColumn, searchTasksByKeyword, updateTask } from '../../Services/TaskServices';
import { addColumnToBoard, updateColumnName } from '../../Services/ColumnServices';
import { addColumnImg, helpImg, deleteBoardImg } from '../../Components/IconComponent/Icon';
import { DndContext } from '@dnd-kit/core';



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

      let active = true;

      const fetchBoardData = setTimeout(async () => {

         try
         {
            let boardDetails = await getBoardDetails(boardId);
            let taskData = [];


            if(isEmployee)
            {
                // fetch all tasks and filter those assigned to this employee
                const allTasks = await getAllTasksOfBoardId(boardId);
                let employeeTasks = allTasks.filter(task => {
                                                                if(Array.isArray(task.assignedTo))
                                                                {
                                                                    return task.assignedTo.includes(userData.email);
                                                                }
                                                                return task.assignedTo === userData.email;
                                                            });
               // apply search filter only to employees 's tasks
               if(searchTerm.trim() !== "")
                {
                   employeeTasks = employeeTasks.filter(task => task.taskName.toLowerCase().includes(searchTerm.toLowerCase()));
                }                                             

                // show all columns, but only employee's tasks within them
                 const filteredColumns = boardDetails.columns.map((col) => ({ ...col,
                                                                              tasks: employeeTasks.filter((task) => task.columnId === col.columnId)}));

                 setBoard({ ...boardDetails, columns: filteredColumns });
                 taskData = employeeTasks;                                                             
            }
            else
            {
               // Admin - get all tasks (search applied fully)
               taskData = searchTerm.trim() !== "" ? await searchTasksByKeyword(boardId, searchTerm)
                                                   : await getAllTasksOfBoardId(boardId);
               setBoard(boardDetails);
            }
            if(active)
            {
               setTasks(taskData);
               setLoading(false);
            }
        }      
        catch(error)
        {
               enqueueSnackbar(error.response?.data || "Failed to fetch board or tasks!",{ variant: "error", anchorOrigin: { horizontal: "bottom", vertical: "right" }});
        }
         
      }, 700);

      return () => { active = false;
                       clearTimeout(fetchBoardData);
                      };

   },[boardId, searchTerm, filterOption, userData.email]);
   
  
    




   // add new column
   const handleAddColumn = async () => {
     if (isEmployee) 
     {
      enqueueSnackbar("Employees cannot add columns.", { variant: "warning" });
      return;
     }

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
      if (isEmployee) 
      {
        enqueueSnackbar("Employees cannot delete boards.", { variant: "warning" });
        return;
      }
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
      if (isEmployee) 
      {
        enqueueSnackbar("Employees cannot delete boards.", { variant: "warning" });
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



    // handle dragging
    const handleDragEnd = async ({active, over}) => {
        if(!active || !over) return;

        // only employee allowed to drag
        if(!isEmployee)
        {
           enqueueSnackbar("Only employees can move tasks.", {variant: "error"});
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
           enqueueSnackbar("Task moved successfully.", { variant: "success" });
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
              <InlineEditableBoardInfo board = {board} userData = {userData}/>
    
              {/* Helper Tools */}
              <Box sx = {{display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center"}}>

                <SearchBar setSearchTerm = {setSearchTerm} />
                
                <FilterButton boardId = {boardId} setTasks = {setTasks} setFilterOption = {setFilterOption} />

                 {
                   !isEmployee && <SpeedDialLayout actions = {actions} direction = "left"/>
                 }
              

              </Box>
          </Stack>
          
          
          {/* overflowX -- allow horizontally acrolling if column overflow */}
          <div style={{ display: "flex", gap: "40px", overflowX: "auto", padding: "16px 0"}}>
              
             {/* filter tasks by columnid for each column card */}
             {
                (searchTerm.trim() !== "" && tasks.length === 0 )
                                    ? ( <Typography variant = "h4" sx={{textAlign: "center", mt: 2, fontWeight: 900}}>No tasks found !!</Typography> 

                                    )
                                   : (
                                        <DndContext onDragEnd={handleDragEnd}>
                                            <div style = {{display: "flex", gap: "40px", overflowX:"auto", padding: "16px 0"}}>

                                                { board.columns?.map( col => (
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