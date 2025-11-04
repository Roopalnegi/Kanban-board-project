import { useState } from "react";
import {useForm}from 'react-hook-form';
import{useNavigate}from 'react-router-dom';
import { useSnackbar} from 'notistack';
import axios from 'axios';
import{Dialog, DialogContent, DialogTitle, TextField,DialogActions,
        useTheme,Button, Box,
        Typography} from "@mui/material";
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

  const [credentialsValid, setCredentialsValid] = useState(false);


  // step1 - validate credentials - then sent otp 
  const handleCredentials = async () => {

    const email = watch("email");
    const password = watch("password");

    if (!email || !password) 
    {
      enqueueSnackbar("Please fill both Email and Password!", { variant: "warning" });
      return;
    }

    try
    {
       const response = await axios.post("http://localhost:8081/api/v1/user/verify-credentials", {email,password});
       enqueueSnackbar(response.data || "Credentials verified ! You can now generate OTP.!", {variant: "success"});
       setCredentialsValid(true);
    }
    catch(error)
    {
      enqueueSnackbar(error.response?.data || "Invalid Credentails !", {variant: "error"});
    }
  };


  // step2 - login after otp verified 
  const  loginSubmit = async(userData)=>{
    try
    {
      const response=await axios.post(`http://localhost:8081/api/v1/user/login`,userData);
      
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
      enqueueSnackbar("Login successfully !",{variant: "success"});
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
      enqueueSnackbar(error.response?.data||"Login failed ! Check OTP .",{variant: "error"});
    }
  };



    return(
      <Dialog open={formOpen} onClose={()=>setFormOpen(false)} fullWidth maxWidth='sm'>
        {/*header of the dialog */}
        <DialogTitle sx={{display:'flex',justifyContent:'space-between',alignItems:"center"}}>
           <Typography variant="h4" component="span" sx = {{color: theme.colors.bodyText}}>
              <b> Login Form </b>
           </Typography>
           
              {/* closeIcon */}
          <CancelIcon
                sx={{cursor:'pointer',color:"red"}}
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
              })}
              onBlur={()=>trigger('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              />
             

             {/* show OTP section if credentials are valid*/}
             { credentialsValid ? (
                                     <OtpSection email = {watch("email")} context = "login"
                                                 isOtpVerified = {isOtpVerified} setIsOtpVerified = {setIsOtpVerified} />
                                   )
                                   :(
                                     <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                                            <Button type="button" variant="outlined"
                                              sx={{ backgroundColor: theme.colors.buttons, color: "white", width: "40%",}}
                                              onClick={handleCredentials}
                                            >
                                           Validate Credentials
                                          </Button>
                                      </Box>
                                   )
             }
             



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