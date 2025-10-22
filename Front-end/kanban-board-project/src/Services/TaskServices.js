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
    const response = await axiosInstance.get
};


// get no.of days left to complete task
const calculateNoOfDays = async (dueDate) => {
    const response = await axiosInstance.get(`${baseURL}/noOfDaysBeforeDue/${dueDate}`);
    return response.data;
};




export {getAllTasksOfBoardId, addTask, calculateNoOfDays};


