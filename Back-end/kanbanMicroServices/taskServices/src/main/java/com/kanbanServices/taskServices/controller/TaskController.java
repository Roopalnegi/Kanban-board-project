package com.kanbanServices.taskServices.controller;

import com.kanbanServices.taskServices.domain.Task;
import com.kanbanServices.taskServices.exception.MaxTaskLimitReachedException;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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


    // method to handle creating a new task
    @PostMapping("/createTask")
    public ResponseEntity<?> handleCreateTask(@RequestBody Task newTask, HttpServletRequest request)
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
        catch (MaxTaskLimitReachedException e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
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



    // method to handle getting single task details by id
    @GetMapping("/getTaskById/{taskId}")
    public ResponseEntity<?> handleGetTaskById(@PathVariable String taskId)
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


    // method to handle fetching all tasks for a particular board
    @GetMapping("/getAllTasksOfBoardId/{boardId}")
    public ResponseEntity<?> handleGetAllTasksOfBoardId(@PathVariable String boardId)
    {
        try
        {
            List<Task> matchTaskList = taskService.getTasksOfBoardId(boardId);
            return new ResponseEntity<>(matchTaskList, HttpStatus.OK);
        }
        catch (TaskNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    // method to handle updating task info (title,description,priority,assigned to, due date) - admin secured
    @PutMapping("/updateTask/{taskId}")
    public ResponseEntity<?> handleUpdateTask(@PathVariable String taskId, @RequestBody Task updatedTaskData, HttpServletRequest request)
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
        catch (MaxTaskLimitReachedException e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
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


    // method to handle archive task
    @PutMapping("/archiveTask/{taskId}")
    public ResponseEntity<?> handleArchiveTask(@PathVariable String taskId)
    {
        try
        {
            Task archiveTask = taskService.archiveTask(taskId);
            return new ResponseEntity<>(archiveTask,HttpStatus.OK);
        }
        catch (TaskNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // method to handle restoring task from archive
    @PutMapping("/restoreTask/{taskId}")
    public ResponseEntity<?> handleRestoreTask(@PathVariable String taskId)
    {
        try
        {
            Task restoreTask = taskService.restoreTaskFromArchive(taskId);
            return new ResponseEntity<>(restoreTask,HttpStatus.OK);
        }
        catch (TaskNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // method to handle deleting task
    @DeleteMapping("/deleteTask/{taskId}")
    public ResponseEntity<?> handleDeleteTask(@PathVariable String taskId, HttpServletRequest request)
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


    // method to handle deleting all task of a board
    @DeleteMapping("/deleteAllTasksByBoard/{boardId}")
    public ResponseEntity<?> handleDeleteAllTasksOfBoard(@PathVariable String boardId)
    {
        try
        {
            boolean flag = taskService.deleteAllTasksOfBoard(boardId);
            return new ResponseEntity<>(flag,HttpStatus.OK);
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



    // method to handle moving task b/w columns - employee secured
    @PutMapping("/moveTaskByColumn/{taskId}/{columnId}")
    public ResponseEntity<?> handleMoveTaskByColumn(@PathVariable String taskId, @PathVariable String columnId, @RequestBody Map<String,String> sentBy, HttpServletRequest request)
    {
        try
        {
            // check if user is employee
            requestHelper.checkEmployeeRole(request);

            // extract employee name
            String username = sentBy.get("username");
            Task task = taskService.moveTaskByColumn(taskId,columnId,username);
            return new ResponseEntity<>(task,HttpStatus.OK);
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


    // ----------- helper methods -----------

    // method to handle counting days before due date
    @GetMapping("/noOfDaysBeforeDue/{dueDate}")
    public ResponseEntity<?> handleCountNoOfDaysBeforeDue(@PathVariable LocalDate dueDate)
    {
        try
        {
            Long days = taskService.countDaysBeforeDue(dueDate);
            return new ResponseEntity<>(days,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle fetching all employee details for assigned To property of task
    @GetMapping("/fetchAllEmployeeDetails")
    public ResponseEntity<?> handleFetchAllEmployeeDetails(HttpServletRequest request)
    {
        try
        {
            // check if user is admin
            requestHelper.checkAdminRole(request);

            Map<Long, String> employees = taskService.getAllEmployeeDetails();
            return new ResponseEntity<>(employees,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // ----------- searching and filtering endpoints  acc.per board -----------------

    // method to handle filtering task by priority
    @GetMapping("/filterTaskByPriority/{boardId}")
    public ResponseEntity<?> handleFilterTaskByPriority(@PathVariable String boardId, @RequestParam("priority") String priority)
    {
        try
        {
            List<Task> tasks = taskService.filterTaskByPriority(boardId, priority);
            if(tasks == null)
                tasks = new ArrayList<>();       // return empty list if no task is found instead of 404 (Not Found)
            return new ResponseEntity<>(tasks,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle filtering task created on specific date -- user want to see how many task is created at particular date
    @GetMapping("/filterTaskByCreatedAt/{boardId}")
    public ResponseEntity<?> handleFilterTaskByCreatedDate(@PathVariable String boardId, @RequestParam("createdAt") LocalDate date)
    {
        try
        {
            List<Task> tasks = taskService.filterTaskByCreatedDate(boardId, date);
            if(tasks == null)
                tasks = new ArrayList<>();       // return empty list if no task is found instead of 404 (Not Found)
            return new ResponseEntity<>(tasks,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // get tasks of specific employee
    @GetMapping("/getTasksByEmployee/{email}")
    public ResponseEntity<?> handleGetTasksByEmployee(@PathVariable String email, HttpServletRequest request)
    {
        try
        {
            requestHelper.checkEmployeeRole(request); // verify token role is EMPLOYEE

            List<Task> assignedTasks = taskService.getTasksAssignedToEmployee(email);
            return new ResponseEntity<>(assignedTasks, HttpStatus.OK);
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


    // method to handle filtering task due on specific date  -- user want to see how many task have deadline today
    @GetMapping("/filterTaskByDueDate/{boardId}")
    public ResponseEntity<?> handleFilterTaskByDueDate(@PathVariable String boardId, @RequestParam("dueDate") LocalDate date)
    {
        try
        {
            List<Task> tasks = taskService.filterTaskByDueDate(boardId, date);
            if(tasks == null)
                tasks = new ArrayList<>();       // return empty list if no task is found instead of 404 (Not Found)
            return new ResponseEntity<>(tasks,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle filtering task created on specific month and year
    @GetMapping("/filterTaskByCreatedMonth/{boardId}")
    public ResponseEntity<?> handleFilterTaskByCreatedMonth(@PathVariable String boardId, @RequestParam("month") int month, @RequestParam("year") int year)
    {
        try
        {
            List<Task> tasks = taskService.filterTaskByCreatedMonth(boardId, month, year);
            if(tasks == null)
                tasks = new ArrayList<>();       // return empty list if no task is found instead of 404 (Not Found)
            return new ResponseEntity<>(tasks,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle filtering task due on specific month and year
    @GetMapping("/filterTaskByDueMonth/{boardId}")
    public ResponseEntity<?> handleFilterTaskByDueMonth(@PathVariable String boardId, @RequestParam("month") int month, @RequestParam("year") int year)
    {
        try
        {
            List<Task> tasks = taskService.filterTaskByDueMonth(boardId, month, year);
            if(tasks == null)
                tasks = new ArrayList<>();       // return empty list if no task is found instead of 404 (Not Found)
            return new ResponseEntity<>(tasks,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to handle searching tasks  by any -- title / description / assigned to
    @GetMapping("/{boardId}/searchTaskBy")
    public ResponseEntity<?> handleSearchTask(@PathVariable String boardId, @RequestParam("keyword") String keyword)
    {
        try
        {
            List<Task> tasks = taskService.searchTasks(boardId, keyword);
            if(tasks == null)
                tasks = new ArrayList<>();       // return empty list if no task is found instead of 404 (Not Found)
            return new ResponseEntity<>(tasks,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }








}

