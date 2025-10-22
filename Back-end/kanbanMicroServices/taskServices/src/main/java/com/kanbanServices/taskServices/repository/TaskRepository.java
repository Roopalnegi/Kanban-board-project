package com.kanbanServices.taskServices.repository;

import com.kanbanServices.taskServices.domain.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends MongoRepository<Task,String>
{
    // find task by title by board id to avoid duplication
    Optional<Task> findByTitleAndBoardId(String title, String BoardId);

    // find task by id
    Optional<Task> findByTaskId(String taskId);

    // find task by board id
    List<Task> findByBoardId(String boardId);

    // find task by priority
    List<Task> findByPriority(String priority);

    // active task -- who are not in archive column or done column
    // count active task assigned to a user i.e. count task whose columnId is not equal to active column id & done column id
    // db.task.countDocuments({ assignedTo: userEmail,
    //                          columnId: {$nin :"archiveColumnId", "doneColumnId"} });
    @Query(value = "{'assignedTo': ?0, 'columnId' : {$nin: [?1, ?2]} }", count = true)
    long countActiveTaskByAssignedTo(String assignedTo, String archiveColumnId, String doneColumnId);

}


/*
value - actual mongo db query
count - tell spring to count query not fetch data
?0 - first method parameter
?1 - second method parameter
?2 -third method parameter
 */