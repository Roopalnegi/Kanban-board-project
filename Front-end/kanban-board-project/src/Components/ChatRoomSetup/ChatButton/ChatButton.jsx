import { Box, Tooltip } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import { useNavigate } from "react-router-dom";
import styles from "./ChatButton.module.css";

function ChatButton({ setShowHeaderFooter }) 
{

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/chatroom");
        setShowHeaderFooter(false);
  };

  return (
    <Box className={styles.chatIconBox} onClick={handleClick}>
      
      <Tooltip title="Want to Discuss Something?" placement="top"
        componentsProps={{ tooltip: { sx: { bgcolor: "whitesmoke", color: "black", fontSize: 14,}, }}}>
        <ForumIcon fontSize="large" />
      </Tooltip>
      
    </Box>
  );
}

export default ChatButton;
