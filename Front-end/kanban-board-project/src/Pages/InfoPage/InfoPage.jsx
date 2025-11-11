import {
  Box,
  Typography,Card,CardContent,Button,
  Stack,Link,Grow,useTheme,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Fade,
} from "@mui/material";
import { Email, Info, ArrowForward, Close } from "@mui/icons-material";
import { useState } from "react";
function InfoPage() {
  const [openAboutDialog, setOpenAboutDialog] = useState(false);
  const theme = useTheme();
  
  const handleOpenAbout = () => setOpenAboutDialog(true);
  const handleCloseAbout = () => setOpenAboutDialog(false);
  return (
    <Box
      sx={{
        backgroundColor: theme.colors.board,
        minHeight: "100vh",
        color: theme.colors.bodyText, 
      }}
    >
      
      <Toolbar />
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          maxWidth: 900,
          mx: "auto",
        }}
      >
        {/* About Us Section */}
        <Grow in timeout={700}>
          <Card
            sx={{
              mb: 6,
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              backgroundColor: theme.colors.cardBackground,
              "&:hover": { boxShadow: 6, transform: "translateY(-6px)" },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Info sx={{ color: theme.colors.buttons }} /> {/* icon */}
                <Typography variant="h4" fontWeight="bold" sx={{ color: theme.colors.bodyText }}>
                  About Us
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <b>Kanban Board 2025</b> is your smart project management
                companion — designed for simplicity, speed, and seamless
                collaboration.
              </Typography>
              <Button
                variant="contained"
                onClick={handleOpenAbout}
                endIcon={<ArrowForward />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                  backgroundColor: theme.colors.buttons,
                  color: theme.colors.headerFooterSidebarText,
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grow>
        {/* Contact Us Section */}
        <Grow in timeout={1000}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              backgroundColor: theme.colors.cardBackground,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": { boxShadow: 6, transform: "translateY(-6px)" },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Email sx={{ color: theme.colors.buttons }} /> {/* icon */}
                <Typography variant="h4" fontWeight="bold" sx={{ color: theme.colors.bodyText }}>
                  Contact Us
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We’d love to hear from you — whether it’s feedback, collaboration,
                or support.
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Email sx={{ color: theme.colors.bodyText }} />
                  
                  <Link
                    href="mailto:support@kanban2025.com"
                    underline="hover"
                    sx={{
                      color: theme.colors.buttons,
                      fontWeight: "bold",
                    }}
                  >
                    kanbanservicespprt@gmail.com
                  </Link>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grow>
      </Box>
      {/* About Us Dialog */}
      <Dialog
        open={openAboutDialog}
        onClose={handleCloseAbout}
        TransitionComponent={Fade}
        keepMounted
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.colors.cardBackground,
            color: theme.colors.bodyText,
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
            color: theme.colors.buttons,  
          }}
        >
          More About Us
          <IconButton onClick={handleCloseAbout} sx={{ color: theme.colors.bodyText }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            At <b>Kanban Board 2025</b>, we believe project management should be effortless.
          </Typography>
          <Typography variant="body1">
            Our mission is to simplify teamwork for everyone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseAbout}
            variant="contained"
            sx={{
              borderRadius: 2,
              backgroundColor: theme.colors.buttons,
              color: theme.colors.headerFooterSidebarText,
              "&:hover": { opacity: 0.9 },
            }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default InfoPage;