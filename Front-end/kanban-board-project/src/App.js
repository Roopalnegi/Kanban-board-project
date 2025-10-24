import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import InfoPage from "./Pages/InfoPage/InfoPage.jsx";
import LoginForm from "./Forms/Login/LoginForm.jsx";
import RegisterForm from "./Forms/Register/RegisterForm.jsx";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard.jsx";
import EmployeeDashboard from "./Pages/EmployeeDashboard/EmployeeDashboard.jsx";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx";
import BoardDashboard from "./Pages/BoardDashboard/BoardDashboard.jsx";
import NotificationPanel from "./Components/NotificationPanel/NotificationPanel.jsx";


import {Routes, Route} from 'react-router-dom';
import {useState} from 'react';
import "./App.css";


function App() 
{
  const[loginStatus, setLoginStatus] = useState(false);
  const[userData, setUserData] = useState(null);


   return(
         <div className = "AppLayout">
         
           <Header loginStatus = {loginStatus} setLoginStatus = {setLoginStatus} userData={userData} />  
            
            {/* Main content area between header & footer */} 
           
            <main className = "AppMain">
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

                <Route path = "/board/:boardId" element = {<BoardDashboard/>} />
                <Route path = "/notificationpanel" element = {<NotificationPanel userData = {userData} />} />

             </Routes>
            </main>
          
        <Footer/> 
         </div>
         );
  
}

export default App;
