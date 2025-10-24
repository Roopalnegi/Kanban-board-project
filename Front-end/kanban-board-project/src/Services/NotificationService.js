import axiosInstance from "./axiosConfig";

const baseURL = "http://localhost:8084/api/v1/notification";

// get user notifications
const getAllNotifications = async (username) => {
   const response = await axiosInstance.get(`${baseURL}/allNotifications?recipient=${username}`);
   return response.data;
};


// mark notification as read
const markNotificationAsRead = async (notificationId) => {
   const response = await axiosInstance.post(`${baseURL}/markNotificationAsRead/${notificationId}`);
   return response.data;
};


// filter notification by date
const filterNotificationByDate = async (username, date) => {
   const response = await axiosInstance.get(`${baseURL}/getNotificationByDate?recipient=${username}&date=${date}`);
   return response.data;
};


// filter notification by month and year
const filterNotificationByMonthAndYear = async (username,month,year) => {
     const response = await axiosInstance.get(`${baseURL}/getNotificationByMonthAndYear?recipient=${username}&month=${month}&year=${year}`);
     return response.data;
};


// get unread notification
const unreadNotification = async (username) => {
    const response = await axiosInstance.get(`${baseURL}/getUnreadNotification?recipient=${username}`);
    return response.data;
};


// count unread notification
const countUnreadNotification = async (username) => {
    const response = await axiosInstance.get(`${baseURL}/countUnreadNotification?recipient=${username}`);
    return response.data; 
};


export {getAllNotifications, markNotificationAsRead, filterNotificationByDate, filterNotificationByMonthAndYear, unreadNotification, countUnreadNotification};



