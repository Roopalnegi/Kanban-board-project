import { useState, useRef } from "react";
import { Button, Popover,
         Menu, MenuItem, FormControl, InputLabel, Select,
         TextField, Box, useTheme } from "@mui/material";



function NotificationFilter({ onFilter }) 
{

  const theme = useTheme();

  const dialogRef = useRef(null);                               // reference to parent container (dialog)

  const [anchorEl, setAnchorEl] = useState(null);                // position popover relative to another element
  const [openMonth, setOpenMonth] = useState(false);             // control the opening and closing of popover month
  const [openDate, setOpenDate] = useState(false);               // control the opening and closing of popover date


  // store selected month and date value
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");

  // calulate current year since filter by month and current year
  const currentYear = new Date().getFullYear();


  // functions to handle filter menu open/close
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);


  // functions to handle menu actions, (when you click on filter options on menu)
  const handleUnreadClick = () => {
    onFilter({ type: "unread" });
    handleCloseMenu();
  };


  const handleMonthClick = () => {
    setOpenMonth(true);
    handleCloseMenu();
  };


  const handleDateClick = () => {
    setOpenDate(true);
    handleCloseMenu();
  };

  
  
  // function when you applied filter 
  const applyMonthFilter = () => {
    if (month) {
      onFilter({ type: "month-year", month, year: currentYear });
      setOpenMonth(false);
    }
  };


  const applyDateFilter = () => {
    if (date) {
      onFilter({ type: "date", date });
      setOpenDate(false);
    }
  };


  return (

    <Box display="flex" justifyContent="flex-end" mb={2} ref={dialogRef}>
    
      {/* Filter Button */}
      <Button variant="contained" onClick={handleOpenMenu} sx={{ backgroundColor: theme.colors.buttons, mt:1 }}>
        Filter
      </Button>


      {/* Filter Options on Menu*/}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleUnreadClick}>Unread Messages</MenuItem>
        <MenuItem onClick={handleDateClick}>Filter By Date</MenuItem>
        <MenuItem onClick={handleMonthClick}>Filter by Month</MenuItem>
      </Menu>


      {/* Month Popover */}
      <Popover
        open={openMonth}
        onClose={() => setOpenMonth(false)}
        anchorEl={dialogRef.current}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}         
        transformOrigin={{ vertical: "center", horizontal: "center" }}
        PaperProps={{ sx: { p: 1 } }} 
      >
        <Box display="flex" alignItems="center" gap={1}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={month}
              label="Month"
              onChange={(e) => setMonth(e.target.value)}
            >
              {[
                "Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"
              ].map((m, i) => (
                <MenuItem key={i} value={i + 1}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={applyMonthFilter} sx={{ backgroundColor: theme.colors.buttons }}>
            Apply
          </Button>
        </Box>
      </Popover>


      {/* Date Popover */}
      <Popover
        open={openDate}
        onClose={() => setOpenDate(false)}
        anchorEl={dialogRef.current}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        transformOrigin={{ vertical: "center", horizontal: "center" }}
        PaperProps={{ sx: { p: 1 } }}         
      >
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={applyDateFilter} sx={{ backgroundColor: theme.colors.buttons }}>
            Apply
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}

export default NotificationFilter;


/*
Popover - used to display some content on top of another
        - has 4 props

1. anchorEl --  tells the popover which DOM element it should “attach” to. 
                If you use this, the popover will position itself relative to that element.
2. anchorReference -- tell popover what should it use to position itself
3. anchorOrigin -- defines which point of the anchor Popover should align to.
                -- has vertical and horizontal values: "top" | "center" | "bottom" / "left" | "center" | "right".     
4. transformOrigin -- defines which point of the Popover itself should align to the anchor.
5. PaperProps - control spacing / size in popover
                    

------- anchorOrigin point on the button 
        transformOrigin point on popover

*/


/*

normally, in react, react control the virtual dom... so we dont intercat with real dom directly... but sometime we need to.. so use ref there
ref --  is a way to get direct access to a DOM element or a React component instance.
    -- help you to Focus an input (inputRef.current.focus())
                   Measure element size/position (ref.current.getBoundingClientRect())
                   Attach popovers, tooltips, or modals relative to an element

You create a ref with: const dialogRef = useRef(null);
Initially, dialogRef.current is null. Then you attach it to a JSX element:
<Box ref={dialogRef}>...</Box>
  ......Now, dialogRef.current points to the actual DOM node of that Box.
             and then pass it to anchorEl so Popover knows where to position itself

*/
