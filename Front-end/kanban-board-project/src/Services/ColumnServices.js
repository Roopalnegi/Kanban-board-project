import axiosInstance from "./axiosConfig";

const baseURL = "http://localhost:8082/api/v1/board";


// add column in a board
const addColumnToBoard = async (boardId, newColumn) => {
    const response = await axiosInstance.post(`${baseURL}/${boardId}/createColumn`,newColumn);
    return response.data;
};



// update column name in a board
const updateColumnName = async (boardId, columnId, updatedColumn) => {  
   const response = await axiosInstance.put(`${baseURL}/${boardId}/updateColumnName/${columnId}`, updatedColumn);
   return response.data;
};



// delete a column from a board
const deleteColumn = async (boardId, columnId) => {
    const response = await axiosInstance.delete(`${baseURL}/${boardId}/deleteColumn/${columnId}`);
    return response.data;  
};


// fetch archive column id
const getArchiveColumnId = async (boardId) => {
   const response = await axiosInstance.get(`${baseURL}/calculateArchiveColumnId/${boardId}`);
   return response.data;
};


export {addColumnToBoard, updateColumnName, deleteColumn, getArchiveColumnId};