import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import {SnackbarProvider} from 'notistack';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';


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
    success: { main: "rgba(11, 167, 76, 0.36)"},
    error: { main: "rgba(243, 10, 10, 0.36)"},
    info: {main: "rgba(29, 155, 245, 0.36)"},
    warning: {main: "rgba(225, 130, 14, 0.36)"},
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


function AppThemeProvider({children})
{
    return(
          <ThemeProvider theme = {theme}>
            <CssBaseline/> {/* normalize browser default styles */}
            <SnackbarProvider maxSnack={3}
                              autoHideDuration={2000}
                              anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                              iconVariant={{
                                              success: <CheckCircleIcon sx={{ mr: 1, color: "green" }} />,
                                              error: <ErrorIcon sx={{ mr: 1, color: "red" }} />,
                                              info: <InfoIcon sx={{ mr: 1, color: "blue" }} />,
                                              warning: <ReportProblemIcon sx={{mr:1, color: "orange"}} />
                                           }}
                              sx= {{
                                     "& .SnackbarContent-root" :{
                                                                  padding: "8px 12px",
                                                                  fontWeight: "bold",
                                                                  color: "black",
                                                                  borderWidth: "4px",
                                                                  borderStyle: "solid",
                                                                  borderRadius: "4px",
                                                                },
                                     "& .SnackbarItem-variantSuccess": {backgroundColor: theme.palette.success.main,
                                                                        borderColor: "green",
                                                                       },
                                     "& .SnackbarItem-variantError": {backgroundColor: theme.palette.error.main,
                                                                        borderColor: "red",
                                                                       }, 
                                     "& .SnackbarItem-variantInfo": {backgroundColor: theme.palette.info.main,
                                                                        borderColor: "blue",
                                                                       }, 
                                     "& .SnackbarItem-variantWarning": {backgroundColor: theme.palette.info.main,
                                                                        borderColor: "orange",
                                                                       }                                                                 
                                                                                                  
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




