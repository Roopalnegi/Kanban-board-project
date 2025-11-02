import { Typography, TextField, Box } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { Icon, pencilImg } from "../IconComponent/Icon";
import AISuggestionButton from "../AISuggestionInput/AISuggestionInput";

/*
 editable inline when user click on edit icon saves changes to backend automatically on blur or pressing enter
*/

// If forceEditMode is true, start in edit mode

function InlineEditableField({ label, value, onSave, multiline = false, forceEditMode = false, readOnly,}) 
{
  
  // track which field is edited  
  const [editMode, setEditMode] = useState(forceEditMode);
  const [tempValue, setTempValue] = useState(value);

  // for auto - focusing (gain focus) when a field enters edit mode
  const inputRef = useRef(null);

  // new wrapper reference - so that when click on edit , ai suggestion can come 
  const wrapperRef = useRef(null); // new wrapper reference


  useEffect(() => {

    if (editMode)
      setTimeout(() => inputRef.current?.focus(), 0);  // focus on input after it appears on dom

  }, [editMode]);

  
  
  // called when user click on edit icon or field itself
  const handleFieldClick = () => {
    setEditMode(true);       // set the field in edit mode
  };  


  // called on blur (locus focus) on pressing enter
  const handleSave = () => {
    setEditMode(false);
    if (tempValue !== value) 
        onSave(tempValue);
  };


  // check if after click ai suggest , still the target is not blur then save
  const handleBlur = (e) => {
    // check if blur target is outside wrapper (not AI button or dropdown)
    if (wrapperRef.current && wrapperRef.current.contains(e.relatedTarget)) {
      return;
    }
    handleSave();
  };


  // if user press enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") 
        handleSave();
  };


  return (
    <>
      {
        editMode ? (
                     <Box  ref={wrapperRef}  display="flex"  alignItems="center"  gap={1}  sx={{ position: "relative" }}>
                          {/* Inline Editable TextField with AI Suggestion */}
                          <TextField
                            inputRef={inputRef}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={handleBlur}
                            onKeyPress={handleKeyPress}
                            size="small"
                            fullWidth
                            multiline={multiline}
                            sx={{ my: 1 }}
                          />

                          <AISuggestionButton value={tempValue} onSelect={(s) => setTempValue(s)}/>
                    </Box>
                ) : (
                  <Typography variant="subtitle1" component="span"
                              sx={{ cursor: "pointer", mt: 1, display: "flex", alignItems: "center", justifyContent: "space-between"}}
                  >
                  
                    <span>
                      {label && <b>{label}: </b>}
                      {value}
                    </span>
                  
                    {
                      !readOnly && ( <Icon src={pencilImg} alt="Edit Icon" onClick={handleFieldClick} sx={{ cursor: "pointer" }}/>)
                    }
                 </Typography>
                )
       }
    </>
  );
}

export default InlineEditableField;
