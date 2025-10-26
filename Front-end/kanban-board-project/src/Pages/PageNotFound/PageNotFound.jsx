import { Typography, Box } from "@mui/material";

function PageNotFound()
{
     return (
       <Box sx = {{display: "flex", flexDirection: "column", gap: 2, justifyContent: "center", alignItems : "center"}}>

          {/* 1st column */}
          <div>
            <img src = "../Images/error-page.png" alt = "404 Error"/>
          </div>

          {/* 2nd column */}
          <Box sx = {{display: "flex", flexDirection: "column", gap: 3, justifyContent: "center", alignItems: "center"}}>
            <Typography variant = "h1"> 404 </Typography>
            <Typography variant = "h5" component="p">
                  We're sorry, the page you requested could not be found.
            </Typography>
             <Typography variant = "h5" component="p">
                  Please go back to HomePage.
            </Typography>
          </Box>

       </Box>
     );
}

export default PageNotFound;