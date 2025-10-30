import { useDraggable } from "@dnd-kit/core";
import TaskCard from "../TaskCard/TaskCard";
function DraggableTask({task, onTaskEdit, onTaskArchive, onTaskRestore, onTaskDelete, archiveColumnId, readOnly, draggable = true})
{

    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id : String(task.taskId),         // ensure id is string
    });


    const style = {
                    transform: transform ? `translate3d(${transform.x}px,${transform.y}px,0)`: undefined,
                    cursor: draggable ? "grab" : "default",
                    padding: "8px",
                    marginBottom: "20px",
                    opacity: isDragging ? 0.8 : 1,
                    transition: "transform 0.25s ease",
                    zIndex: isDragging ? 999900 : "auto", // keeps dragged task above everything
                    position: isDragging ? "absolute" : "static", // needed for z-index to apply
                  };
    
                  
    return (
       <div ref={ draggable ? setNodeRef : null} 
            style={style} {...(draggable ? listeners : {})} 
                          {...(draggable ? attributes : {})}>
          <TaskCard task = {task}
                    onTaskEdit = {onTaskEdit}
                    onTaskArchive = {onTaskArchive}
                    onTaskRestore = {onTaskRestore}
                    onTaskDelete = {onTaskDelete}
                    archiveColumnId = {archiveColumnId}
                    readOnly = {readOnly}
           />         
       </div>
    );           
}

export default DraggableTask;

/*
React hooks must not be conditionally called. 

So implement two render paths: non-draggable (return simple div) and draggable (use useDraggable). 

That prevents calling useDraggable when dragging should be disabled.
*/