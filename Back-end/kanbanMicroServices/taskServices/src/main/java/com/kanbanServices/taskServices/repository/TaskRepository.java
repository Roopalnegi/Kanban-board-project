package com.kanbanServices.taskServices.repository;

import com.kanbanServices.taskServices.domain.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends MongoRepository<Task,String>
{
    // find task by title by board id to avoid duplication
    Optional<Task> findByTitleAndBoardId(String title, Long BoardId);

    // find task by id
    Optional<Task> findByTaskId(String taskId);

    // find task by column id
    List<Task> findByColumnId(Long columnId);

    // find task by board id
    List<Task> findByBoardId(Long boardId);

    // find task by priority
    List<Task> findByPriority(String priority);

}
