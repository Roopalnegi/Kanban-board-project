import axios from 'axios';


// create axios instance (object)
const axiosInstance = axios.create({
    baseURL : '',                          // leave blank to use full URL in requests, can set dynamically later
});


// add request interceptor -- going to be run before every http request
axiosInstance.interceptors.request.use(
   
    (config) => {
                     // get token from localStorage
                     const token = localStorage.getItem("token");

                     // check if token exist, attach it to Authorixation header 
                     if(token)
                     {
                        config.headers.Authorization = `Bearer ${token}`;
                     }

                     return config;
                },
    // handle request errors             
    (error) => Promise.reject(error)
);


export default axiosInstance;

/*
This file purpose -- create a custom axios instance (object) that automatically attaches
                     JWT token (stored in localStorage after login) to every api call

why -- so that no need to manually attach token in each api call
    -- ensure all authenticated request include same header 
*/


// to use this method, now replace axios with axiosInstance 