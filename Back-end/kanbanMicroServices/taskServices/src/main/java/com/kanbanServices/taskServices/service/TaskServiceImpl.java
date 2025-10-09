package com.kanbanServices.taskServices.service;

import com.kanbanServices.taskServices.domain.Task;
import com.kanbanServices.taskServices.exception.TaskAlreadyExistsException;
import com.kanbanServices.taskServices.exception.TaskNotFoundException;
import com.kanbanServices.taskServices.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
                .map(t -> {
                                 t.setTitle(updatedTaskData.getTitle());
                                 t.setTask_description(updatedTaskData.getTask_description());
                                 t.setPriority(updatedTaskData.getPriority());
                                 t.setAssignedTo(updatedTaskData.getAssignedTo());
                                 t.setDueDate(updatedTaskData.getDueDate());
                                 return taskRepository.save(t);
                                })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));
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
    public Long countNoOfDaysBeforeDue(LocalDate dueDate)
    {
        // calculating current date
        LocalDate todayDate = LocalDate.now();

        // for handling the situation here due date crossed current date -- return -1
        long days = ChronoUnit.DAYS.between(todayDate,dueDate);
        return days < 0 ? -1 : days;
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