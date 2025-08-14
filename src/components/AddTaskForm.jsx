import React, { useState } from "react";

const COLORS = [
  "#7c5cff", // purple
  "#6ee7ff", // cyan
  "#22d3ee", // sky
  "#34d399", // green
  "#fbbf24", // amber
  "#f87171", // red
];

export default function AddTaskForm({ onAdd, defaultColor = COLORS[0] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(defaultColor);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: description.trim(), color });
    setTitle("");
    setDescription("");
    setColor(defaultColor);
  };

  return (
    <form className="form" onSubmit={submit}>
      <input
        className="input"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="textarea"
        placeholder="Optional description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="row">
        <div className="row" style={{ gap: 8 }}>
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`choose color ${c}`}
              className="colorSwatch"
              style={{ background: c, outline: color === c ? "2px solid white" : "none" }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <span className="grow" />
        <button className="btn" type="submit">+ Add Task</button>
      </div>
      <div className="footerHint">
        Tip: Press <span className="kbd">Enter</span> to add quickly.
      </div>
    </form>
  );
}
