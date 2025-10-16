import React from "react";
import { useState,useEffect } from "react";

import { Box } from "@mui/material";
import CreateBoard from "./CreateBoard";

function BoardView(){
    return(
        <Box display="flex"justifyContent="center"alignItems="center"height="60vh">
            <CreateBoard/>
        </Box>
    )
     
}
export default BoardView();