import {useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import { TextField, Button, Typography, 
         Dialog, DialogActions, DialogContent, DialogTitle,
         useTheme} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from "notistack";
import axios from 'axios';
import OtpSection from '../../Components/OtpSection/OtpSection';

function RegisterForm()
{

    const theme = useTheme();

    const {enqueueSnackbar} = useSnackbar();

    const navigate = useNavigate();

    const [formOpen, setFormOpen] = useState(true);

    const {register,handleSubmit, trigger,watch, control,reset,formState:{errors}} = useForm();

    // to disable register button, until OTP is verfied
    const [isOtpVerified, setIsOtpVerified] = useState(false);


    // function to handle login form submission
    const loginSubmit = async (userData) => {

    try
    {
        const response = await axios.post("http://localhost:8081/api/v1/user/register", userData);

        let userName = response.data.username;

        enqueueSnackbar(`${userName} Registered Successfully !`, {variant: "success"});
        
        setFormOpen(false);    // close form after successfull registration
        navigate("/login");       
                                                     
        
    }
    catch(error)
    {
        enqueueSnackbar(error.response?.data  || "Failed to Register !", {variant: "error"})  ;
    }


  };


  
    return(
    <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">


      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" component="span" sx = {{color: theme.colors.bodyText}}>
              <b> Registration Form </b>
            </Typography>
         <CancelIcon sx={{ cursor: "pointer", color: "red" }} 
                    onClick={() => {setFormOpen(false); 
                                    navigate("/");}} />
      </DialogTitle>

           
      <form onSubmit={handleSubmit(loginSubmit)}>
      
      <DialogContent sx = {{display: "flex", flexDirection: "column",gap: "20px"}}> 

      {/* Username Id field */}

        <TextField id="username" 
                   label="Enter Username " 
                   variant="outlined" 
                   fullWidth
                   {...register("username",{ required: {value: true, message: "Username is required"},
                                             pattern:  {value : /^[A-Za-z][A-Za-z0-9_]*$/, message: "Username must start with letter"},
                                           })}
                  onBlur={()=> trigger("username")}
                  error = {!!errors.username}
                  helperText={errors.username?.message}
        />  
      
      {/* Email Id field */}

        <TextField id="email" 
                   label="Enter Email Id " 
                   variant="outlined" 
                   fullWidth
                   {...register("email",{ required: {value: true, message: "Email Id is required"},
                                          pattern: {value : /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email must be in correct format"},
                                        })}
                  onBlur={()=> trigger("email")}
                  error = {!!errors.email}
                  helperText={errors.email?.message}
        />


        {/*Password field */}
        
        <TextField id="password" 
                   label="Enter Password "
                   type="password" 
                   variant="outlined" 
                   fullWidth
                   {...register("password",{required: {value: true, message: "Password is required"},
                                            minLength: {value: 8, message: "Password must contain at least 8 letter"},
                                            pattern: {value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                                                     message: "Password must contain uppercase, lowercase, digit, and special character"
                                                    },
                                        })}
                   onBlur={()=> trigger("password")}
                   error = {!!errors.password}
                   helperText={errors.password?.message}
        />
         
        {/* role -- hidden field */}
            
        <Controller name= "role"
                    control={control}
                    defaultValue="employee"
                    rules = {{required: "Please Select Role"}}
                    render={({field}) => <input type = "hidden" {...field} />}
        />



        {/* OTP section*/}
        <OtpSection email = {watch("email")} context = "register"
                    isOtpVerified = {isOtpVerified} setIsOtpVerified = {setIsOtpVerified} />
            

      </DialogContent>

      <DialogActions sx = {{my:2}}>
      
      {/* buttons - submit and reset */}

      <Button type = "submit" variant = "contained" sx = {{backgroundColor: theme.colors.buttons}} disabled = {!isOtpVerified}>
        Register
      </Button>
      <Button type = "reset" variant = "contained" onClick = {()=> reset()} sx = {{backgroundColor: theme.colors.buttons}}>
        Reset
      </Button>

      </DialogActions>
          
    </form>
  
  </Dialog>);

}

export default RegisterForm;