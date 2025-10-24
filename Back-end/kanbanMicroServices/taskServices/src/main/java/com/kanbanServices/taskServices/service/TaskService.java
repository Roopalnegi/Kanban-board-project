package com.kanbanServices.taskServices.service;

import com.kanbanServices.taskServices.domain.Task;
import com.kanbanServices.taskServices.exception.MaxTaskLimitReachedException;
import com.kanbanServices.taskServices.exception.TaskAlreadyExistsException;
import com.kanbanServices.taskServices.exception.TaskNotFoundException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;


public interface TaskService
{
    // create a new task
    Task createTask(Task task) throws TaskAlreadyExistsException, MaxTaskLimitReachedException;

    // view single task details
    Task getTaskById(String taskId) throws TaskNotFoundException;

    // view tasks by priority
    List<Task> getTaskByPriority(String priority);

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

    // move task b/w columns -- to do, in-progress, done, archive
    Task moveTaskByColumn(String taskId, String newColumnId, String doneBy) throws TaskNotFoundException;

    // ----------- helper method -----------

    // count days before due date
    Long countDaysBeforeDue(LocalDate updatedAt);

    // get all employee data for assigned To property of task
    Map<Long,String> getAllEmployeeDetails();
}
