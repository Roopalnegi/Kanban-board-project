import { Box, Typography } from '@mui/material';

function InfoPage() {
  return (
    <Box sx={{ p: 4 }}>
      {/* About Us Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom><b>About Us</b></Typography>
        <Typography variant="body1">
          Kanban Board 2025 is a simple project management tool...
        </Typography>
      </Box>

      {/* Contact Us Section */}
      <Box  sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom><b>Contact Us</b></Typography>
        <Typography variant="body1">
          You can reach us at ,<b>support@kanban2025.com </b>or call <b>+91-1234567890 </b>
        </Typography>
      </Box>
    </Box>
  );
}

export default InfoPage;
