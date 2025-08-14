import React from "react";
import { Draggable } from "@hello-pangea/dnd";

export default function TaskCard({ task, index, onDelete }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`card ${snapshot.isDragging ? "dragging" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="dot" style={{ background: task.color }} />
          <div style={{ flex: 1 }}>
            <div className="cardTitle">{task.title}</div>
            {task.description ? (
              <div className="cardDesc">{task.description}</div>
            ) : null}
          </div>
          <div className="cardActions">
            <button
              className="iconBtn"
              title="Delete"
              onClick={() => onDelete(task.id)}
            >
              🗑️
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
