import { useState } from "react";
import {useForm}from 'react-hook-form';
import{useNavigate}from 'react-router-dom';
import { useSnackbar} from 'notistack';
import axios from 'axios';
import{Dialog, DialogContent, DialogTitle,DialogActions,
       TextField,Button, MenuItem, Select, InputLabel, FormControl,
       Tooltip,CircularProgress,useTheme,Button} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';




function AddTaskForm()
{
  const theme=useTheme();

  const navigate=useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const[formOpen,setFormOpen]=useState(true);// controls visibility of login
  const[loading, setLoading] = useState(false);
  const[employees, setEmployees] = useState([]);
  const[minDate, setMinDate] = useState('');


  // function to disable previous date
  useEffect(() => {
      const today = new Date().toISOString().split("T")[0];
      setMinDate(today);
  },[]);


  //intialize from handling
  const{ register, handleSubmit, formState:{errors}, trigger,reset} = useForm();

  //handle login from submission
  const  loginSubmit=async(useData)=>{
    try 
    {
    
    }
    catch(error)
    {
      
    }
  };



    return(
      <Dialog open={formOpen} onClose={()=>setFormOpen(false)} fullWidth maxWidth='sm'>

        {/*header of the dialog */}
        
        <DialogTitle sx={{display:'flex',justifyContent:'space-between',alignItems:"center"}}>
            <b>Add Task Form</b>
            <CancelIcon
                sx={{cursor:'pointer',color:theme.palette.error.main}}
                onClick={() => {setFormOpen(false);}} 
            />
        </DialogTitle>

          {/*add task form */}

          <form onSubmit={handleSubmit( loginSubmit)}>

            <DialogContent sx={{display:'flex',flexDirection:"column",gap:"20px"}}>

              {/* Title Field */}
              <TextField
              label="Enter Title for task"
              variant="outlined"
              fullWidth
              {...register("title",{ required: {value: true, message: "Title is required"},
                                   })}
              onBlur={()=>trigger('title')}
              error={!!errors.title?.message}
              helperText={errors.title?.message}
              />

              {/* Task description */}
              <TextField
              label="Enter task description"
              variant="outlined"
              fullWidth
              {...register('task description',{required:"Task descrpiton is required"})}
              onBlur={()=>trigger('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              />
             
             
             {/* OTP section*/}
             <OtpSection email = {watch("email")} context = "login"
                         isOtpVerified = {isOtpVerified} setIsOtpVerified = {setIsOtpVerified} />



            </DialogContent>

 
            {/*button-sumbit and reset */}

            <DialogActions sx={{ my: 2 }}>
          <Button type="submit" variant="contained" sx={{ backgroundColor: theme.colors.buttons }} disabled = {!isOtpVerified}>
            Login
          </Button>
          <Button type="reset" variant="contained" onClick={() => reset()} sx={{ backgroundColor: theme.colors.buttons }}>
            Reset
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    )
  }
