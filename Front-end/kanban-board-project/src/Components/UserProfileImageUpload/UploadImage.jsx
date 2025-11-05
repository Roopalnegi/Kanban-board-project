import { TextField, Box, Button, useTheme, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import axiosInstance from "../../Services/axiosConfig";

function UploadImage({ userData, profileImage, setProfileImage, onClose }) 
{

   const { enqueueSnackbar } = useSnackbar();
   const theme = useTheme();

  // when file is selected
  const handleFileChange = (e) => {
    
    const file = e.target.files[0];
    
    if (!file) return;

    // check file type (only jpg/jpeg)
    const allowedTypes = ["image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) 
    {
      enqueueSnackbar("Only JPG or JPEG files are allowed !", { variant: "warning" });
      e.target.value = null;
      return;
    }

    
    // check file size (< 10MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) 
    {
      enqueueSnackbar("File size should be less than 2 MB !", { variant: "warning" });
      e.target.value = null;
      return;
    }

    // if all condition passed
    setProfileImage(file);
  };



  // handle upload to db
  const handleSubmit= async () => {
    
    if (!profileImage) 
    {
      enqueueSnackbar("Please select an image first !", { variant: "warning" });
      return;
    }

    try 
    {
      const formData = new FormData();
      formData.append("userId", userData.userId);
      formData.append("file", profileImage);

      await axiosInstance.post("http://localhost:8081/api/v1/user/uploadProfileImage",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      enqueueSnackbar("Image uploaded successfully!", { variant: "success" });
    

      // re-fetch updated image immediately
      const response = await axiosInstance.get( `http://localhost:8081/api/v1/user/getProfileImage?userId=${userData.userId}`,
        { responseType: "arraybuffer" }
      );

      const base64Image = btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      setProfileImage(imageUrl);

      if(onClose) onClose();       // close popover from header
    } 
    catch (error) 
    {
      enqueueSnackbar("Failed to upload profile image!", { variant: "error" });
    }
  };

  return (
    
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "250px",
          }}
        >
          <Typography variant="h6" align="center">
            Upload Image
          </Typography>

          <TextField
            type="file"
            accept="image/jpeg,image/jpg"
            onChange={handleFileChange}
            InputLabelProps={{ shrink: true }}
          />

          <Button variant="contained" sx={{bgcolor: theme.colors.buttons}} onClick={handleSubmit}>
            Upload
          </Button>
        </Box>
  );
}

export default UploadImage;
