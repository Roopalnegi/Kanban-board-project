import {Typography, TextField} from '@mui/material';
import {useState, useRef, useEffect} from 'react';
import {Icon, pencilImg} from '../IconComponent/Icon';


/*
 editable inline when user click on edit icon saves changes to backend automatically on blur or pressing enter
*/

// If forceEditMode is true, start in edit mode
function InlineEditableField( {label, value, onSave, multiline = false, forceEditMode = false} )
{
    // track which field is edited 
    const [editMode, setEditMode] = useState(forceEditMode);
    const [tempValue, setTempValue] = useState(value);

    
    // for auto - focusing (gain focus) when a field enters edit mode
    const inputRef = useRef (null); 


    useEffect(() => {
      
        if(editMode)
            setTimeout(() => inputRef.current?.focus(), 0);  // focus on input after it appears on dom 

    },[editMode]);
       

    
    // called when user click on edit icon or field itself
    const handleFieldClick = () => {
        setEditMode(true);         // set the field in edit mode
    };


    // called on blur (locus focus) or pressing enter 
    const handleSave = () => {
       setEditMode(false);
       if(tempValue !== value)
         onSave(tempValue);
    };


    //  if user click enter key
    const handleKeyPress = (e) => {
         if(e.key === "Enter")
            handleSave();
    };


    return (
     
        <>
         {
            editMode ? (
                         <TextField inputRef = {inputRef} value = {tempValue}
                                    onChange = {(e) => setTempValue(e.target.value)}
                                    onBlur = {handleSave}
                                    onKeyPress = {handleKeyPress}
                                    size = "small" 
                                    fullWidth 
                                    multiline = {multiline}
                                    sx = {{my:1}}
                           />         
                       )
                       :(
                            <Typography variant = "subtitle1"
                                        sx = {{cursor: "pointer", mt: 1, display: "flex", alignItems: "center", justifyContent: "space-between"}}
                            >

                               <span> {
                                          label && <b> {label} : </b>
                                      }
                                  {value}
                                </span>  
                               
                               <Icon src = {pencilImg} alt = "Edit Icon" 
                                     onClick = {handleFieldClick} sx = {{cursor: "pointer"}} />

                            </Typography> 
                        )
         }    
        
        </>
    );
}


export default InlineEditableField;