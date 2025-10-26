import { Box, Button, Typography } from '@mui/material';
import { useErrorBoundary } from "react-error-boundary";

export default function ErrorFallback ({error})
{
    const {resetBoundary} = useErrorBoundary();
    console.log(error);

    return (<div role = "alert">
               <Box sx = {{display: "flex", flexDirection: "column", gap:2, m:4, p:4, boxShadow: 3}}>
                  <Typography variant='h5'><b>Something went wrong. Try after sometime.</b></Typography> 
                  <pre style = {{color: "red"}}>
                    {error.message}
                  </pre>
                  <Button onClick = {resetBoundary} sx = {{p:2, m:2}}>
                     Try Again 
                  </Button>
               </Box>
             </div> 
           );
}