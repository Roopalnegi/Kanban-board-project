package com.kanbanServices.taskServices.service;

import com.kanbanServices.taskServices.domain.Task;
import com.kanbanServices.taskServices.exception.TaskNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmpProgressReportService
{
    private final BoardValidationService boardValidationService;
    private final TaskServiceImpl taskService;

    @Autowired
    public EmpProgressReportService(BoardValidationService boardValidationService, TaskServiceImpl taskService)
    {
        this.boardValidationService = boardValidationService;
        this.taskService = taskService;
    }


    // produce employee report containing - name, emailId, total task assigned, completed and pending tasks, progress %
    // this code basically produce data like :-
    /*{
       "john@gmail.com":{pendingTasks: 2.0 etc.},
       "james@gmail.com":{},
       }
     */
    public Map<String, Map<String,Object>> getReport() throws TaskNotFoundException
    {
         // get all employee details
        Map<Long,String> allEmployees = taskService.getAllEmployeeDetails();

        // create key-value pair i.e. email --- list of key-value pair
        Map<String,Map<String,Object>> report = new HashMap<>();


        for(Map.Entry<Long,String> entry : allEmployees.entrySet())
        {
            // separate name and id as it is in john-john@gmail.com
            String empName = entry.getValue().split("-")[0].trim();
            String empEmailId = entry.getValue().split("-")[1].trim();

            // get all tasks assigned to a specific employee
            List<Task> empTasks = taskService.getTasksAssignedToEmployee(empEmailId);

            // create another map i.e. key-value pair
            Map<String,Object> progressData = new HashMap<>();

            // variables
            int totalTasks = 0, completedTasks = 0, pendingTasks = 0;
            float progressPer = 0;

            totalTasks = empTasks.size();

            if(totalTasks == 0)
            {
                completedTasks = 0;
                pendingTasks = 0;
                progressPer = 0;
            }

            else
            {
                for(Task task : empTasks)
                {
                    String boardDoneColumnId = boardValidationService.calculateDoneColumnId(task.getBoardId());
                    if(boardDoneColumnId.equals(task.getColumnId()))                    // checking if task columnId is done or not
                    {
                        completedTasks++;
                    }
                }
                pendingTasks = totalTasks - completedTasks;
                progressPer = ((float) completedTasks / totalTasks) * 100.0f;
            }

            progressData.put("totalTasks", totalTasks);
            progressData.put("completedTasks", completedTasks);
            progressData.put("pendingTasks", pendingTasks);
            progressData.put("progressPer", progressPer);
            progressData.put("name", empName);
            progressData.put("email", empEmailId);

            report.put(empEmailId,progressData);
        }

        return report;
    }
}
