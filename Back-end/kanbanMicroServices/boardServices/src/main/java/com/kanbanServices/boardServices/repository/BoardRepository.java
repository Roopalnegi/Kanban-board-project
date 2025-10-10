package com.kanbanServices.boardServices.repository;

import com.kanbanServices.boardServices.domain.Board;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends MongoRepository<Board,Integer> {
    @Override
    //fetching all the details
    List<Board> findAll();
    //to avoid duplicate finding Board with id and name
    Optional<Board> findByBoardIdAndBoardName(String name, int boardId);

    // find by id
    Optional<Board>findByBoardId(int boardId);

    //find board containing taskID
    Board findByTaskIdContaining(String taskId);

    //find board  task which is assign to employee by admin
    List<Board>findByAssignedTo(String assignedTo);

    //find by status of task toDoList,in-progress,completed,archive
    List<Board>findByStatus(String status);
}
