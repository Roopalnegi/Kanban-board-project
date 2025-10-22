import axiosInstance from "./axiosConfig";

const baseURL = "http://localhost:8082/api/v1/board";

// fetching all baords details
const getBoardDetails = async (boardId) => {
    const response = await axiosInstance.get(`${baseURL}/getBoard/${boardId}`);
    return response.data;
};



// fetching all baords 
const getAllBoards = async () => {
    const response = await axiosInstance.get(`${baseURL}/getAllBoards`);
    return response.data;
};



// creating new board
const createNewBoard = async (newBoard) => {
     const response = await axiosInstance.post(`${baseURL}`, newBoard);
     return response.data;
};



// saving updating baord details
const handleUpdatingBoardInfo = async (boardId, updatedData) => {
  const response = await axiosInstance.put(`${baseURL}/updateBoard/${boardId}`, updatedData);
  return response.data;
};



// deleting board 
const deleteBoard = async (boardId) => {
  const response = await axiosInstance.delete(`${baseURL}/deleteBoard/${boardId}`);
  return response.data;
};




export {getBoardDetails, getAllBoards, createNewBoard, handleUpdatingBoardInfo, deleteBoard};


