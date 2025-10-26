package com.kanbanServices.taskServices.repository;

import com.kanbanServices.taskServices.domain.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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


    // active task -- who are not in archive column or done column
    // count active task assigned to a user i.e. count task whose columnId is not equal to active column id & done column id
    // db.task.countDocuments({ assignedTo: userEmail,
    //                          columnId: {$nin :"archiveColumnId", "doneColumnId"} });
    @Query(value = "{'assignedTo': ?0, 'columnId' : {$nin: [?1, ?2]} }", count = true)
    long countActiveTaskByAssignedTo(String assignedTo, String archiveColumnId, String doneColumnId);


    // ----------- searching and filtering queries  -----------------

    // filter task by priority
    List<Task> findByBoardIdAndPriority(String boardId, String priority);


    // filter task created on specific date -- user want to see how many task is created at particular date
    List<Task> findByBoardIdAndCreatedAt(String boardId, LocalDate date);


    // filter task due on specific date  -- user want to see how many task have deadline today
    List<Task> findByBoardIdAndDueDate(String boardId, LocalDate date);


    // filter tasks created on specific month and year
    @Query("{ 'boardId': ?0, " +
            "  $expr: { $and: [ " +
            "       { $eq: [ { $month: '$createdAt' }, ?1 ] }, " +
            "       { $eq: [ { $year: '$createdAt' }, ?2 ] } " +
            "  ] } }")
    List<Task> findByCreatedMonthAndYear (String boardId,int month, int year);


    // filter tasks due on specific month and year
    @Query("{ 'boardId': ?0, " +
            "  $expr: { $and: [ " +
            "       { $eq: [ { $month: '$dueDate' }, ?1 ] }, " +
            "       { $eq: [ { $year: '$dueDate' }, ?2 ] } " +
            "  ] } }")
    List<Task> findByDueMonthAndYear(String boardId,int month, int year);


    // search by any -- title / description / assigned to
    @Query("{ 'boardId': ?0," +
              " $or: [ " +
              "         { 'title': { $regex: ?1, $options: 'i'} }," +
              "         {'task_description' : { $regex: ?1, $options: 'i'} }," +
              "         {'assignedTo' : { $regex: ?1, $options: 'i' } } " +
              " ] }")
    List<Task> searchTasksByKeyword(String boardId, String keyword);

}


/*
  --------------------- first query explanation -----------
value - actual mongo db query
count - tell spring to count query not fetch data
?0 - first method parameter
?1 - second method parameter
?2 -third method parameter
 */


/*
------------------- second query explanation
$month: '$dueDate' --- extract month from due date
$ eq : [value 1,value 2] --- check equality
$and inside $expr so that both month and year match
 */


/*
------------- fourth query explanation ----------------
 { 'boardId] :?0 } -- first parameter of method i.e. boardId
-- ?1 -- second parameter of method i.e. keyword
-- $ regex -- for pattern matching -- perfect for searching -- like LIKE operator in SQL
-- $i -- indicate case - insensitive
-- $or -- match any one of the scenario (title or description or assignedTo)
 */