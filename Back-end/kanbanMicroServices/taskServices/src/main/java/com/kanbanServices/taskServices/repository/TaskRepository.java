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

    // find task by column id
    List<Task> findByColumnId(int columnId);

    // find task by board id
    List<Task> findByBoardId(String boardId);

    // find task by priority
    List<Task> findByPriority(String priority);

    // count active (non-archive) task assigned to a user
    // assume done - 3 id and archive - 4
    // db.task.countDocuments({ assignedTo: userEmail,
    //                          columnId: {$nin :[3,4]} });
    @Query(value = "{'assignedTo': ?0, 'columnId' : { $nin: [3,4]} }", count = true)
    long countActiveTaskByAssignedTo(String userEmail);

}


/*
value - actual mongo db query
count - tell spring to count query not fetch data
?0 - first method parameter
 */