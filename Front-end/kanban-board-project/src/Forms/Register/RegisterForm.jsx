import {useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import { TextField, Button, 
         Dialog, DialogActions, DialogContent, DialogTitle,
         FormControl, Select, MenuItem, FormHelperText, 
         useTheme} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from "notistack";
import axios from 'axios';

function RegisterForm()
{

    const theme = useTheme();

    const {enqueueSnackbar} = useSnackbar();

    const navigate = useNavigate();

    const [formOpen, setFormOpen] = useState(true);

    const {register,handleSubmit, trigger,control,reset,formState:{errors}} = useForm();


    // function to handle login form submission
    const loginSubmit = async (userData) => {

    try
    {
        const response = await axios.post("http://localhost:8081/api/v1/user/register", userData);

        let userName = response.data.username;

        enqueueSnackbar(`${userName} Registered Successfully !`, {
                                                              variant: "success",
                                                              autoHideDuration: 2000,   // 2 sec
                                                              anchorOrigin: {
                                                                            vertical: "top",
                                                                            horizontal: "right",
                                                                           }
                                                            });
        
        setFormOpen(false);    // close form after successfull registration
        navigate("/login");       
                                                     
        
    }
    catch(error)
    {
        enqueueSnackbar(error.response?.data?.message || "Failed to Register !", {
                                                                                  variant: "error",
                                                                                  autoHideDuration: 2000,   // 2 sec
                                                                                  anchorOrigin: {
                                                                                                vertical: "top",
                                                                                                horizontal: "right",
                                                                                               }
                                                                                })  ;
    }


  };



    return(
    <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">


      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <b>Registration Form</b>
         <CancelIcon sx={{ cursor: "pointer", color: theme.palette.error.main }} 
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
         
        {/* role drop down option */}
            
        <Controller name= "role"
                    control={control}
                    defaultValue=""
                    rules = {{required: "Please Select Role"}}
                    render={({field}) => (
                                            <FormControl fullWidth error = {!!errors.role}>
                                                      
                                                 <Select {...field} displayEmpty>
                                                     <MenuItem value = "">Select Role </MenuItem>
                                                     <MenuItem value = "admin">Admin</MenuItem>
                                                     <MenuItem value = "employee">Employee</MenuItem>
                                                 </Select>
                                                 {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
                                            </FormControl>
                                        )}
      />
            

      </DialogContent>

      <DialogActions sx = {{my:2}}>
      
      {/* buttons - submit and reset */}

      <Button type = "submit" variant = "contained" sx = {{backgroundColor: theme.colors.buttons}}>
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