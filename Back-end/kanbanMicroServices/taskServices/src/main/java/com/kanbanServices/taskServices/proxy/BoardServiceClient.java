package com.kanbanServices.taskServices.proxy;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "BoardServices", url = "http://localhost:8082/api/v1/board")
public interface BoardServiceClient
{

    // check board exist before assigning task
    @GetMapping("/checkBoard/{boardId}")
    Boolean checkBoardExists(@PathVariable String boardId);


    // check if column with a given ID belongs to that specific board
    @GetMapping("/{boardId}/checkColumn/{columnId}")
    Boolean checkColumnExists(@PathVariable String boardId, @PathVariable String columnId);



    // fetch archive column id
    @GetMapping("/calculateArchiveColumnId/{boardId}")
    String calculateArchiveColumnId(@PathVariable String boardId);


    // fetch done column id
    @GetMapping("/calculateDoneColumnId/{boardId}")
    String calculateDoneColumnId(@PathVariable String boardId);


}


/*
when task service call board service method via feign client, it didn't send token itself

so, we have to two options to do that -- (i) manually pass the token -- easy to implement for a few calls but have to change both service and controller layer
                                         (ii) feign interceptor -- automatic send the token but needs more setup / code -- so using this one


 */