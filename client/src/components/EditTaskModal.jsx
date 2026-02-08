import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function EditTaskModal({ task, onClose, onUpdated }) {
  const [members, setMembers] = useState([]);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [assigneeId, setAssigneeId] = useState(task.assigned_to || "");

  const [loading, setLoading] = useState(false);

  /* Fetch members for task team */
  useEffect(() => {
    async function fetchMembers() {
      const res = await api(`/teams/${task.team_id}/members`);
      setMembers(res);
    }
    fetchMembers();
  }, [task.team_id]);

  async function handleUpdate() {
    try {
      setLoading(true);

      await api(`/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          assigned_to: assigneeId || null,
        }),
      });

      // call parent callback to refresh panel
      onUpdated();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#05080E] rounded-xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-white text-lg font-semibold mb-4">Edit Task</h2>

        <div className="space-y-4">
          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
            className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-white"
          />

          {/* Description */}
          <textarea
            rows={3}
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-white resize-none"
          />

          {/* Assignee */}
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-white"
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.first_name} {m.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
