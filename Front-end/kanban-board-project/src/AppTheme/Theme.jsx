import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import {SnackbarProvider, MaterialDesignContent} from 'notistack';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import {styled} from '@mui/material/styles';


const theme = createTheme({
  colors: {
    header: "#fff8e7",
    footer: "#fff8e7",
    sidebarMenu: "#fff3c4",
    board: "#fffdf5",
    cardBackground: "#fff9e6",
    buttons: "#ec960cff",
    bodyText: "#6B4E23",
    headerFooterSidebarText: "#6B4E23",
  },
  palette: {
    success: { main: "rgb(25, 195, 96)"},
    error: { main: "rgb(243, 10, 10)"},
    info: {main: "rgb(29, 155, 245)"},
    warning: {main: "rgb(225, 130, 14)"},
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "30px",
          textTransform: "none",
          fontWeight: "600",
          
        },
      },
    },
  },
});


// to override the snackbar style
const StyledMaterialDesignContent = styled(MaterialDesignContent) ( () => ({
   padding: "8px 12px",
   fontWeight: "bold",
   borderWidth: "2px",
   borderStyle: "solid",
   borderRadius: "2px",

  '&. SnackbarContainer-root':{
     position: 'fixed !important',
     top: '50% !important',
     left: '50% !important',
     tarnsform: 'translate(-50%, -50%) !important',
     zIndex: 2000,
  }, 
   '&.notistack-MuiContent-success':{
      color: "#385a22ff",
      backgroundColor: "#abeb83ff",
      borderColor: "#4e9a06",
   },
   '&.notistack-MuiContent-error':{
      color: "#8c1c13",
      backgroundColor: "#ec9c96ff",
      borderColor: "#d93025",

   },
   '&.notistack-MuiContent-warning':{
      color: "#7e500bff",
      backgroundColor: "#ffffffff",
      borderColor: "#ec960c",

   },
   '&.notistack-MuiContent-info':{
      color: "#184f80",
      backgroundColor: "#d9ecff",
      borderColor: "#1d6fb8",
    
   }

}));

function AppThemeProvider({children})
{
    return(
          <ThemeProvider theme = {theme}>
            <CssBaseline/> {/* normalize browser default styles */}
            <SnackbarProvider maxSnack={3}
                              autoHideDuration={3000}
                              anchorOrigin={{vertical: "top", horizontal: "center"}}
                              iconVariant={{
                                              success: <CheckCircleIcon sx={{ mr: 1, color: "black" }} />,
                                              error: <ErrorIcon sx={{ mr: 1, color: "black" }} />,
                                              info: <InfoIcon sx={{ mr: 1, color: "black" }} />,
                                              warning: <ReportProblemIcon sx={{mr:1, color: "black"}} />
                                           }}
                              Components={{ success: StyledMaterialDesignContent,
                                            error: StyledMaterialDesignContent,
                                            warning: StyledMaterialDesignContent,
                                            info: StyledMaterialDesignContent,
                                          }}             
            >
            
            {children}
  
            </SnackbarProvider>                      

          </ThemeProvider>
          );
}

export default AppThemeProvider;

// usually, Mui components have their own internal styles , which higher precedence than CSS file, so some properties may not be oveeridden
// in this case, almost all buttons in the app will have rounded corners




