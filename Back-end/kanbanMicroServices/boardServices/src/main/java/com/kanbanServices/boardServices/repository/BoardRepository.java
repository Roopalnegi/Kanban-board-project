package com.kanbanServices.boardServices.repository;

import com.kanbanServices.boardServices.domain.Board;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends MongoRepository<Board,String>
{

    // ------- board related ---------

    // Find a specific board by both boardId and boardName (used to prevent duplicate boards)
    Optional<Board> findByBoardName( String boardName);

    // find board by id
    Optional<Board>findByBoardId(String boardId);

    // check the existence of particular board by id
    boolean existsByBoardId(String boardId);



    // ------- column related ---------

    //find board that contain a particular columnId
    @Query("{'columns.columnId':?0}")
    Optional<Board>findByColumnId(String columnId);


    // return all boards containing the columnName
    @Query("{'columns.columnName':?0}")
    List<Board>findByColumnName(String columnName);


    // check if column belongs to a board before assigning tasks
    @Query("{'boardId':?0,'columns.columnId':?1}")
    Optional<Board>findByBoardIdAndColumnId(String boardId, String columnId);



    /*
    @Query:---
                This annotation marks a method in a Spring Data repository interface as a custom query.
                Instead of relying on method name parsing, you explicitly define the query using a MongoDB JSON-like syntax.
                it tells MongoDb to find the all board document where at least one column contain specific
                parameter like name,id

              1 ---> "{ 'column.name': ?0 }": This is the actual MongoDB query expression.
              2 --->'column.name': This represents the field (column) in your MongoDB document that
                you want to query against. The single quotes are important for field names containing
                special characters or dots (like nested fields).
              3 ---> ?0: This is a placeholder for the first parameter passed to the repository method.
                If your method had multiple parameters, you would use ?1, ?2, and so on for subsequent
                 parameters. Spring Data will automatically replace these placeholders with the actual
                 values provided during the method call.
    */



}
