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
import NotificationPanel from "./Components/Notification/NotificationPanel.jsx";
import PageNotFound from "./Pages/PageNotFound/PageNotFound.jsx";

import { getAllNotifications } from "./Services/NotificationService.js";
import { useErrorBoundary } from "react-error-boundary";

import {Routes, Route} from 'react-router-dom';
import {useState, useEffect} from 'react';
import "./App.css";


function App() 
{
  const [loginStatus, setLoginStatus] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const {showBoundary} = useErrorBoundary();                             // showBoundary -- to trigger fallback manually
  const isError = false;


   // fetch all notifications whenever userData changes
  useEffect(() => {
    
    const fetchNotifications = async () => {
      if (!userData?.email) return;
      try 
      {
        if(isError)
        {
          throw new Error ("Simulated error during data fetching !");
        }

        const list = await getAllNotifications(userData.email);
        setNotifications(list);
        setUnreadNotificationCount(list.filter(n => n.read === false).length);
      } 
      catch (error) 
      {
        console.error("Error fetching notifications:", error);
        showBoundary(error);                                      // show fallback ui 
      }
    };

    fetchNotifications();
  }, [userData, showBoundary, isError]);


   return(
         <div className = "AppLayout">
         
           <Header loginStatus = {loginStatus} setLoginStatus = {setLoginStatus} 
                   userData={userData} setUserData = {setUserData} 
                   setNotifications = {setNotifications} 
                   unreadNotificationCount = {unreadNotificationCount} setUnreadNotificationCount = {setUnreadNotificationCount} />  
            
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
                <Route path = "/notificationpanel" element = {<NotificationPanel userData = {userData} notifications = {notifications}
                                                                                 setNotifications = {setNotifications}
                                                                                 setUnreadNotificationCount = {setUnreadNotificationCount} />} />
                <Route path = "*" element = {<PageNotFound />} />                                                                 

             </Routes>
            </main>
          
        <Footer/> 
         </div>
         );
  
}

export default App;
