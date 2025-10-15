import { TextField, Button, Box, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

function OtpSection({ email, context, isOtpVerified, setIsOtpVerified }) 
{
 
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

   
    // state to control OTP flow
   const [otpSent, setOtpSent] = useState(false);
   const [otp, setOtp] = useState('');


   // function to send OTP
  const sendOTP = async (email, context) => {
    try 
    {
      const response = await axios.post(`http://localhost:8081/api/v1/user/send-otp?email=${email}&context=${context}`);

      enqueueSnackbar(response.data || "OTP sent successfully!", {
                                                                  variant: 'success',
                                                                  autoHideDuration: 2000,
                                                                  anchorOrigin: { vertical: 'top', horizontal: 'right' }
                                                                 });
     setOtpSent(true);       // allow user to enter OTP
     setOtp('');             // clear input field
    } 
    catch (error) 
    {
      enqueueSnackbar(error.response?.data || "Failed to send OTP!", {
                                                                      variant: 'error',
                                                                      autoHideDuration: 2000,
                                                                      anchorOrigin: { vertical: 'top', horizontal: 'right' }
                                                                     });
      setOtpSent(false);      // allow user to retry
      setIsOtpVerified(false);                                                               
    }
  };



  // function to verify OTP
  const verifyOTP = async (email, otp) => {
    try 
    {
      const response = await axios.post(`http://localhost:8081/api/v1/user/verify-otp?email=${email}&otp=${otp}`);
      
      enqueueSnackbar(response.data || "OTP verified successfully!", {
                                                                      variant: 'success',
                                                                      autoHideDuration: 2000,
                                                                      anchorOrigin: { vertical: 'top', horizontal: 'right' }
                                                                     });
      setIsOtpVerified(true);                                                               
    } 
    catch (error) 
    {
      enqueueSnackbar(error.response?.data || "Invalid OTP!", {
                                                              variant: 'error',
                                                              autoHideDuration: 2000,
                                                              anchorOrigin: { vertical: 'top', horizontal: 'right' }
                                                              });
      // Reset OTP state to allow generating a new OTP
      setOtpSent(false);  // show "Generate OTP" button again
      setOtp('');         // clear the input field
      setIsOtpVerified(false); // mark as not verified                                                        
    }

  };

  
  return (
          <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      
            <TextField id="otp"
                       label="Enter OTP"
                       type="text"
                       variant="outlined"
                       value={otp}
                       onChange={(e) => setOtp(e.target.value)}
            />

      {
       !isOtpVerified ?

       ( !otpSent ? (<Button  type="button"  variant="contained" 
                            sx={{ backgroundColor: theme.colors.buttons }}  
                            onClick={() => sendOTP(email,context)}> Generate OTP </Button>
                ) 
                :(
                  <Button type="button" variant="contained"
                          sx={{ backgroundColor: theme.colors.buttons}}
                          onClick={() => verifyOTP(email, otp)}> Verify OTP </Button>
                )
       ):
       (
          <CheckCircleIcon sx = {{color: 'green', fontSize: 30}} />
       )      
    }
    </Box>
   );


}

export default OtpSection;
