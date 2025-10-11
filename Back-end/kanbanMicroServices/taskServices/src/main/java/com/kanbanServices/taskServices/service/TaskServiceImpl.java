package com.kanbanServices.taskServices.service;

import com.kanbanServices.taskServices.domain.Task;
import com.kanbanServices.taskServices.exception.TaskAlreadyExistsException;
import com.kanbanServices.taskServices.exception.TaskNotFoundException;
import com.kanbanServices.taskServices.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskRejectedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService
{

    private final TaskRepository taskRepository;

    @Autowired
    public TaskServiceImpl (TaskRepository taskRepository)
    {
        this.taskRepository = taskRepository;
    }


    @Override
    public Task createTask(Task task) throws TaskAlreadyExistsException
    {
        // check if task already exists by its title and boardId as two tasks can have same title but live in different boards
       if(taskRepository.findByTitleAndBoardId(task.getTitle(), task.getBoardId()).isPresent())
       {
           throw new TaskAlreadyExistsException("Tasks already exists with id : " + task.getTaskId());
       }

       // check task limit for each employee
       validateTaskAssignmentLimit(task);

       return taskRepository.save(task);
    }


    @Override
    public Task getTaskById(String taskId) throws TaskNotFoundException
    {
        // check if task is not find by id and then exception
        return taskRepository.findByTaskId(taskId).
                orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));
    }


    @Override
    public List<Task> getTaskByBoardId(Long boardId)
    {
        return taskRepository.findByBoardId(boardId);  // may return empty list - appropriate response will be in frontend
    }


    @Override
    public List<Task> getTaskByColumnId(Long columnId)
    {
        return taskRepository.findByColumnId(columnId);   // may return empty list
    }


    @Override
    public List<Task> getTaskByPriority(String priority)
    {
        return taskRepository.findByPriority(priority);  // may return empty list
    }


    @Override
    public Task updatedTask(String taskId, Task updatedTaskData) throws TaskNotFoundException
    {
        return taskRepository.findById(taskId)
                .map(existingTask -> {
                                 existingTask.setTitle(updatedTaskData.getTitle());
                                 existingTask.setTask_description(updatedTaskData.getTask_description());
                                 existingTask.setPriority(updatedTaskData.getPriority());
                                 existingTask.setAssignedTo(updatedTaskData.getAssignedTo());
                                 // check task limit
                                 validateTaskAssignmentLimit(existingTask);
                                 existingTask.setDueDate(updatedTaskData.getDueDate());
                                 return taskRepository.save(existingTask);
                                })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));
    }


    @Override
    public Task archiveTask(String taskId) throws TaskNotFoundException
    {
        // check if task exist or not
        Task archiveTask = taskRepository.findByTaskId(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));

        // if exist , then store current column id into previous column id variable
        archiveTask.setPreviousColumnId(archiveTask.getColumnId());

        // updated now column id to archive column i.e. 4
        archiveTask.setColumnId(4L);       // assuming archive column id is 4

        return taskRepository.save(archiveTask);
    }


    @Override
    public Task restoreTaskFromArchive(String taskId) throws TaskNotFoundException
    {
        // check if task exist or not
        Task restoreTask = taskRepository.findByTaskId(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));

        restoreTask.setColumnId(restoreTask.getPreviousColumnId());
        restoreTask.setPreviousColumnId(null);      // after restore, clean the previous column id

        return taskRepository.save(restoreTask);
    }


    @Override
    public Boolean deleteTask(String taskId) throws TaskNotFoundException
    {
        if(taskRepository.findById(taskId).isEmpty())
        {
            throw new TaskNotFoundException("Task not found with task id : " + taskId);
        }

        taskRepository.deleteById(taskId);
        return true;
    }


    @Override
    public Task moveTaskByColumn(String taskId, Long newColumnId) throws TaskNotFoundException
    {
        return taskRepository.findById(taskId)
                .map(t ->{ t.setColumnId(newColumnId);
                                return taskRepository.save(t);
                               })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));
    }



    @Override
    public Long countDaysBeforeDue(LocalDate dueDate)
    {
        // calculating current date
        LocalDate todayDate = LocalDate.now();

        // for handling the situation here due date crossed current date -- return -1
        long days = ChronoUnit.DAYS.between(todayDate,dueDate);
        return days < 0 ? -1 : days;
    }


    // helper method to validate task assignment limits
    private  void validateTaskAssignmentLimit(Task task)
    {
        for (String userEmail : task.getAssignedTo())
        {
            long taskCount = taskRepository.countActiveTaskByAssignedTo(userEmail);

            if (taskCount >= 5)
            {
                throw new IllegalArgumentException("Can't assign task. Employee has reached its limit");
            }
        }
    }

}


/*
ChronicUnit -- an enum in Java (java.time.temporal.ChronoUnit).
            -- defines units of time that you can use to calculate differences between date-time objects.

-- ChronoUnit.DAYS → deals with days
-- between() method to calculate the difference between two date-time

Syntax:- long difference = ChronoUnit.DAYS.between(startDateTime, endDateTime);
         -- this method return negative if endDateTime is in the past / crossed startDateTime

 */