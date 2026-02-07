import { useState } from "react";
import { api } from "../api/api";

export default function TaskModal({ team, onClose, onCreate }) {
  const [title, setTitle] = useState("");

  async function handleCreate() {
    const task = await api("/tasks", {
      method: "POST",
      body: JSON.stringify({
        title,
        team_id: team.id,
      }),
    });
    onCreate(task);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button className="bg-black text-white px-3" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
