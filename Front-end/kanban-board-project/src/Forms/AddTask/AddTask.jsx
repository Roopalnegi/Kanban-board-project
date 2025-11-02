import { useState, useEffect } from "react";
import {useForm}from 'react-hook-form';
import { useSnackbar} from 'notistack';
import{Dialog, DialogContent, DialogTitle,DialogActions,
       MenuItem, Select, InputLabel, FormControl,
       RadioGroup, FormControlLabel, Radio, FormLabel,
       ListItemText, Checkbox, useTheme,TextField,Button, Box } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { addTask, getEmployeeDetails, updateTask } from "../../Services/TaskServices";
import formatEmployeeData from "../../Services/Utils/employeeUtil";
import AISuggestionButton from "../../Components/AISuggestionInput/AISuggestionInput";



function AddTaskForm({boardId, columnId, task, onTaskAdded, onTaskUpdated, open, onClose})
{

  // the "task" prop created to handle both create task and edit task modes
  const theme=useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const [employees, setEmployees] = useState([]);  // store all employee user details
  const [priority, setPriority] = useState("low"); 
  const [minDate, setMinDate] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  
  //intialize from handling
  const{ register, handleSubmit, formState:{errors}, trigger,reset, watch} = useForm();

  // track task_description length and near-limit warning after 45 characters
  const descLength = watch("task_description")?.length || 0;
  const isNearLimit = descLength > 45;                     

  // function to disable previous date
  useEffect(() => {
      const today = new Date().toISOString().split("T")[0];
      setMinDate(today);
  },[]);


  // fetch employee data
  useEffect(() => {
    const fetchEmployees = async () => {
       try
       {
         const data = await getEmployeeDetails(); // return objects --- {101: "John Doe - john@example.com"}
         const empArray = formatEmployeeData(data);     // convert object into array
         setEmployees(empArray);
       }
       catch(error)
       {
         enqueueSnackbar("Failed to fetch employee data !", {variant: "error"});
       }
    }
    fetchEmployees();   
  },[enqueueSnackbar]);


  
  // ------- determining task mode -------------
  // if task exist ---> edit mode on   ---------> else create mode on 
  useEffect(() => {
     
      if(task)      // edit mode on as task already present, populate the form with existing task data (data prefilled when editing)
      {
          reset({
                  title: task.title,
                  task_description: task.task_description,
                  dueDate: task.dueDate,
                });
          setPriority(task.priority || "low");
          setSelectedEmployees(task.assignedTo || []);      
      }
      else       // create mode on as task does not exist at all -- set some default values
      {
          reset();
          setPriority("low");
          setSelectedEmployees([]);
      }

  },[task,reset]);




  //handle login from submission
  const submit = async(formData)=>{
    try 
    {
        const taskData = {...formData, columnId, boardId, priority, assignedTo: selectedEmployees };
        
        if(task)      // edit mode
        {
           const updatedTask = await updateTask(task.taskId,taskData);
           // notify parent board state to when task is updated (app lift up state)
           if(onTaskUpdated) 
              onTaskUpdated (updatedTask);
           enqueueSnackbar("Task updated successfully !", {variant: "success"});
        }
        else
        {
          const savedTask = await addTask(taskData);
          // notify parent to update board (app lift up state)
          if(onTaskAdded) 
             onTaskAdded(savedTask);
           enqueueSnackbar("Task created successfully !", {variant: "success"});
        }
        handleClose();
    }
    catch(error)
    {
      enqueueSnackbar(error.response?.data || error.response?.data?.message || "Failed to create / update task !", {variant: "error"});
    }
  };


  // handle proper closing of form
  const handleClose = () => {
    reset();
    onClose && onClose();
  };



    return(
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>

        {/*header of the dialog */}
        
        <DialogTitle sx={{display:'flex',justifyContent:'space-between',alignItems:"center"}}>
            <b> {task ? "Update Task Form" : "Create Task Form"}  </b>
            <CancelIcon
                sx={{cursor:'pointer',color:"red"}}
                onClick={() => handleClose()} 
            />
        </DialogTitle>

        <form onSubmit={handleSubmit(submit)}>

            <DialogContent sx={{display:'flex',flexDirection:"column",gap:"20px"}}>

               {/* Title TextFeild with ai Suggestion */}
               <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      label="Task Title"
                      variant="outlined"
                      fullWidth
                      {...register("title", { required: "Title is required",
                                              pattern: { value: /^[A-Za-z].*$/, message: "Title must start with a letter" },
                      })}
                      onBlur={() => trigger("title")}
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                    <AISuggestionButton value={watch("title")} 
                                        onSelect={(s) => {   reset({ ...watch(), title: s }); }}/>
              </Box>
         

              {/* Description TextField with ai suggestion */}
             <Box display="flex" alignItems="center" gap={1}>
                  <TextField
                   label="Task Description"
                   variant="outlined"
                   multiline
                   rows={3}
                   fullWidth
                   {...register("task_description", { required: "Task description is required",
                                                      maxLength: { value: 50, message: "Description cannot exceed 50 characters" },
                   })}
                   onBlur={() => trigger("task_description")}
                   error={!!errors.task_description}
                   helperText={ errors.task_description?.message || (
                                                                      <span style={{ color: isNearLimit ? "red" : "gray" }}>
                                                                        Total Characters : {descLength} / 50
                                                                      </span>
                                                                    )
                   }
                  />
                 <AISuggestionButton value={watch("task_description")}
                                     onSelect={(s) => reset({ ...watch(), task_description: s })}
                 />
              </Box>


              {/* Priority */}
              <FormControl fullWidth>
                <FormLabel>Priority</FormLabel>
                   <RadioGroup row value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <FormControlLabel value="low" control={<Radio />} label="Low" />
                        <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                        <FormControlLabel value="high" control={<Radio />} label="High" />
                   </RadioGroup>
              </FormControl>


              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select multiple
                        value={selectedEmployees}
                        onChange={(e) => setSelectedEmployees(e.target.value)}
                        renderValue={(selected) => selected.map(email => {
                                                                          const emp = employees.find(emp => emp.email === email);
                                                                          return emp ? emp.name : email;
                                                                         }).join(", ")
                                    }
                >
                {
                  employees.map((emp) => (
                                           <MenuItem key={emp.id} value={emp.email}>
                                             <Checkbox checked={selectedEmployees.includes(emp.email)} />
                                             <ListItemText primary={emp.name} secondary={emp.email} />
                                           </MenuItem>
                                          ))
                }
                </Select>
              </FormControl>


              {/* Due Date */}
              <TextField
                type="date"
                label="Due Date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minDate }}
                {...register("dueDate", { required: "Due date is required" })}
                onBlur={() => trigger("dueDate")}
                error={!!errors.dueDate}
                helperText={errors.dueDate?.message}
              />
    

        </DialogContent>

 
        {/*button-sumbit and reset */}

        <DialogActions sx={{ my: 2 }}>
          <Button type="submit" variant="contained" sx={{ backgroundColor: theme.colors.buttons }}>
            { task ? "Update Task" : "Create Task" }
          </Button>
          <Button type="reset" variant="contained" onClick={() => reset()} sx={{ backgroundColor: theme.colors.buttons }}>
            Reset
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    );
  }

  export default AddTaskForm;
