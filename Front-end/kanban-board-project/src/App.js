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
import ChatRoomSetup from './Components/ChatRoomSetup/ChatRoomSetup.jsx';
import { getAllNotifications } from "./Services/NotificationService.js";
import { useErrorBoundary } from "react-error-boundary";

import {Routes, Route} from 'react-router-dom';
import {useState, useEffect} from 'react';
import "./App.css";
import axiosInstance from "./Services/axiosConfig.js";


function App() 
{
  const [loginStatus, setLoginStatus] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);                    // hide header and footer for chat room 

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



  // fetch user profile image from db
  useEffect(() => {
    
     const fetchProfileImage = async () => {
       if(!userData?.userId)
        return;

      try
      {
          const response = await axiosInstance.get(`http://localhost:8081/api/v1/user/getProfileImage?userId=${userData.userId}`,
            {responseType: "arraybuffer"}          
          );

          // now have to convert bytes ---> base64 (string format) ---> proper image
          const base64Image = btoa(
            new Uint8Array(response.data).reduce(
              (data,byte) => data + String.fromCharCode(byte),
              ""
            )
          );

          const imageUrl = `data:image/jpeg;base64,${base64Image}`;
          setProfileImage(imageUrl);
      }
      catch(error)
      {
        console.error("Error in fetching usre profile image : ", error);
      }

     };

     fetchProfileImage();
  },[userData]);


   return(
         <div className = "AppLayout">
         
          { showHeaderFooter && (<Header loginStatus = {loginStatus} setLoginStatus = {setLoginStatus} 
                                          userData={userData} setUserData = {setUserData} 
                                          profileImage = {profileImage} setProfileImage={setProfileImage}
                                          setNotifications = {setNotifications} 
                                          unreadNotificationCount = {unreadNotificationCount} setUnreadNotificationCount = {setUnreadNotificationCount} />  
          
          )}

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
                                     <AdminDashboard setShowHeaderFooter={setShowHeaderFooter}/>
                                 </ProtectedRoute> }
                />

                {/* Employee route protected with ProtectedRoute */}
               <Route path = "/employee-dashboard" 
                      element = {<ProtectedRoute allowedRole = "employee" userData = {userData}>
                                     <EmployeeDashboard userData={userData} setShowHeaderFooter={setShowHeaderFooter}/>
                                 </ProtectedRoute> }
                />

                <Route path = "/board/:boardId" element = {<BoardDashboard userData = {userData} profileImage={profileImage}/>} />
                <Route path = "/notificationpanel" element = {<NotificationPanel userData = {userData} notifications = {notifications}
                                                                                 setNotifications = {setNotifications}
                                                                                 setUnreadNotificationCount = {setUnreadNotificationCount} />} />
                <Route path = "/chatroom" element = {<ChatRoomSetup setShowHeaderFooter={setShowHeaderFooter} profileImage={profileImage}/>} />                                                                                                                    
                <Route path = "*" element = {<PageNotFound />} />                                                                 

             </Routes>
            </main>
          
         { showHeaderFooter && <Footer/> }
         </div>
         );
  
}

export default App;

/*
Image wala :-

1. backend store image in byte[] in mongodb
2. hence, backend return only raw bytes (binary) of image (neither in JSON, not multipartfile / form-data)

3. Broswer can't render binary directly
4. So, broswer convert it first into base64 string ---> the particular MIME type ---> to become a vald image url

5. By default, Axiso assumes responses are either text/ json
6. but response coming form backned is raw data .... so arraybuffer ... tells axiso raw binary data buffer

7. new Uint8Array(response.data) -- A Uint8Array is a typed array view on top of that binary data.
                                 -- allows you to access each byte (0–255 value) individually.

If the image was, say, 1KB in size → you now have 1024 bytes.

8. .reduce((data, byte) => data + String.fromCharCode(byte), "")

String.fromCharCode(byte) → converts each byte (number) to its character representation.

.reduce(...) → loops through all bytes and concatenates them into one giant binary string.

At this point, you have a binary string representation of the image.

9. btoa(...) -- short for bianry to ASCII
             -- It converts that binary string into a Base64-encoded string.


10. `data:image/jpeg;base64,${base64Image}`

Finally, you prepend: data:[MIME type];base64,

So your image URL becomes: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...

//// MIME -- Multipurpose Internet Mail Extensions type.
          -- earlier used for email attachment, but can used anywhere
          -- tells broswer what kind of file they are recieving and sending 
*/