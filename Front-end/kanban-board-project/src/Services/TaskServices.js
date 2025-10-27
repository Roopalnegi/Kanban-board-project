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


// move task within column
const moveTaskByColumn = async (taskId, columnId, username) => {
   const response = await axiosInstance.put(`${baseURL}/moveTaskByColumn/${taskId}/${columnId}`,{username});
   return response.data;
};


// get tasks of assigned employee
const getTasksByEmployee = async (email) => {
  const response = await axiosInstance.get(`${baseURL}/getTasksByEmployee/${email}`);
  return response.data;
};



// filter task by priority
const filterTaskByPriority = async (boardId, priority) => {
   const response = await axiosInstance.get(`${baseURL}/filterTaskByPriority/${boardId}?priority=${priority}`);
   return response.data;
};


// filter task by created on specific date -- user want to see how many task is created at particular date
const filterTaskByCreatedAt = async (boardId, createdAt) => {
   const response = await axiosInstance.get(`${baseURL}/filterTaskByCreatedAt/${boardId}?createdAt=${createdAt}`);
   return response.data;
};
  

// filter task by due on specific date  -- user want to see how many task have deadline today
const filterTaskByDueDate = async (boardId, dueDate) => {
   const response = await axiosInstance.get(`${baseURL}/filterTaskByDueDate/${boardId}?dueDate=${dueDate}`);
   return response.data;
};


// filter task created on specific month and year
const filterTaskByCreatedMonth = async (boardId, month, year) => {
   const response = await axiosInstance.get(`${baseURL}/filterTaskByCreatedMonth/${boardId}?month=${month}&year=${year}`);
   return response.data;
};


// filter task due on specific month and yea
const filterTaskByDueMonth = async (boardId, month, year) => {
   const response = await axiosInstance.get(`${baseURL}/filterTaskByDueMonth/${boardId}?month=${month}&year=${year}`);
   return response.data;
};


// search task by title / decription / assigned To
const searchTasksByKeyword = async (boardId, keyword) => {
   const response = await axiosInstance.get(`${baseURL}/${boardId}/searchTaskBy?keyword=${keyword}`);
   return response.data;
};




export {getAllTasksOfBoardId, addTask, getEmployeeDetails, calculateNoOfDays, deletePermanent, archiveTask, restoreTask, updateTask,
        filterTaskByPriority, filterTaskByCreatedAt, filterTaskByDueDate, filterTaskByCreatedMonth, filterTaskByDueMonth, searchTasksByKeyword,
        getTasksByEmployee, moveTaskByColumn
};


