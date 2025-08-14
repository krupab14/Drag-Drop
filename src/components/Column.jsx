import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function Column({
  column,
  tasks,
  onDeleteTask,
  headerAccent = "linear-gradient(135deg, rgba(124,92,255,.25), rgba(110,231,255,.25))",
  children,
}) {
  return (
    <div className="column">
      <div
        className="columnHeader"
        style={{ background: headerAccent }}
      >
        <div className="columnTitle">{column.title}</div>
        <div className="badge">{tasks.length}</div>
      </div>

      {children /* AddTaskForm slot */ }

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`columnBody ${snapshot.isDraggingOver ? "drag-over" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
