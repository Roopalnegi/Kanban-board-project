import axiosInstance from "./axiosConfig";

const baseURL = "http://localhost:8082/api/v1/board";


// add column in a board
const addColumnToBoard = async (boardId, newColumn) => {
    const response = await axiosInstance.post(`${baseURL}/${boardId}/createColumn`,newColumn);
    return response.data;
};



// update column name in a board
const updateColumnName = async (boardId, columnId, columnNewName) => {
   // {columnNewName} -- send as JSON Object since request accept json type and columnNewName is string  
   const response = await axiosInstance.put(`${baseURL}/${boardId}/updateColumnName/${columnId}`, {columnNewName});
   return response.data;
};


// delete a column from a board
const deleteColumn = async (boardId, columnId) => {
    const response = await axiosInstance.delete(`${baseURL}/${boardId}/deleteColumn/${columnId}`);
    return response.data;  
};



export {addColumnToBoard, updateColumnName, deleteColumn};