import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, IconButton,
         FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
         TextField, Grid, Stack, MenuItem, Button, Typography, useTheme } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import { enqueueSnackbar } from "notistack";
import { filterTaskByPriority, filterTaskByCreatedAt, filterTaskByDueDate, filterTaskByCreatedMonth, filterTaskByDueMonth, getAllTasksOfBoardId } from "../../Services/TaskServices";

function FilterDialogBox({ setTasks, boardId, setFilterOption, filterOpen, setFilterOpen, userData}) 
{
  
    const navigate = useNavigate();      
    const theme = useTheme();

    const { control, handleSubmit, reset } = useForm({
     defaultValues: {
      priority: "",
      createdAt: "",
      dueDate: "",
      createdMonth: "",
      createdYear: "",
      dueMonth: "",
      dueYear: "",
    },
  });



  const onSubmit = async (data) => {
    
    setFilterOption(true);

    try 
    {
         let filteredData;
   
         if (data.priority) 
         {
           filteredData = await filterTaskByPriority(boardId, data.priority);
         } 
         else if (data.createdAt) 
         {
           filteredData = await filterTaskByCreatedAt(boardId, data.createdAt);
         } 
         else if (data.dueDate) 
         {
           filteredData = await filterTaskByDueDate(boardId, data.dueDate);
         } 
         else if (data.createdMonth && data.createdYear) 
         {
           filteredData = await filterTaskByCreatedMonth(boardId, data.createdMonth, data.createdYear);
         } 
         else if (data.dueMonth && data.dueYear) 
         {
           filteredData = await filterTaskByDueMonth(boardId, data.dueMonth, data.dueYear);
         } 
         else 
         {
           enqueueSnackbar("Select a valid filter option !", { variant: "error"});
           return;
         }
      
      // Restrict employee results
    if (userData.role.toLowerCase() === "employee") 
    {
      filteredData = filteredData.filter(task => 
      {
        if (Array.isArray(task.assignedTo)) {
          return task.assignedTo.includes(userData.email);
        }
        return task.assignedTo === userData.email;
      });
    }   

      setTasks(filteredData);
      enqueueSnackbar("Filter Applied !", { variant: "success"});
      setFilterOpen(false); // close the dialog 
      reset();   // clear fields
    } 
    catch (error) 
    {
      enqueueSnackbar("Failed to apply filter !", { variant: "error"});
      setFilterOpen(false);  // close the dialog
    }
  };



  const handleClose = () => {
    reset();
    setFilterOpen(false);
    setFilterOption(false);
    navigate(`/board/${boardId}`);
  };


  const handleResetFilters = async () => {
     try 
     {
       const allTasks = await getAllTasksOfBoardId(boardId);

       // restrict for employee
       if(userData.role.toLowerCase() === "employee")
       {
         allTasks = allTasks.filter(task => { if(Array.isArray(task.assignedTo))
                                               {
                                                 return task.assignedTo.includes(userData.email);
                                               }
                                               return task.assignedTo === userData.email;

                                            });
       }
       setTasks(allTasks);
       setFilterOption(false);
     } 
      catch (error) 
     {
       console.log("Failed to reset filter : ", error);
     }
};




  return (
   
   <Dialog open={filterOpen} maxWidth="sm" fullWidth>

      <form onSubmit={handleSubmit(onSubmit)}>

         {/*header of the dialog */}
         <DialogTitle sx={{display:'flex',justifyContent:'space-between',alignItems:"center"}}>
            <Typography variant="h5" sx = {{color: theme.colors.bodyText}}>
               <b> Filter Tasks </b>
            </Typography>
            
            {/* closeIcon */}
           <CancelIcon
                 sx={{cursor:'pointer',color:theme.palette.error.main}}
                 onClick={handleClose} />
         </DialogTitle>

        <DialogContent dividers>
    
          {/* Priority */}
          <Controller
            name = "priority"
            control = {control}
            render = {({ field }) => (
              <FormControl component = "fieldset" fullWidth margin="normal">
                <RadioGroup row {...field} sx = {{display: "flex", alignItems: "center", gap: 1, mb:2}}>
                  <FormLabel sx = {{color: "black", fontSize: "18px"}}> <b>Priority : </b></FormLabel>
                  <FormControlLabel value="high" control={<Radio size="small"/>} label="High"  />
                  <FormControlLabel value="medium" control={<Radio size="small"/>} label="Medium" />
                  <FormControlLabel value="low" control={<Radio size="small" />} label="Low" />
                </RadioGroup>
              </FormControl>
            )}
          />

          {/* Created At / Due Date - exact date */}
        
           <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Created At */}
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" sx = {{color: "black", fontSize: "16px"}}><b>Created At:</b></Typography>
                <Tooltip title="Show tasks created on this exact day." arrow placement="bottom">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                <Controller
                  name="createdAt"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Stack>
            </Grid>

            {/* Due Date */}
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2"sx = {{color: "black", fontSize: "18px"}}><b>Due Date:</b></Typography>
                <Tooltip title="Show tasks that need to be completed on this day." arrow placement="bottom">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Stack>
            </Grid>
          </Grid>


          {/* Created At - month & year */}
          <Grid container spacing={2} sx={{ mt: 2 }}>

            <Grid item xs={6}>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" sx={{ color: "black", fontSize: "18px", minWidth: "100px" }}>
                    <b>Created At:</b>
                  </Typography>
              
                  {/* Month Select */}
                  <Controller
                    name="createdMonth"
                    control={control}
                    render={({ field }) => (
                      <TextField select size="small" label="Month" {...field} sx={{ width: 120 }}>
                        <MenuItem value="">None</MenuItem>
                        {Array.from({ length: 12 }, (_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString("default", { month: "long" })}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
              
              
                  {/* Year Input */}
                  <Controller
                    name="createdYear"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Year"
                        type="number"
                        size="small"
                        {...field}
                        sx={{ width: 100 }}
                      />
                    )}
                  />
                  <Tooltip title="Show all tasks created in this month and year." arrow placement="bottom">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
            </Grid>
          </Grid>

           {/* Due Date  - month & year */}
          <Grid container spacing={2} sx={{ mt: 2 }}>

            <Grid item xs={6}>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" sx={{ color: "black", fontSize: "18px", minWidth: "100px" }}>
                    <b>Due Date:</b>
                  </Typography>
              
                  {/* Month Select */}
                  <Controller
                    name="dueMonth"
                    control={control}
                    render={({ field }) => (
                      <TextField select size="small" label="Due Month" {...field} sx={{ width: 120 }}>
                        <MenuItem value="">None</MenuItem>
                        {Array.from({ length: 12 }, (_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString("default", { month: "long" })}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
              
              
                  {/* Year Input */}
                  <Controller
                    name="dueYear"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Due Year"
                        type="number"
                        size="small"
                        {...field}
                        sx={{ width: 100 }}
                      />
                    )}
                  />
                  <Tooltip title="Show all tasks due in this month and year." arrow placement="bottom">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
          </Grid>
        </Grid>  

        </DialogContent>

        <DialogActions>
          <Button type="button" variant="contained" sx={{backgroundColor: theme.colors.buttons, borderRadius: "20px"}} onClick={handleResetFilters}>
            Reset
          </Button>
          <Button type="submit" variant="contained" sx={{backgroundColor: theme.colors.buttons, borderRadius: "20px"}}>
            Apply
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );



}

export default FilterDialogBox;