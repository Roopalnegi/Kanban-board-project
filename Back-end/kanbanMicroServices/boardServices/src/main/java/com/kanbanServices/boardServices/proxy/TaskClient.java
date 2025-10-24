package com.kanbanServices.boardServices.proxy;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "TaskService", url = "http://localhost:8083/api/v1/task")
public interface TaskClient
{
    @DeleteMapping("/deleteAllTasksByBoard/{BoardId}")
    ResponseEntity<?> handleDeleteAllTasksOfBoard(@PathVariable String BoardId);
}
