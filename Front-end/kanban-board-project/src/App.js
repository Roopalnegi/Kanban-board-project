import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import InfoPage from "./Pages/InfoPage/InfoPage.jsx";
import LoginForm from "./Forms/Login/LoginForm.jsx";
import RegisterForm from "./Forms/Register/RegisterForm.jsx";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard.jsx";
import EmployeeDashboard from "./Pages/EmployeeDashboard/EmployeeDashboard.jsx";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx";

import TaskCard from "./Components/TaskCard/TaskCard.jsx";

import {Box} from '@mui/material';

import {Routes, Route} from 'react-router-dom';
import {useState} from 'react';


function App() 
{
  const[loginStatus, setLoginStatus] = useState(false);
  const[userData, setUserData] = useState(null);

  // temperoray task object
  const task = {
  taskId: "45E3",
  title: "Sample Task Card",
  task_description: "This is a sample task card description just for demonstration purposes",
  priority: "high",
  assignedTo: ["sam@gmail.com", "alice@gmail.com", 'roopalnegi147@gmail.com', 'palim@gmailcom'],
  dueDate: "2025-10-10",
  daysLeft: 5
};


   return(
         <>
         
           <Header loginStatus = {loginStatus} setLoginStatus = {setLoginStatus} userData={userData} />  
            
            {/* Main content area between header & footer */} 
           <Box component="main" sx={{ minHeight: "40vh", 
                                       pt: "70px", // padding top = header height
                                       pb: "70px", // padding bottom = footer height
                                       backgroundColor: "#FFFFFF",
                                    }}
           >

             <Routes>
               <Route path = "/" element = {<HomePage/>} />
               <Route path = "/login" element = {<LoginForm setLoginStatus={setLoginStatus} setUserData={setUserData}/>} />
               <Route path = "/register" element = {<RegisterForm/>} />
               <Route path = "/infopage" element = {<InfoPage/>} />

               {/* Admin route protected with ProtectedRoute */}
               <Route path = "/admin-dashboard" 
                      element = {<ProtectedRoute allowedRole = "admin" userData = {userData}>
                                     <AdminDashboard/>
                                 </ProtectedRoute> }
                />

                {/* Employee route protected with ProtectedRoute */}
               <Route path = "/employee-dashboard" 
                      element = {<ProtectedRoute allowedRole = "employee" userData = {userData}>
                                     <EmployeeDashboard/>
                                 </ProtectedRoute> }
                />

               

               <Route path = "/taskcard" element= {<TaskCard task = {task} />} />
             </Routes>

          </Box>

        <Footer/> 
         </>
         );
  
}

export default App;
