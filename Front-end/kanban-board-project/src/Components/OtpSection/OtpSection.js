import { TextField, Button, Box, useTheme } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

function OtpSection({ email, context, isOtpVerified, setIsOtpVerified }) 
{
 
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

   
    // state to control OTP flow
   const [otpSent, setOtpSent] = useState(false);
   const [otp, setOtp] = useState('');


   // automatically mark OTP as sent in login context (since backend already sends it)
  useEffect(() => {
    if (context === "login") 
    {
      setOtpSent(true);
    }
  }, [context]);


   // function to send OTP
  const sendOTP = async (email, context) => {
    if(!email)
    {
      enqueueSnackbar("Please enter email first !", {variant: "error"});
      return;
    }

    try 
    {
      const response = await axios.post(`http://localhost:8081/api/v1/user/send-otp?email=${email}&context=${context}`);

      enqueueSnackbar(response.data || "OTP sent successfully ! ", {variant: "success"});
     setOtpSent(true);       // allow user to enter OTP
     setOtp('');             // clear input field
    } 
    catch (error) 
    {
      enqueueSnackbar(error.response?.data || "Failed to send OTP !", {variant: "error"});
      setOtpSent(false);      // allow user to retry
      setIsOtpVerified(false);                                                               
    }
  };



  // function to verify OTP
  const verifyOTP = async (email, otp) => {
     if (!otp) 
     {
      enqueueSnackbar("Please enter OTP first!", { variant: "warning" });
      return;
     }
    try 
    {
      const response = await axios.post(`http://localhost:8081/api/v1/user/verify-otp?email=${email}&otp=${otp}`);
      
      enqueueSnackbar(response.data || "OTP verified successfully !",{variant: "success"});
      setIsOtpVerified(true);                                                               
    } 
    catch (error) 
    {
      enqueueSnackbar(error.response?.data || "Invalid OTP !", {variant: "error"});
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
          <VerifiedIcon sx = {{color: 'green', fontSize: 30}} />
       )      
    }
    </Box>
   );


}

export default OtpSection;
