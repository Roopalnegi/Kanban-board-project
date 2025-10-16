package com.kanbanServices.boardServices.repository;

import com.kanbanServices.boardServices.domain.Board;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends MongoRepository<Board,Integer> {
    @Override
    //fetching all the details
    List<Board> findAll();
    // Find a specific board by both boardId and boardName
    // (used to prevent duplicate boards)
    Optional<Board> findByBoardIdAndBoardName( int boardId, String boardName);

    // find by id
    Optional<Board>findByBoardId(int boardId);

    //find board  task which is assign to employee by admin
    List<Board>findByCreatedBy(String createdBy);

    //find by board that contain column  with columnId
    @Query("{'columns.columnId':?0}")
    Optional<Board>findByColumnId(int columnId);

    //find by board that contain column with name like "toDoList","in-progress","completed" and "archive"
    @Query("{'columns.columnName':?0}")
    List<Board>findByColumnName(String columnName);

    //Find a specific board that contains a specific column (boardId + columnId)
    // Useful for verifying a column belongs to a given board
    @Query("{'boardId':?0,'columns.columnId':?1}")
    Optional<Board>findByBoardIdAndColumnId(int boardId,int columnId);

    //existById for board and column
    boolean existsByBoardId(int boardId);

    boolean existsByColumnId(int columnId);

    /*
    @Query:---
                This annotation marks a method in a Spring Data repository interface as a custom query.
                Instead of relying on method name parsing, you explicitly define the query using a MongoDB JSON-like syntax.
                it tells MongoDb to find the all board document where at least one column contain specific
                parameter like name,id

              1 --> "{ 'column.name': ?0 }": This is the actual MongoDB query expression.
              2 --->'column.name': This represents the field (column) in your MongoDB document that
                you want to query against. The single quotes are important for field names containing
                special characters or dots (like nested fields).
             3---> ?0: This is a placeholder for the first parameter passed to the repository method.
                If your method had multiple parameters, you would use ?1, ?2, and so on for subsequent
                 parameters. Spring Data will automatically replace these placeholders with the actual
                 values provided during the method call.
    */



}
