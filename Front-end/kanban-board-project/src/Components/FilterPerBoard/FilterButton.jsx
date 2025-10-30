import { useState } from 'react';
import { Button } from '@mui/material';
import FilterDialogBox from "./FilterDialogBox";

function FilterButton({setTasks, boardId, setFilterOption, userData})
{

    const [open, setOpen] = useState(false);             // control opening and closing of filter dialog box


    // functions to handle open and close
    const handleOpen = () => setOpen(true);
    

    return (
             <>
              <Button onClick = {handleOpen} 
                      sx = {{boarderRadius: "6px", px:3, ml: 2, backgroundColor:" #05aafc18"}}
                      endIcon = {<img src = "../Icons/filter-icon.png" alt = "Filter Icon" width = "25" height = "25"/>}
              >
                Filter
              </Button>
              <FilterDialogBox  setTasks = {setTasks} 
                                boardId = {boardId}
                                setFilterOption = {setFilterOption}
                                filterOpen = {open}
                                setFilterOpen = {setOpen} 
                                userData = {userData} /> 
             </>
            );
}

export default FilterButton;