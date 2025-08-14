import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./components/Column";
import AddTaskForm from "./components/AddTaskForm";
import { loadBoard, saveBoard, defaultData } from "./utils/localStorage";
import "./App.css";
import "./index.css";

function createId(prefix = "t") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function App() {
  const [state, setState] = useState(() => loadBoard());

  // Persist on change
  useEffect(() => {
    saveBoard(state);
  }, [state]);

  const columnsArray = useMemo(
    () => state.columnOrder.map((id) => state.columns[id]),
    [state]
  );

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // No move
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const startCol = state.columns[source.droppableId];
    const endCol = state.columns[destination.droppableId];

    // Reorder within same column
    if (startCol === endCol) {
      const newTaskIds = Array.from(startCol.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newCol = { ...startCol, taskIds: newTaskIds };
      const newState = {
        ...state,
        columns: { ...state.columns, [newCol.id]: newCol },
      };
      setState(newState);
      return;
    }

    // Move to another column
    const startTaskIds = Array.from(startCol.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...startCol, taskIds: startTaskIds };

    const endTaskIds = Array.from(endCol.taskIds);
    endTaskIds.splice(destination.index, 0, draggableId);
    const newEnd = { ...endCol, taskIds: endTaskIds };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newEnd.id]: newEnd,
      },
    };
    setState(newState);
  };

  const addTaskTo = (columnId) => (payload) => {
    const id = createId();
    const task = { id, ...payload };
    const tasks = { ...state.tasks, [id]: task };
    const col = state.columns[columnId];
    const taskIds = [id, ...col.taskIds];
    const columns = { ...state.columns, [columnId]: { ...col, taskIds } };
    setState({ ...state, tasks, columns });
  };

  const deleteTask = (taskId) => {
    // Remove from tasks and from any column.taskIds
    const tasks = { ...state.tasks };
    delete tasks[taskId];
    const columns = Object.fromEntries(
      Object.entries(state.columns).map(([cid, col]) => [
        cid,
        { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) },
      ])
    );
    setState({ ...state, tasks, columns });
  };

  const resetBoard = () => setState(defaultData());

  const getTasksFor = (column) => column.taskIds.map((id) => state.tasks[id]);

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <span style={{ fontSize: 22 }}>Drag & Drop</span>
          <span className="badge hide-on-mobile">LocalStorage · Offline</span>
        </div>
        <div className="toolbar">
          <button className="btn secondary" onClick={resetBoard}>Reset</button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          <Column
            column={state.columns.todo}
            tasks={getTasksFor(state.columns.todo)}
            onDeleteTask={deleteTask}
            headerAccent="linear-gradient(135deg, rgba(110,231,255,.22), rgba(124,92,255,.18))"
          >
            <AddTaskForm onAdd={addTaskTo("todo")} />
          </Column>

          <Column
            column={state.columns.inprogress}
            tasks={getTasksFor(state.columns.inprogress)}
            onDeleteTask={deleteTask}
            headerAccent="linear-gradient(135deg, rgba(124,92,255,.22), rgba(248,113,113,.18))"
          />

          <Column
            column={state.columns.done}
            tasks={getTasksFor(state.columns.done)}
            onDeleteTask={deleteTask}
            headerAccent="linear-gradient(135deg, rgba(34,211,153,.25), rgba(124,92,255,.15))"
          />
        </div>
      </DragDropContext>
    </div>
  );
}
