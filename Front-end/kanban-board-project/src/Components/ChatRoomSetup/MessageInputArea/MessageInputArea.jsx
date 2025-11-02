import { Box, TextField, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import styles from "./MessageInputArea.module.css";

function MessageInputArea({messageInput, setMessageInput, sendMessage})
{
    return (
     <Box className={styles.messageInputContainer}>
     
        <TextField placeholder="Write Message..."
                   value={messageInput}
                   onChange={(e) => setMessageInput(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === "Enter") {
                       e.preventDefault();
                       sendMessage();
                     }
                   }}
                   fullWidth
                   multiline          // allow multi-line text
                   minRows={5}        // increase height     
                   InputProps={{
                     endAdornment: (
                       <InputAdornment position="end">
                         <SendIcon onClick={sendMessage} sx={{ cursor: "pointer" }} />
                       </InputAdornment>
                     ),
                   }}
                   className={styles.messageTextField}
        />
    </Box>
    );
}

export default MessageInputArea;