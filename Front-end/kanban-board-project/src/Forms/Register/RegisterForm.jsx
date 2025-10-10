

function RegistrationForm()
{

    

    return(

           <h2> Registration form </h2>
          );

}

export default RegistrationForm;

import {useForm} from 'react-hook-form';
import { TextField,Button, } from '@mui/material';

import {useSnackbar} from "notistack";
import axios from 'axios';

function LoginForm({setLoginStatus})
{

    const {enqueueSnackbar} = useSnackbar();

    const {register,handleSubmit, trigger,formState:{errors}} = useForm();


    // function to handle login form submission
    const loginSubmit = async (userData) => {

    try
    {
        const response = await axios.post("http://localhost:3001/api/v1/user/login", userData);

        let userName = response.data.emailID;

        localStorage.setItem("token", response.data.token);     // set the token 

        setLoginStatus(true);

        enqueueSnackbar(`${userName} Login Successfully !`, {
                                                              variant: "success",
                                                              autoHideDuration: 2000,   // 2 sec
                                                              anchorOrigin: {
                                                                            vertical: "top",
                                                                            horizontal: "right",
                                                                           }
                                                            });
        
    }
    catch(error)
    {
        enqueueSnackbar(`${error} !`, {
                                        variant: "error",
                                        autoHideDuration: 2000,   // 2 sec
                                        anchorOrigin: {
                                                      vertical: "top",
                                                      horizontal: "right",
                                                     }
                                      })  ;
    }


  };



    return(<form onSubmit={handleSubmit(loginSubmit)}>

              {/* Email Id field */}

              <TextField id="login_emailId" 
                         label="Enter Email Id " 
                         variant="outlined" 
                         fullWidth
                         {...register("emailId",{ required: {value: true, message: "Email Id is required"},
                                                  pattern: {value : /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                                                            message: "Email must be in correct format"
                                                           },

                                                 })}
                        onBlur={()=> trigger("emailId")}
                        error = {!!errors.emailId}
                        helperText={errors.emailId?.message}
            />


              {/*Password field */}

              <TextField id="login_password" 
                         label="Enter Password "
                         type="password" 
                         variant="outlined" 
                         fullWidth
                         {...register("password",{required: {value: true, message: "Password is required"},
                                                  minLength: {value: 8, message: "Password must contain at least 8 letter"},
                                                  pattern: {value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                                                           message: `Password must contain:
                                                                       - At least 1 lowercase letter
                                                                       - At least 1 uppercase letter
                                                                       - At least 1 digit
                                                                       - At least 1 special character` 
                                                          },

                                                 })}
                        onBlur={()=> trigger("password")}
                        error = {!!errors.password}
                        helperText={errors.password?.message}
            />

            
            {/* role drop down option */}
            {/*
            <Controller name= "role"
                        control={control}
                        defaultValue=""
                        rules = {{required: "Please Select Role"}}
                        render={(field) => (
                                               <FormControl fullWidth error = {!!errors.role}>
                                                         
                                                    <Select>
                                                        <MenuItem value = "">Select Role </MenuItem>
                                                        <MenuItem value = "admin">Admin</MenuItem>
                                                        <MenuItem value = "employee">Employee</MenuItem>
                                                    </Select>
                                                    {errors.role && <FormHelperText>{errors.category.message}</FormHelperText>}
                                               </FormControl>
                                             )}
            />*/}

           
           {/* submit button */}
           <Button type = "submit" variant = "contained">
              Login
           </Button>

          </form>);

}

export default LoginForm;