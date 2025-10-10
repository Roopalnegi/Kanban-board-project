import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import InfoPage from "./Pages/InfoPage/InfoPage.jsx";
import LoginForm from "./Forms/Login/LoginForm.jsx";
import RegistrationForm from "./Forms/Register/RegisterForm.jsx";
import HomePage from "./Pages/HomePage/HomePage.jsx";

import {Box} from '@mui/material';

import {Routes, Route} from 'react-router-dom';
import {useState} from 'react';


function App() 
{
  const[loginStatus, setLoginStatus] = useState(false);

   return(
         <>
         
           <Header loginStatus = {loginStatus} setLoginStatus = {setLoginStatus} />  
            
            {/* Main content area between header & footer */} 
           <Box component="main" sx={{ minHeight: "40vh", 
                                       pt: "70px", // padding top = header height
                                       pb: "70px", // padding bottom = footer height
                                       backgroundColor: "#FFFFFF",
                                    }}
           >

             <Routes>
               <Route path = "/" element = {<HomePage/>} />
               <Route path = "/login" element = {<LoginForm setLoginStatus={setLoginStatus}/>} />
               <Route path = "/register" element = {<RegistrationForm/>} />
               <Route path = "/infopage" element = {<InfoPage/>} />
             </Routes>

          </Box>

        <Footer/> 
         </>
         );
  
}

export default App;
