package com.kanbanServices.taskServices.service;

import com.kanbanServices.taskServices.domain.Task;
import com.kanbanServices.taskServices.exception.MaxTaskLimitReachedException;
import com.kanbanServices.taskServices.exception.TaskAlreadyExistsException;
import com.kanbanServices.taskServices.exception.TaskNotFoundException;
import com.kanbanServices.taskServices.proxy.UserAuthClient;
import com.kanbanServices.taskServices.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;


@Service
public class TaskServiceImpl implements TaskService
{

    private final TaskRepository taskRepository;
    private final BoardValidationService boardValidationService;
    private final UserAuthClient userAuthClient;

    @Autowired
    public TaskServiceImpl (TaskRepository taskRepository, BoardValidationService boardValidationService, UserAuthClient userAuthClient)
    {
        this.taskRepository = taskRepository;
        this.boardValidationService = boardValidationService;
        this.userAuthClient = userAuthClient;
    }


    // create a new task
    @Override
    public Task createTask(Task task) throws TaskAlreadyExistsException, MaxTaskLimitReachedException
    {
        // validate board and column first
        boardValidationService.validateBoardId(task.getBoardId());
        boardValidationService.validateColumnId(task.getBoardId(), task.getColumnId());

        // check if task already exists by its title and boardId as two tasks can have same title but live in different boards
       if(taskRepository.findByTitleAndBoardId(task.getTitle(), task.getBoardId()).isPresent())
       {
           throw new TaskAlreadyExistsException("Tasks already exists with id : " + task.getTaskId());
       }

       // get archive and done column id from board service
       String archiveColumnId = boardValidationService.calculateArchiveColumnId(task.getBoardId());
       String doneColumnId = boardValidationService.calculateDoneColumnId(task.getBoardId());

       // check task limit for each employee
       if(task.getAssignedTo() != null)
       {
           for (String employee : task.getAssignedTo())
           {
               long activeTask = taskRepository.countActiveTaskByAssignedTo(employee,archiveColumnId,doneColumnId);
               if(activeTask >= 5)
               {
                   throw new MaxTaskLimitReachedException();
               }
           }
       }

       return taskRepository.save(task);
    }



    // view single task details
    @Override
    public Task getTaskById(String taskId) throws TaskNotFoundException
    {
        // check if task is not find by id and then exception
        return taskRepository.findByTaskId(taskId).
                orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));
    }


    // view tasks by priority
    @Override
    public List<Task> getTaskByPriority(String priority)
    {
        return taskRepository.findByPriority(priority);  // may return empty list
    }


    // fetch get all tasks grouped by column in a specific board i.e. Map <columnName, tasks>
    @Override
    public List<Task> getTasksOfBoardId(String boardId) throws TaskNotFoundException
    {
        // validate board first
        boardValidationService.validateBoardId(boardId);

        // if found. get all matching tasks
        return taskRepository.findByBoardId(boardId);

    }


    // update task info - title, description, priority, assigned To, due Date
    @Override
    public Task updatedTask(String taskId, Task updatedTaskData) throws TaskNotFoundException, MaxTaskLimitReachedException
    {
        // validate board and column first
        boardValidationService.validateBoardId(updatedTaskData.getBoardId());
        boardValidationService.validateColumnId(updatedTaskData.getBoardId(), updatedTaskData.getColumnId());

        // get archive and done column id from board service
        String archiveColumnId = boardValidationService.calculateArchiveColumnId(updatedTaskData.getBoardId());
        String doneColumnId = boardValidationService.calculateDoneColumnId(updatedTaskData.getBoardId());


        // check task limit for each assigned employee
        if(updatedTaskData.getAssignedTo() != null)
        {
            for (String employee : updatedTaskData.getAssignedTo())
            {
                long activeTask = taskRepository.countActiveTaskByAssignedTo(employee,archiveColumnId,doneColumnId);

                // subtract 1 if the same task is already assigned to this employee
                Task currentTask = taskRepository.findById(taskId).orElse(null);
                if (currentTask != null && currentTask.getAssignedTo().contains(employee))
                {
                    activeTask--;
                }

                if(activeTask >= 5)
                {
                    throw new MaxTaskLimitReachedException();
                }
            }
        }



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



    // archive task
    @Override
    public Task archiveTask(String taskId) throws TaskNotFoundException
    {
        // check if task exist or not
        Task task = taskRepository.findByTaskId(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));

        // validate board and column first
        boardValidationService.validateBoardId(task.getBoardId());
        boardValidationService.validateColumnId(task.getBoardId(), task.getColumnId());

        // if exist , then store current column id into previous column id variable
        task.setPreviousColumnId(task.getColumnId());

        // fetch archive column id -- always at last
        String archiveColumnId = boardValidationService.calculateArchiveColumnId(task.getBoardId());

        // update task to move into the archive column
        task.setPreviousColumnId(task.getColumnId());
        task.setColumnId(archiveColumnId);

        return taskRepository.save(task);

    }



    // restore task from archive
    @Override
    public Task restoreTaskFromArchive(String taskId) throws TaskNotFoundException
    {
        // check if task exist or not
        Task restoreTask = taskRepository.findByTaskId(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));

        // validate board and column first
        boardValidationService.validateBoardId(restoreTask.getBoardId());
        boardValidationService.validateColumnId(restoreTask.getBoardId(), restoreTask.getColumnId());

        restoreTask.setColumnId(restoreTask.getPreviousColumnId());
        restoreTask.setPreviousColumnId("null");      // after restore, clean the previous column id

        return taskRepository.save(restoreTask);
    }



    // delete task
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


    // move task b/w columns -- to do, in-progress, done, archive
    @Override
    public Task moveTaskByColumn(String taskId, String newColumnId) throws TaskNotFoundException
    {
        return taskRepository.findById(taskId)
                .map(t ->{ t.setColumnId(newColumnId);
                                return taskRepository.save(t);
                               })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));
    }


    // -------------- helper methods ----------------

    // count days before due date
    @Override
    public Long countDaysBeforeDue(LocalDate dueDate)
    {
        // calculating current date
        LocalDate todayDate = LocalDate.now();

        // for handling the situation here due date crossed current date -- return -1
        long days = ChronoUnit.DAYS.between(todayDate,dueDate);
        return days < 0 ? -1 : days;
    }


    //  get all employee data for assignedTo property of task
    @Override
    public Map<Long,String> getAllEmployeeDetails()
    {
        return userAuthClient.fetchAllEmployeeDetails();
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