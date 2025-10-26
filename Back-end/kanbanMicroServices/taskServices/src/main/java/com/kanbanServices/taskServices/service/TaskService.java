package com.kanbanServices.taskServices.service;

import com.kanbanServices.taskServices.domain.Task;
import com.kanbanServices.taskServices.exception.MaxTaskLimitReachedException;
import com.kanbanServices.taskServices.exception.TaskAlreadyExistsException;
import com.kanbanServices.taskServices.exception.TaskNotFoundException;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;


public interface TaskService
{
    // create a new task
    Task createTask(Task task) throws TaskAlreadyExistsException, MaxTaskLimitReachedException;

    // view single task details
    Task getTaskById(String taskId) throws TaskNotFoundException;

    // fetch get all tasks grouped by column in a specific board
    List<Task> getTasksOfBoardId(String boardId) throws TaskNotFoundException;

    // update task info - title, description, priority, assigned To, due Date
    Task updatedTask(String taskId, Task updatedDate) throws TaskNotFoundException, MaxTaskLimitReachedException;

    // archive task
    Task archiveTask(String taskId) throws TaskNotFoundException;

    // restore task from archive
    Task restoreTaskFromArchive(String taskId) throws TaskNotFoundException;

    // delete task
    Boolean deleteTask(String taskId) throws TaskNotFoundException;

    // delete all tasks of a board
    Boolean deleteAllTasksOfBoard(String boardId) throws TaskNotFoundException;

    // move task b/w columns -- to do, in-progress, done, archive
    Task moveTaskByColumn(String taskId, String newColumnId, String doneBy) throws TaskNotFoundException;

    // ----------- helper method -----------

    // count days before due date
    Long countDaysBeforeDue(LocalDate updatedAt);

    // get all employee data for assigned To property of task
    Map<Long,String> getAllEmployeeDetails();



    // ----------- searching and filtering methods  acc.per board -----------------

    // filter task by priority
    List<Task> filterTaskByPriority(String boardId, String priority);


    // filter task created on specific date -- user want to see how many task is created at particular date
    List<Task> filterTaskByCreatedDate(String boardId, LocalDate date);


    // filter task due on specific date  -- user want to see how many task have deadline today
    List<Task> filterTaskByDueDate(String boardId, LocalDate date);


    // filter tasks created on specific month and year
    List<Task> filterTaskByCreatedMonth(String boardId,int month, int year);


    // filter tasks due on specific month and year
    List<Task> filterTaskByDueMonth(String boardId,int month, int year);


    // search by any -- title / description / assigned to
    List<Task> searchTasks(String boardId, String keyword);



}

