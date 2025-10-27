import { useState } from "react";
import {useForm}from 'react-hook-form';
import{useNavigate}from 'react-router-dom';
import { useSnackbar} from 'notistack';
import axios from 'axios';
import{Dialog, DialogContent, DialogTitle, TextField,DialogActions,
        useTheme,Button} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import OtpSection from "../../Components/OtpSection/OtpSection";



function LoginForm({setLoginStatus,setUserData})
{
  const theme=useTheme();

  const navigate=useNavigate();

  const { enqueueSnackbar } = useSnackbar();


  const[formOpen,setFormOpen]=useState(true);// controls visibility of login
  
  //intialize from handling
  const{ register, handleSubmit, formState:{errors}, trigger, watch, reset}=useForm();

  // to disable register button, until OTP is verfied
  const [isOtpVerified, setIsOtpVerified] = useState(false);


  //handle login from submission
  const  loginSubmit=async(useData)=>{
    try
    {
      //call backend login api
      const response=await axios.post("http://localhost:8081/api/v1/user/login",useData);
      
      //destructure token + user 
      const {token,user}=response.data;

      //save token, role, email in localstorage
      localStorage.setItem("token",token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("email", user.email);

      // update app state
      setUserData(user);
      setLoginStatus(true);

      // showing token on console
      console.log("token : ", token);

      //show sucess message
      enqueueSnackbar("login successfully",{
                                               variant:"success",
                                               autoHideDuration:2000, // redirect after 2 sec
                                               anchorOrigin:
                                               {
                                                 vertical:"top",
                                                 horizontal:"right"
                                               },
                                            });
      //close login form and redirect to dashboard based on role
      setFormOpen(false);
      
      if( user.role === "admin") 
         navigate("/admin-dashboard");
      else if( user.role === "employee")
          navigate("/employee-dashboard");
      else
          navigate("/");      // fallback     


    }
    catch(error)
    {
      //show error message
      enqueueSnackbar(
        error.response?.data||"login failed please check credentials",{
                                                                        variant:'error',
                                                                        autoHideDuration:2000,
                                                                        anchorOrigin:
                                                                        {
                                                                          vertical:"top",
                                                                          horizontal:"right"
                                                                        },
                                                                  
                                                                      }
      );
    }
  };



    return(
      <Dialog open={formOpen} onClose={()=>setFormOpen(false)} fullWidth maxWidth='sm'>
        {/*header of the dialog */}
        <DialogTitle sx={{display:'flex',justifyContent:'space-between',alignItems:"center"}}>
            <b>Login form</b>
              {/* closeIcon */}
          <CancelIcon
                sx={{cursor:'pointer',color:theme.palette.error.main}}
                onClick={() => {setFormOpen(false); 
                                    navigate("/");}} 
          />
        </DialogTitle>

          {/*login form */}

          <form onSubmit={handleSubmit( loginSubmit)}>
            <DialogContent sx={{display:'flex',flexDirection:"column",gap:"20px"}}>

              {/* EmailFeild */}
              <TextField
              label="Enter Email"
              variant="outlined"
              fullWidth
              {...register("email",{ required: {value: true, message: "Email Id is required"},
                                          pattern: {value : /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email must be in correct format"},
                                        })}
              onBlur={()=>trigger('email')}
              error={!!errors.email?.message}
              helperText={errors.email?.message}
              />

              {/* passwordFeild */}
              <TextField
              label="Enter password"
              type="password"
              variant="outlined"
              fullWidth
              {...register('password',{
                required:"password is required",
                minLength:{
                  value:8,
                  message:"Password must be at least 8 character"
                }
              })}
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


export default LoginForm;