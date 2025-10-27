package com.kanbanServices.taskServices.service;

import com.kanbanServices.taskServices.domain.Task;
import com.kanbanServices.taskServices.exception.MaxTaskLimitReachedException;
import com.kanbanServices.taskServices.exception.TaskAlreadyExistsException;
import com.kanbanServices.taskServices.exception.TaskNotFoundException;
import com.kanbanServices.taskServices.proxy.NotificationServiceClient;
import com.kanbanServices.taskServices.proxy.UserAuthClient;
import com.kanbanServices.taskServices.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class TaskServiceImpl implements TaskService
{

    private final TaskRepository taskRepository;
    private final BoardValidationService boardValidationService;
    private final UserAuthClient userAuthClient;
    private final NotificationServiceClient notificationClient;

    @Autowired
    public TaskServiceImpl (TaskRepository taskRepository, BoardValidationService boardValidationService, UserAuthClient userAuthClient, NotificationServiceClient notificationClient)
    {
        this.taskRepository = taskRepository;
        this.boardValidationService = boardValidationService;
        this.userAuthClient = userAuthClient;
        this.notificationClient = notificationClient;
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

        // fetch employee details map: email -> name
        Map<Long, String> employeeMap = userAuthClient.fetchAllEmployeeDetails();

       // check task limit for each employee
       if(task.getAssignedTo() != null)
       {
           for (String employeeEmail : task.getAssignedTo())
           {
               long activeTask = taskRepository.countActiveTaskByAssignedTo(employeeEmail,archiveColumnId,doneColumnId);
               if(activeTask > 5)
               {
                   // find employee name by matching email in the map values
                   String empName = employeeMap.values()      // gives all "name - email" strings.
                                              .stream()
                                              .filter(val -> val.contains(employeeEmail))   //  find the value containing email
                                              .findFirst()                         // find the first match
                                              .orElse(employeeEmail); // fallback to email if not found any name
                   throw new MaxTaskLimitReachedException( empName + " exceeds task limit : cannot assign more than 5 task !");

               }
           }
       }

       Task savedTask =  taskRepository.save(task);

       // send notification per assigned employee
       if(savedTask.getAssignedTo() != null)
        {
            sendNotification(savedTask, "You have been assigned a new task: " + savedTask.getTitle(), "Admin", savedTask.getAssignedTo());
        }

       return savedTask;
    }



    // view single task details
    @Override
    public Task getTaskById(String taskId) throws TaskNotFoundException
    {
        // check if task is not find by id and then exception
        return taskRepository.findByTaskId(taskId).
                orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));
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

        // fetch employee details map: email -> name
        Map<Long, String> employeeMap = userAuthClient.fetchAllEmployeeDetails();

        // check task limit for each assigned employee
        if(updatedTaskData.getAssignedTo() != null)
        {
            for (String employeeEmail : updatedTaskData.getAssignedTo())
            {
                long activeTask = taskRepository.countActiveTaskByAssignedTo(employeeEmail,archiveColumnId,doneColumnId);

                // subtract 1 if the same task is already assigned to this employee
                Task currentTask = taskRepository.findById(taskId).orElse(null);
                if (currentTask != null && currentTask.getAssignedTo().contains(employeeEmail))
                {
                    activeTask--;
                }

                if(activeTask > 5)
                {
                    // find employee name by matching email in the map values
                    String empName = employeeMap.values()      // gives all "name - email" strings.
                                                .stream()
                                                .filter(val -> val.contains(employeeEmail))   //  find the value containing email
                                                .findFirst()                         // find the first match
                                                .orElse(employeeEmail); // fallback to email if not found any name

                    throw new MaxTaskLimitReachedException( empName + " exceeds task limit : cannot assign more than 5 task !");
                }
            }
        }



        Task savedUpdatedTask =  taskRepository.findById(taskId)
                .map(t -> {
                                 t.setTitle(updatedTaskData.getTitle());
                                 t.setTask_description(updatedTaskData.getTask_description());
                                 t.setPriority(updatedTaskData.getPriority());
                                 t.setAssignedTo(updatedTaskData.getAssignedTo());
                                 t.setDueDate(updatedTaskData.getDueDate());
                                 return taskRepository.save(t);
                                })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));

        // send notification per assigned employee
        if(savedUpdatedTask.getAssignedTo() != null)
        {
            sendNotification(savedUpdatedTask, "You have been assigned a new task: " + savedUpdatedTask.getTitle(), "Admin", savedUpdatedTask.getAssignedTo());
        }
        return savedUpdatedTask;
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

        // save task
        Task savedTask = taskRepository.save(task);

        // send notification
        sendNotification(savedTask, "Task moved to Archive", "Admin", List.of("All"));

        // return updated task
        return savedTask;
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

        // save task
        Task savedTask = taskRepository.save(restoreTask);

        // send notification
        sendNotification(savedTask, "Task moved to " + savedTask.getColumnId(), "Admin", List.of("All"));


        // return updated task
        return savedTask;
    }



    // delete task
    @Override
    public Boolean deleteTask(String taskId) throws TaskNotFoundException
    {
        Task foundTask = taskRepository.findById(taskId)
                             .orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));

        taskRepository.deleteById(taskId);

        // send notification by using map
        sendNotification(foundTask, "Task deleted by Admin", "Admin", List.of("All"));

        return true;
    }


    // delete all tasks of a board
    @Override
    public Boolean deleteAllTasksOfBoard(String boardId) throws TaskNotFoundException
    {
        List<Task> tasks = getTasksOfBoardId(boardId);

        if(tasks.isEmpty())
            return true;

        // extract id's because deleteAllById accept List of id's
        List<String> taskIds = tasks.stream()
                                    .map(Task::getTaskId)
                                    .collect(Collectors.toList());

        taskRepository.deleteAllById(taskIds);

        return true;
    }


    // move task b/w columns -- to do, in-progress, done, archive
    @Override
    public Task moveTaskByColumn(String taskId, String newColumnId, String doneBy) throws TaskNotFoundException
    {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with task id : " + taskId));

        // store previous column for notification
        task.setPreviousColumnId(task.getColumnId());
        task.setColumnId(newColumnId);

        // save task
        Task savedTask = taskRepository.save(task);

        // send notification
        String newColumnName = boardValidationService.getColumnNameBy(task.getBoardId(), task.getColumnId());
        sendNotification(task, "Task moved to " + newColumnName, doneBy, List.of("All"));

        return savedTask;
    }

    // get tasks of specific employee
    @Override
    public List<Task> getTasksAssignedToEmployee(String email) throws TaskNotFoundException
    {
        List<Task> allTasks = taskRepository.findAll();

        List<Task> assignedTasks = allTasks.stream()
                .filter(task -> task.getAssignedTo() != null && task.getAssignedTo().contains(email))
                .toList();

        if (assignedTasks.isEmpty())
        {
            throw new TaskNotFoundException("No tasks found assigned to " + email);
        }

        return assignedTasks;
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


    // method to send notification to notification service
    private void sendNotification(Task task, String message, String sentBy, List<String> recipients)
    {
        if (recipients == null || recipients.isEmpty())
            return;
      try
      {
          // If "All" is passed, replace it with all employee emails
          if (recipients.contains("All"))
          {
              recipients = userAuthClient.fetchAllEmployeeDetails() // Map<Long, String> with "Name - email"
                      .values()
                      .stream()
                      .map(val -> {
                          // since value format: "Name - email"
                          if (val.contains("-")) {
                              return val.split("-")[1].trim(); // extract email
                          }
                          return val.trim();
                      })
                      .collect(Collectors.toList());

              recipients.add("roopalnegi147@gmail.com"); // Add admin email(s) manually since there is only one admin ... later improve for scalability
          }

        Map<String, Object> notificationMap = new HashMap<>();
        notificationMap.put("taskName", task.getTitle());
        notificationMap.put("message", message);
        notificationMap.put("sentBy", sentBy);
        notificationMap.put("recipients", recipients);

        notificationClient.sendNotificationData(notificationMap);
        // debugging
        System.out.println("Sending notification to: " + recipients);
      }
      catch (Exception e)
      {
          System.out.println("Failed to send notification !!!!");
          e.printStackTrace();
      }
    }


    // ----------- searching and filtering methods  acc.per board -----------------

    // filter task by priority
    @Override
    public List<Task> filterTaskByPriority(String boardId, String priority)
    {
        List<Task> tasks = taskRepository.findByBoardIdAndPriority(boardId, priority);
        if(tasks.isEmpty())
        {
            return new ArrayList<>();
        }
        return tasks;
    }


    // filter task created on specific date -- user want to see how many task is created at particular date
    @Override
    public List<Task> filterTaskByCreatedDate(String boardId, LocalDate date)
    {
        List<Task> tasks = taskRepository.findByBoardIdAndCreatedAt(boardId, date);
        if(tasks.isEmpty())
        {
            return new ArrayList<>();
        }
        return tasks;
    }


    // filter task due on specific date  -- user want to see how many task have deadline today
    @Override
    public List<Task> filterTaskByDueDate(String boardId, LocalDate date)
    {
        List<Task> tasks = taskRepository.findByBoardIdAndDueDate(boardId, date);
        if(tasks.isEmpty())
        {
            return new ArrayList<>();
        }
        return tasks;
    }


    // filter tasks created on specific month and year
    @Override
    public List<Task> filterTaskByCreatedMonth(String boardId,int month, int year)
    {
        List<Task> tasks = taskRepository.findByCreatedMonthAndYear(boardId, month, year);
        if(tasks.isEmpty())
        {
            return new ArrayList<>();
        }
        return tasks;
    }


    // filter tasks due on specific month and year
    @Override
    public List<Task> filterTaskByDueMonth(String boardId,int month, int year)
    {
        List<Task> tasks = taskRepository.findByDueMonthAndYear(boardId,month, year);
        if(tasks.isEmpty())
        {
            return new ArrayList<>();
        }
        return tasks;
    }


    // search by any -- title / description / assigned to
    @Override
    public List<Task> searchTasks(String boardId, String keyword)
    {
        List<Task> tasks = taskRepository.searchTasksByKeyword(boardId,keyword);
        if(tasks.isEmpty())
        {
            return new ArrayList<>();
        }
        return tasks;
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