package com.kanbanServices.taskServices.proxy;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "BoardServices", url = "http://localhost:8082/api/v1/boards")
public interface BoardServiceClient
{
    // check if board exist or not in board service
    @GetMapping("/check/{boardId}")
    Boolean checkBoardExists(@PathVariable Long boardId);

    // check if column exist or not inside a board in board service
    @GetMapping("/columns/check/{columnId}")
    Boolean checkColumnExists(@PathVariable Long columnId);
}
