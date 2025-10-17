package com.kanbanServices.taskServices.service;

import com.kanbanServices.taskServices.domain.Task;
import com.kanbanServices.taskServices.exception.TaskAlreadyExistsException;
import com.kanbanServices.taskServices.exception.TaskNotFoundException;

import java.time.LocalDate;
import java.util.List;


public interface TaskService
{
    // create a new task
    Task createTask(Task task) throws TaskAlreadyExistsException;

    // view single task details
    Task getTaskById(String taskId) throws TaskNotFoundException;

    // view tasks by priority
    List<Task> getTaskByPriority(String priority);

    // update task info - title, description, priority, assigned To, due Date
    Task updatedTask(String taskId, Task updatedDate) throws TaskNotFoundException;

    // archive task
    public Task archiveTask(String taskId) throws TaskNotFoundException;

    // restore task from archive
    public Task restoreTaskFromArchive(String taskId) throws TaskNotFoundException;

    // delete task
    Boolean deleteTask(String taskId) throws TaskNotFoundException;

    // move task b/w columns -- to do, in-progress, done, archive
    Task moveTaskByColumn(String taskId, Long newColumnId) throws TaskNotFoundException;

    // count days before due date
    Long countDaysBeforeDue(LocalDate updatedAt);
}
