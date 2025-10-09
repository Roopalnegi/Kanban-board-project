package com.kanbanServices.taskServices.controller;

import com.kanbanServices.taskServices.domain.Task;
import com.kanbanServices.taskServices.exception.TaskAlreadyExistsException;
import com.kanbanServices.taskServices.exception.TaskNotFoundException;
import com.kanbanServices.taskServices.service.TaskService;
import com.kanbanServices.taskServices.utility.RequestHelper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/v1/task")
public class TaskController
{
    private final TaskService taskService;
    private final RequestHelper requestHelper;

    @Autowired
    public TaskController(TaskService taskService, RequestHelper requestHelper)
    {
        this.taskService = taskService;
        this.requestHelper = requestHelper;
    }

    // method to handle creating new task
    @PostMapping("/createTask")
    public ResponseEntity<?> handleCreateTask(@RequestBody Task newTask, HttpServletRequest request) throws TaskAlreadyExistsException
    {
        try
        {
            // check if user is admin
            requestHelper.checkAdminRole(request);

            Task savedTask = taskService.createTask(newTask);
            return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
        }
        catch (TaskAlreadyExistsException e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.CONFLICT);
        }
        catch(AccessDeniedException e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle get task by it
    @GetMapping("/getTaskById/{taskId}")
    public ResponseEntity<?> handleGetTaskById(@PathVariable String taskId) throws TaskNotFoundException
    {
       try
       {
           Task foundTask = taskService.getTaskById(taskId);
           return new ResponseEntity<>(foundTask,HttpStatus.OK);
       }
       catch (TaskNotFoundException e)
       {
           return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
       }
       catch (Exception e)
       {
           return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
       }
    }



    // method to handle get task by board id
    @GetMapping("/getTaskByBoardId/{boardId}")
    public ResponseEntity<?> handleGetTaskByBoardId(@PathVariable Long boardId)
    {
        try
        {
            List<Task> foundTaskList = taskService.getTaskByBoardId(boardId);
            return new ResponseEntity<>(foundTaskList,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle get task by column id
    @GetMapping("/getTaskByColumnId/{columnId}")
    public ResponseEntity<?> handleGetTaskByColumnId(@PathVariable Long columnId)
    {
        try
        {
            List<Task> foundTaskList = taskService.getTaskByColumnId(columnId);
            return new ResponseEntity<>(foundTaskList,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // method to handle get task by priority
    @GetMapping("/getTaskByPriority/{priority}")
    public ResponseEntity<?> handleGetTaskByPriority(@PathVariable String priority)
    {
        try
        {

            List<Task> foundTaskList = taskService.getTaskByPriority(priority);
            return new ResponseEntity<>(foundTaskList,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle updating task (title,description,column Id,priority,assigned to, due date)
    @PutMapping("/updateTask/{taskId}")
    public ResponseEntity<?> handleUpdateTask(@PathVariable String taskId, @RequestBody Task updatedTaskData, HttpServletRequest request) throws TaskNotFoundException
    {
        try
        {
            // check if user is admin
            requestHelper.checkAdminRole(request);

            Task updatedTask = taskService.updatedTask(taskId,updatedTaskData);
            return new ResponseEntity<>(updatedTask,HttpStatus.OK);
        }
        catch (TaskNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (AccessDeniedException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle deleting task
    @DeleteMapping("/deleteTask/{taskId}")
    public ResponseEntity<?> handleDeleteTask(@PathVariable String taskId, HttpServletRequest request) throws TaskNotFoundException
    {
        try
        {
            // check if user is admin
            requestHelper.checkAdminRole(request);

            boolean flag = taskService.deleteTask(taskId);
            return new ResponseEntity<>(flag,HttpStatus.OK);
        }
        catch (TaskNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch(AccessDeniedException e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.FORBIDDEN);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle moving task b/w columns (update task status)
    @PutMapping("/moveTaskByColumn/{taskId}/{columnId}")
    public ResponseEntity<?> handleMoveTaskByColumn(@PathVariable String taskId, @PathVariable Long columnId) throws TaskNotFoundException
    {
        try
        {
            Task task = taskService.moveTaskByColumn(taskId,columnId);
            return new ResponseEntity<>(task,HttpStatus.OK);
        }
        catch (TaskNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle counting no of days before due date
    @GetMapping("/noOfDaysBeforeDue/{dueDate}")
    public ResponseEntity<?> handleCountNoOfDaysBeforeDue(@PathVariable LocalDate dueDate)
    {
        try
        {
            Long days = taskService.countNoOfDaysBeforeDue(dueDate);
            return new ResponseEntity<>(days,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

