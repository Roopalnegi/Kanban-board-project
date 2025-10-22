package com.kanbanServices.boardServices.service;

import com.kanbanServices.boardServices.domain.Board;
import com.kanbanServices.boardServices.domain.Column;
import com.kanbanServices.boardServices.execption.BoardAlreadyExistsException;
import com.kanbanServices.boardServices.execption.BoardNotFoundExecption;
import com.kanbanServices.boardServices.execption.ColumnAlreadyExistsException;
import com.kanbanServices.boardServices.execption.ColumnNotFoundException;
import com.kanbanServices.boardServices.repository.BoardRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class BoardServiceImpl implements BoardService
{

    private final BoardRepository boardRepository;

    @Autowired
    public BoardServiceImpl(BoardRepository boardRepository)
    {
        this.boardRepository = boardRepository;
    }


    // --------------- board related ---------------


    // create new board
    @Override
    public Board createBoard(Board board) throws BoardAlreadyExistsException
    {
        // check if task already exists by its title and boardId as two tasks can have same title but live in different boards
        if(boardRepository.findByBoardName(board.getBoardName()).isPresent())
        {
            throw new BoardAlreadyExistsException("Board already exists with name : " + board.getBoardName());
        }

        // if no columns are provided, create default columns
        if(board.getColumns() == null || board.getColumns().isEmpty())
        {
            List<Column> defaultColumnList = new ArrayList<> (Arrays.asList(new Column("To Do", 1),
                    new Column("In Progress", 2),
                    new Column ("Done", 3)));

            // add archive column at last
            defaultColumnList.add(new Column("Archive", defaultColumnList.size() + 1));

            board.setColumns(defaultColumnList);
        }

        Board savedBoard = boardRepository.save(board);

        return savedBoard;
    }



    // read single board details by id
    @Override
    public Board getBoardById(String boardId) throws BoardNotFoundExecption
    {
        Board board = boardRepository.findByBoardId(boardId)
                 .orElseThrow(()->new BoardNotFoundExecption("Board not found"));

        // sort columns
        sortColumnsByOrder(board.getColumns());

        return board;
    }


    //readAll boards details
    @Override
    public List<Board> getAllBoard()
    {
        List<Board> boards = boardRepository.findAll();

        // sort columns for each baord
        boards.forEach(board -> sortColumnsByOrder(board.getColumns()));

        return boards;
    }



    //delete board
    @Override
    public boolean deleteBoard(String boardId) throws BoardNotFoundExecption
    {
        if (!boardRepository.existsById(boardId))
        {
            throw new BoardNotFoundExecption("Board not found with Id : " + boardId);
        }

        boardRepository.deleteById(boardId);
        return true;
    }



    // update board details
    @Override
    public Board updateBoard(String boardId, Board updateBoardData) throws BoardNotFoundExecption
    {
        // check if board exist or not
        Board existingBoard = boardRepository.findById(boardId)
                .orElseThrow(() -> new BoardNotFoundExecption("Board not found with ID: " + boardId));

        // update only the fields that are provided
        if(updateBoardData.getBoardName() != null)
        {
            existingBoard.setBoardName(updateBoardData.getBoardName());
        }

        if (updateBoardData.getColumns() != null)
        {
            existingBoard.setColumns(updateBoardData.getColumns());
        }

        if (updateBoardData.getDescription() != null)
        {
            existingBoard.setDescription(updateBoardData.getDescription());
        }

        // sort columns
        sortColumnsByOrder(existingBoard.getColumns());

        return boardRepository.save(existingBoard);

    }



    // ------------ column related -----------------

    @Override
    // create new column in board
    // remember archive column should be at last and always present
    public Column createBoardColumn (String boardId, Column newColumn) throws BoardNotFoundExecption, ColumnAlreadyExistsException
    {

        // validate board exists
        Board board = getBoardById(boardId);

        // if board column list is null, initialize it with empty list and ensure archive column always exists
        if(board.getColumns() == null)
        {
            board.setColumns(new ArrayList<>());
            board.getColumns().add(new Column("Archive", 1));   // esure archive exist if no columns
        }

        // ensure again new column has an ID
        if(newColumn.getColumnId() == null || newColumn.getColumnId().isEmpty())
        {
            newColumn.setColumnId(new ObjectId().toString());    //  auto-generate unique ID manually
        }

        // check if column already exists with same id
        boolean columnExists = board.getColumns().stream()
                                         .anyMatch(c -> c.getColumnId() != null && c.getColumnId().equals(newColumn.getColumnId()) );

        if(columnExists)
        {
            throw new ColumnAlreadyExistsException("Column already exists with Id");
        }

        // always insert new column before archive
        List<Column> columns = board.getColumns();

        // find archive column index (always going to be last)
        int archiveIndex = columns.size() - 1;

        // set new column order ( same as archive position)
        newColumn.setColumnOrder(columns.get(archiveIndex).getColumnOrder());       // now insert new column before archive i.e. at archive position

        // insert new column before archive
        columns.add(archiveIndex, newColumn);

        // update archive column order to be at last
        columns.get(columns.size()-1).setColumnOrder(columns.size());

        // sort columns
        sortColumnsByOrder(columns);

        // save the bord with new column
        boardRepository.save(board);

        return newColumn;       // return newly added column

    }



    // delete column
    @Override
    public Boolean deleteBoardColumn(String boardId, String columnId) throws BoardNotFoundExecption, ColumnNotFoundException
    {
        // check if board exist
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ColumnNotFoundException("Board not found with ID: " + boardId));

        // prevent deleting archive column since it's permenant
        boolean isArchiveColumn = board.getColumns().stream()
                                                    .anyMatch(col -> col.getColumnId().equals(columnId) &&
                                                     col.getColumnName().equalsIgnoreCase("Archive"));
        if (isArchiveColumn)
        {
            throw new ColumnNotFoundException("Cannot delete Archive column");
        }

        // remove the column from the board's columns list
        boolean removed = board.getColumns().removeIf(col -> col.getColumnId().equals(columnId));

        // Step 3: Check if the column exists
        if (!removed)
        {
            throw new ColumnNotFoundException("Column not found with ID: " + columnId);
        }

        // sort the columns
        sortColumnsByOrder(board.getColumns());

        // Step 4: Save the updated board
        boardRepository.save(board);
        return true;
    }



    // update column name
    @Override
    public Column updateBoardColumnName (String boardId, String columnId, String columnNewName) throws BoardNotFoundExecption, ColumnNotFoundException
    {
        // check if board exist
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ColumnNotFoundException("Board not found with ID: " + boardId));

        // check if column exist
        Column columnExists = board.getColumns().stream()
                .filter(c -> c.getColumnId().equals(columnId))
                .findFirst()
                .orElseThrow(() -> new ColumnNotFoundException("Column not found with ID: " + columnId));

        // update column name
        columnExists.setColumnName(columnNewName);

        return columnExists;
    }



    // retrieve column by id (searching through board)
    @Override
    public Column getColumnById(String columnId) throws ColumnNotFoundException
    {
        // check if board exist
        Board board = boardRepository.findByColumnId(columnId)
                .orElseThrow(() -> new ColumnNotFoundException("Column not found with Id: " + columnId));

        // if exists, return column
        return board.getColumns().stream()
                .filter(c -> c.getColumnId().equals(columnId))
                .findFirst()
                .orElseThrow(() -> new ColumnNotFoundException("Column not found with Id: " + columnId));
    }



    // retrieve column by name to validate column existence by name instead of id
    @Override
    public Column getColumnByName(String columnName) throws ColumnNotFoundException
    {
        // fetch all boards that contain specific column name
        List<Board> boards = boardRepository.findByColumnName(columnName);

        // if empty
        if (boards.isEmpty())
        {
            throw new ColumnNotFoundException("No column found with name: " + columnName);
        }

        // if not --> Assuming each board can have only one column with that name
        return boards.get(0).getColumns().stream()
                .filter(col -> col.getColumnName().equalsIgnoreCase(columnName))
                .findFirst()
                .orElseThrow(() -> new ColumnNotFoundException("No column found with name: " + columnName));
    }


    // helper method - sort columns in a board by its order / position
    @Override
    public List<Column> sortColumnsByOrder(List<Column> columns)
    {
        // check if column exist
        if(columns == null || columns.isEmpty())
        {
            return columns;
        }

        columns.sort((c1, c2) -> Integer.compare(c1.getColumnOrder(), c2.getColumnOrder()));
        return columns;
    }


    // ------------------ task service helpers ------------------

    // check board exist before assigning task
    @Override
    public boolean checkBoardExistForTask(String boardId) throws BoardNotFoundExecption
    {
        return boardRepository.existsByBoardId(boardId);
    }

    // check if column with a given ID belongs to that specific board
    @Override
    public boolean columnExistsInBoardForTask(String boardId, String columnId) throws BoardNotFoundExecption, ColumnNotFoundException
    {
        return boardRepository.findByBoardIdAndColumnId(boardId, columnId).isPresent();
    }


    // calculate archive column position -- would always be permanent and at last
    @Override
    public String calculateArchiveColumnId(String boardId) throws BoardNotFoundExecption
    {
        // check if board exist
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new BoardNotFoundExecption("Board not found with ID: " + boardId));

        // now get archive column id
        return board.getColumns().stream()
                                 .filter(c -> c.getColumnName().equalsIgnoreCase("Archive"))
                                 .map(Column::getColumnId)
                                 .findFirst()
                                 .orElseThrow(() -> new ColumnNotFoundException("Archive column missing"));
    }


    // get column id of column that is counted as "Done"
    // but the problem is user can rename the columns, so not sure which column represent done or other words which represent done like finished, close etc.
    // so go for middle solution -- whichever column name is either done, completed, finish, close those column can be count as done part hence fetch column id
    @Override
    public String calculateDoneColumnId(String boardId) throws BoardNotFoundExecption,ColumnNotFoundException
    {
        // check if board exist
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new BoardNotFoundExecption("Board not found with ID: " + boardId));

        // possible names representing "done" word in kanban board
        List<String> possibleWords = List.of("done", "completed", "finished", "closed");

        return board.getColumns().stream()
                                 .filter(c -> possibleWords.contains(c.getColumnName().toLowerCase()))
                .map(Column::getColumnId)
                .findFirst()
                .orElseThrow(() -> new ColumnNotFoundException("Cannot Pin Point Any Column with following words - done, completed, finished, closed."));
    }


}


/*
Reason for using Stream API in this project:

- Columns are embedded inside Board object, so to access a specific column (by ID, name, or order),
  we need to filter column within the Board’s columns list.

- Stream API allows us to do this in a functional, declarative, concise way.
   ( Declarative style -- We say what we want, not how to loop through it)

*/
