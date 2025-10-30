import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Box, IconButton, CircularProgress, Paper, 
         List, ListItem, ListItemButton, ListItemText,
         Tooltip, Typography, Grow } from "@mui/material";
import { Icon, aisuggestIcon } from "../IconComponent/Icon";

/*
 responsibility -- fetch suggestions from the backend and shows them in drop down list
                -- such that when user clicks on suggestion, it getspassed back to the parent text field
*/                

const AISuggestionButton = ({ value, onSelect }) => {

  const [loading, setLoading] = useState(false);   // show loading spinner when fetching ai suggestions
  const [suggestions, setSuggestions] = useState([]);   // store ai - generated suggestions 
  const [showDropdown, setShowDropdown] = useState(false);   //control dropdown visibility
  const dropdownRef = useRef(null);  // reference to detect clicks outside the dropdown

 // listen / detect event -- "mouse clicking" outside the dropdown make dropdown close
  useEffect(() => {

    const handleClickOutside = (event) => {
    
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);      // close dropdown when clicked outside
      }
    };

    // attach listener on mount
    document.addEventListener("mousedown", handleClickOutside); 
    // clean up on unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);


  // calling backend api
  const fetchSuggestions = async () => {
    
    // if input is empty or too short
    if (!value || value.trim().length < 2) 
      return;

    try 
    {
      setLoading(true);      // show spinner
    
      // sending request with text as plain text body
      const res = await axios.post("http://localhost:8085/api/v1/suggestion/generate",value,
                                   { headers: { "Content-Type": "text/plain" } });

      // if backend return as array                             
      if (Array.isArray(res.data)) 
      {
        setSuggestions(res.data);
        setShowDropdown(true);
      }
    } 
    catch (error) 
    {
      console.error("AI Suggestion Error:", error);
    } 
    finally 
    {
      setLoading(false);
    }
  };


  return (
    <Box sx={{ position: "relative" }} ref={dropdownRef}>

      <Tooltip title="Get AI suggestions">
        <IconButton onClick={fetchSuggestions} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={22} /> : <Icon src={aisuggestIcon} alt = "AI suggests Icon" />}
        </IconButton>
      </Tooltip>

      {/* Grow animation for smooth dropdown open / close */}
      <Grow in={showDropdown}>
        <Box>

          {
           showDropdown && suggestions.length > 0 && (
               <Paper
                 sx={{
                   position: "absolute",
                   top: "40px",
                   right: 0,
                   width: 280,
                   maxHeight: 200,
                   overflowY: "auto",
                   p: 1,
                   zIndex: 1300,
                   boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                   borderRadius: 2,
                 }}
               >
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                    ✨ AI Suggests:
                  </Typography>
                  <List>
                    {
                     suggestions.map((s, i) => (
                      <ListItem key={i} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            onSelect(s);
                            setShowDropdown(false);
                          }}
                        >
                          <ListItemText primary={s} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )
          }
        </Box>
      </Grow>
    </Box>
  );
};

export default AISuggestionButton;
