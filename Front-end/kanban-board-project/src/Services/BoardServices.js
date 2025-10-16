import React from "react";
import axios from "axios";
import CreateBoard from "../Components/BoardView/CreateBoard";
const BASE_URL="http:/localhost:8080/api/v1/board";

const boardService={
    createdBoard:async(boardData)=>{
        const response= await axios.post(BASE_URL,boardData);
        return response.data;
    },

};

export default boardService;