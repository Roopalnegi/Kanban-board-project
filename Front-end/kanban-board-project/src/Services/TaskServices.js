import axiosInstance from "./axiosConfig";

const baseURL = "http://localhost:8083/api/v1/task";


// get all tasks of specific board id 
const getAllTasksOfBoardId = async (boardId) => {
    const response = await axiosInstance.get(`${baseURL}/getAllTasksOfBoardId/${boardId}`);
    return response.data;
};



// add task to a column for a board
const addTask = async (newTask) => {
   const response = await axiosInstance.post(`${baseURL}/createTask`, newTask);
   return response.data;
};


// fetch employee data for assigned To property of task
const getEmployeeDetails = async () => {
    const response = await axiosInstance.get(`${baseURL}/fetchAllEmployeeDetails`);
    return response.data;
};


// get no.of days left to complete task
const calculateNoOfDays = async (dueDate) => {
    const response = await axiosInstance.get(`${baseURL}/noOfDaysBeforeDue/${dueDate}`);
    return response.data;
};


// task delete forever
const deletePermanent = async (taskId) => {
   const response = await axiosInstance.delete(`${baseURL}/deleteTask/${taskId}`);
   return response.data;
};


// task delete temporarily / move to archive column
const archiveTask = async (taskId) => {
   const response = await axiosInstance.put(`${baseURL}/archiveTask/${taskId}`);
   return response.data;
};


// restore task from archive 
const restoreTask = async (taskId) => {
   const response = await axiosInstance.put(`${baseURL}/restoreTask/${taskId}`);
   return response.data;
};


// update task
const updateTask = async (taskId, updatedData) => {
   const response = await axiosInstance.put(`${baseURL}/updateTask/${taskId}`, updatedData);
   return response.data;
};




export {getAllTasksOfBoardId, addTask, getEmployeeDetails, calculateNoOfDays, deletePermanent, archiveTask, restoreTask, updateTask, notify};


