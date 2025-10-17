package com.kanbanServices.taskServices.proxy;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "BoardServices", url = "http://localhost:8082/api/v1/boards")
public interface BoardServiceClient
{

    // check board exist before assigning task
    @GetMapping("/checkBoard/{boardId}")
    Boolean checkBoardExists(@PathVariable String boardId);


    // check if column with a given ID belongs to that specific board
    @GetMapping("{boardId}/checkColumn/{columnId}")
    Boolean checkColumnExists(@PathVariable String boardId, int columnId);
}
