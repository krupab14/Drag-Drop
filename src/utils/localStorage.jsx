const KEY = "ddtm_board_v1";

export const defaultData = () => ({
  tasks: {
    // Example seed task (safe to remove)
    "t-1": { id: "t-1", title: "Welcome 👋", description: "Drag me between columns.", color: "#7c5cff" },
    "t-2": { id: "t-2", title: "Add your tasks", description: "Use + Add Task", color: "#6ee7ff" },
  },
  columns: {
    todo: { id: "todo", title: "To Do", taskIds: ["t-1", "t-2"] },
    inprogress: { id: "inprogress", title: "In Progress", taskIds: [] },
    done: { id: "done", title: "Done", taskIds: [] },
  },
  columnOrder: ["todo", "inprogress", "done"],
});

export function loadBoard() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    // Basic shape validation
    if (!parsed?.tasks || !parsed?.columns || !parsed?.columnOrder) return defaultData();
    return parsed;
  } catch {
    return defaultData();
  }
}

export function saveBoard(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
