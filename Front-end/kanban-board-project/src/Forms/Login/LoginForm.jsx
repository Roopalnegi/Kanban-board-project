import { useState } from "react";
import {useForm}from 'react-hook-form';
import{useNavigate}from 'react-router-dom';
import { useSnackbar} from 'notistack';
import axios from 'axios';
import{Dialog, DialogContent, DialogTitle, TextField,DialogActions,
        useTheme,Button, Box,
        Typography,Link} from "@mui/material";
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
  
  //forget password sate
  const [isForgetPassword,setIsForgetPassword] = useState(false);
  
  //for resetting the existing password if user forget password
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");



  // step1 - validate credentials - then sent otp 
  const handleCredentials = async () => {
  
    const email = watch("email");
    const password = watch("password");
  
    if (!email || !password) 
    {
      enqueueSnackbar("Please fill both Email and Password !",{variant: "warning"});
      return;
    }
    try
    {
       const response = await axios.post("http://localhost:8081/api/v1/user/verify-credentials", {email,password});
       enqueueSnackbar(response.data || "Credentials verified ! You can now generate OTP !", {variant: "success"});
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
      
      setTimeout(()=>{
      if( user.role === "admin") 
         navigate("/admin-dashboard");
      else if( user.role === "employee")
          navigate("/employee-dashboard");
      else
          navigate("/");      // fallback   
    },200);  

    }
    catch(error)
    {
      //show error message
      enqueueSnackbar(error.response?.data || "Login failed ! Check OTP .",{variant: "error"});
    }
  };



  //step3 - forget password ----> update password
  const handlePasswordForget = async() => {
    
    const email=watch("email");
    if(newPassword!==confirmPassword)
    {
      enqueueSnackbar("Password do not match",{variant:"warning"});
      return;
    }
    
    try
    {
       const response=await axios.post("http://localhost:8081/api/v1/user/updatePassword",
           {
             email,
             password:newPassword
      });
      enqueueSnackbar(response.data||"Password update successfully !",{variant:"success"});
      
      //reset to normal login form 
      setIsForgetPassword(false);
      setIsOtpVerified(false);
      setCredentialsValid(false);
      setNewPassword("");
      setConfirmPassword("")
    }
    catch(error)
    {
      enqueueSnackbar(error.response?.data|| "Failed to update password !",{ variant:"error"});
    }
  };



  
    return(
      <Dialog open={formOpen} onClose={()=>setFormOpen(false)} fullWidth maxWidth='sm'>
        {/*header of the dialog */}
        <DialogTitle sx={{display:'flex',justifyContent:'space-between',alignItems:"center"}}>
           <Typography variant="h4" component="span" sx = {{color: theme.colors.bodyText}}>
              <b> {isForgetPassword ? "Forget Password" : "Login Form"} </b>
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

              {/* passwordFeild -- show only in login mode*/}
              { !isForgetPassword && ( <TextField
                                        label="Enter password"
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                        {...register('password',{
                                        required: !isForgetPassword ? "password is required" : false,
                                        })}
                                        onBlur={()=>trigger('password')}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        />
              )}  
             

             {/* show OTP section if credentials are valid*/}
             { 
              credentialsValid || isForgetPassword ? (
                                                      <OtpSection email = {watch("email")} 
                                                                  context = {isForgetPassword?"forget":"login"}
                                                                  isOtpVerified = {isOtpVerified} 
                                                                  setIsOtpVerified = {setIsOtpVerified} 
                                                      />
                                                     )
                                                     :(
                                                        !isForgetPassword &&(
                                                                              <Box sx={{  display: "flex",  justifyContent: "space-between", mt: 1,  gap:2}}>
                                                                                  <Button type="button" variant="outlined"
                                                                                    sx={{ backgroundColor: theme.colors.buttons, color: "white", width: "40%",}}
                                                                                    onClick={handleCredentials}>
                                                                                     Validate Credentials
                                                                                  </Button>
                                                                              {/*switching between login to forget password */}
                                                                                <Link component="button"
                                                                                      onClick={()=>{
                                                                                                    setIsForgetPassword(!isForgetPassword);
                                                                                                    setIsOtpVerified(false)
                                                                                                    setCredentialsValid(false);
                                                                                                    setNewPassword("");
                                                                                                    setConfirmPassword("");}}
                                                                                       sx={{color:theme.colors.buttons}}>
                                                                                    { isForgetPassword ? "Back to Login" : "Forget Password" }
                                                                                </Link>
                                                                              </Box>
                                                                            )
                                                       )
            }
            
            {/*if in forget password and otp is verfied ----> show new password*/}
            {
             isForgetPassword && isOtpVerified && (
                                                   <>
                                                   <TextField
                                                     label="New Password"
                                                     type="password"
                                                     fullWidth
                                                     {...register("password",{required: {value: true, message: "Password is required"},
                                                                              minLength: {value: 8, message: "Password must contain at least 8 letter"},
                                                                              pattern: {value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                                                                                        message: "Password must contain uppercase, lowercase, digit, and special character"},
                                                                              })}
                                                     value={newPassword}
                                                     onChange={(e)=>setNewPassword(e.target.value)}
                                                     onBlur={()=>trigger('password')}
                                                     error={!!errors.password}
                                                     helperText={errors.password?.message}
                                                     />
                                                     <TextField
                                                       label="Confirm password"
                                                       type="password"
                                                       fullWidth
                                                       value={confirmPassword}
                                                       onChange={(e)=>setConfirmPassword(e.target.value)}
                                                     />
                                                   </>
             )}
                                      
            </DialogContent>

 
            {/*button-sumbit and reset */}

            <DialogActions sx={{ my: 2 }}>
               {/* submit button behvaiour change based on mode */}
               {
                 isForgetPassword ? (
                                      <Button type="button" variant="contained" onClick = {handlePasswordForget}
                                              sx={{ backgroundColor: theme.colors.buttons }} disabled = {!isOtpVerified}>
                                          Update Password
                                      </Button>
                                     )
                                     :(
                                        <Button type="submit" variant="contained" sx={{ backgroundColor: theme.colors.buttons }} disabled = {!isOtpVerified}>
                                          Login
                                        </Button>
                                      )
               }
               <Button type="reset" variant="contained" onClick={() => reset()} sx={{ backgroundColor: theme.colors.buttons }}>
                 Reset
               </Button>
        </DialogActions>
        </form>
      </Dialog>
    );

    
    
  }

export default LoginForm;