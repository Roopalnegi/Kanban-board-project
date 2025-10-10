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
    headerFooterSidebarText: "#FFFFFF"
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