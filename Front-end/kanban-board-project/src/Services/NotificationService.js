import axiosInstance from "./axiosConfig";

const baseURL = "http://localhost:8084/api/v1/notification";

// get all user notifications (no pagination)
const getAllNotifications = async (email) => {
   const response = await axiosInstance.get(`${baseURL}/allNotifications?recipient=${email}`);
   return response.data;   // returns List<Notification>
};

// mark notification as read
const markNotificationAsRead = async (notificationId) => {
   const response = await axiosInstance.post(`${baseURL}/markNotificationAsRead/${notificationId}`);
   return response.data;
};

// filter notification by date (no pagination)
const filterNotificationByDate = async (email, date) => {
   const response = await axiosInstance.get(`${baseURL}/getNotificationByDate?recipient=${email}&date=${date}`);
   return response.data;
};

// filter notification by month and year (no pagination)
const filterNotificationByMonthAndYear = async (email, month, year) => {
   const response = await axiosInstance.get(`${baseURL}/getNotificationByMonthAndYear?recipient=${email}&month=${month}&year=${year}`);
   return response.data;
};

// get unread notifications (no pagination)
const unreadNotification = async (email) => {
   const response = await axiosInstance.get(`${baseURL}/getUnreadNotification?recipient=${email}`);
   return response.data;  // returns list of unread notifications
};

// count unread notifications
const countUnreadNotification = async (email) => {
   const response = await axiosInstance.get(`${baseURL}/countUnreadNotification?recipient=${email}`);
   return response.data;  // returns number
};

export {  getAllNotifications,  markNotificationAsRead,  filterNotificationByDate,  filterNotificationByMonthAndYear,  unreadNotification,  countUnreadNotification };
