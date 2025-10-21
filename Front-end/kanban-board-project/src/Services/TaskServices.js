import axiosInstance from "./axiosConfig";

const baseURL = "http://localhost:8083/api/v1/task";

// get specific board details by id
// const getTaskDetails = async (taskId) => {
//     const response = await axiosInstance.get(`${baseURL}/getTaskById/${taskId}`);
//     return response.data;
    
// };


// get all tasks of specific board id 
const getAllTasksOfBoardId = async (boardId) => {

    const response = await axiosInstance.get(`${baseURL}/getAllTasksOfBoardId/${boardId}`);
    console.log("Tasks fetched:", response.data); // ✅ add this line
    return response.data;
};



// get no.of days left to complete task
const calculateNoOfDays = async (dueDate) => {

    const response = await axiosInstance.get(`${baseURL}/noOfDaysBeforeDue/${dueDate}`);
    return response.data;
};




export {getAllTasksOfBoardId, calculateNoOfDays};


