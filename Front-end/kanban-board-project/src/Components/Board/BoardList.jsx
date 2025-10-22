import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {Icon} from '../IconComponent/Icon';
import { deleteBoardImg } from '../IconComponent/Icon';
import {useNavigate} from 'react-router-dom';
import { useSnackbar } from "notistack";
import { deleteBoard } from "../../Services/BoardServices";


export default function BoardList({boards, onBoardDeleted})
{

  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const handleBoardOpen = (boardId) => {
       navigate(`/board/${boardId}`);
  };


  const handleDeleteBoard = async (boardId) => {
     try
     {
       const response = await deleteBoard(boardId);
       enqueueSnackbar(response || "Board Deleted Successfully !", {variant: "success"});    
       
      // tell parent to remove board from state (app lift state)
      onBoardDeleted(boardId);                                                                                                                  
     }
     catch(error)
     {
      enqueueSnackbar(error?.message, {variant: "error"});
     }
  };


  return(
    <Box>
      <Typography variant="h6"fontWeight="bold"mb={2} >
        Board OverView
      </Typography>
      <Grid container spacing={2}>
        {boards.map((board)=>(
          <Grid item xs={12} sm={6}key={board.boardId}>
            <Card
            sx={{
              borderRadius:3,
              boxShadow:2,
              cursor:"pointer",
              "&:hover":{boxShadow:5}
            }}
            onClick={() => handleBoardOpen(board.boardId)}
            >
              <CardContent>
                <Box display="flex"alignItems="center"justifyContent="space-between">
                  <Box display="flex"alignItems="center"gap={1}>
                    <DashboardIcon color="primary"/>
                    <Typography variant="subtitle1"fontWeight="bold">
                      {board.boardName}
                    </Typography>
                  </Box>
                  <Icon src = {deleteBoardImg} alt = "DeleteBoardIcon" onClick = {(e) => {e.stopPropagation();
                                                                                handleDeleteBoard(board.boardId);}}
                        sx = {{cursor: "pointer"}} />                                                        

                </Box>
                <Typography variant="body2"color="text.primary"mt={1}>
                  {board.description||"No description provided"}
                </Typography>
              </CardContent>
            </Card>
            </Grid>
        ))}
      </Grid>
    </Box>
  );
}