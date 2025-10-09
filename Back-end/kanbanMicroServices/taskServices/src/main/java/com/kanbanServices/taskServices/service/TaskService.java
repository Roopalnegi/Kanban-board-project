package com.kanbanServices.taskServices.service;

import com.kanbanServices.taskServices.domain.Task;
import com.kanbanServices.taskServices.exception.TaskAlreadyExistsException;
import com.kanbanServices.taskServices.exception.TaskNotFoundException;

import java.time.LocalDate;
import java.util.List;


public interface TaskService
{
    // add new task
    Task createTask(Task task) throws TaskAlreadyExistsException;

    // get task by id
    Task getTaskById(String taskId) throws TaskNotFoundException;

    // get all tasks in a board
    List<Task> getTaskByBoardId(Long boardId);

    // get all tasks in a column
    List<Task> getTaskByColumnId(Long columnId);

    // get task by priority
    List<Task> getTaskByPriority(String priority);

    // update task by id - title, description status, priority, assigned To, due Date
    Task updatedTask(String taskId, Task updatedDate) throws TaskNotFoundException;

    // delete task by id
    Boolean deleteTask(String taskId) throws TaskNotFoundException;

    // move task b/w columns -- to do, in-progress, done, archive
    Task moveTaskByColumn(String taskId, Long newColumnId) throws TaskNotFoundException;

    // calculate no. of days before due date
    Long countNoOfDaysBeforeDue(LocalDate updatedAt);
}
