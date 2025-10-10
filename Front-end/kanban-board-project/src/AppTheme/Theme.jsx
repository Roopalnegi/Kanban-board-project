import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';


const theme = createTheme({
  colors: 
  {
    header: "#0f1729",
    footer: "#0f1729",
    sidebarMenu: "#0f172a",
    board: "#FFFFFF",
    cardBackground: "#F1F5F9",
    buttons: "#F5A623",
    bodyText: "#1E1E1E",
    headerFooterSidebarText: "#FFFFFF",
  },
  palette:
  {
    success: {main: "#4CAF50"},        // needed for notistack 
    error:{main: "#F44336"},           // needed for notistack
  },
  components: 
  {
    MuiButton:
    {
       styleOverrides: 
       {
        root: {borderRadius: "30px",}
       }
    }
  }
});



function AppThemeProvider({children})
{
    return(
          <ThemeProvider theme = {theme}>
            <CssBaseline/> {/* normalize browser default styles */}
            {children}
          </ThemeProvider>
          );
}

export default AppThemeProvider;

// usually, Mui components have their own internal styles , which higher precedence than CSS file, so some properties may not be oveeridden
// in this case, almost all buttons in the app will have rounded corners
