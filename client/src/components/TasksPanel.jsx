import { useEffect, useState } from "react";
import { api } from "../api/api";
import EditTaskModal from "./EditTaskModal";

export default function TasksPanel() {
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  /* 🔹 Fetch teams */
  useEffect(() => {
    async function fetchTeams() {
      const res = await api("/teams");
      setTeams(res);
      if (res.length) setActiveTeam(res[0].id);
    }
    fetchTeams();
  }, []);

  /* 🔹 Fetch tasks per team */
  useEffect(() => {
    if (!activeTeam) return;

    async function fetchTasks() {
      try {
        setLoading(true);
        const res = await api(`/tasks?team_id=${activeTeam}`);
        setTasks(res);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [activeTeam]);

  /* 🔹 Delete task */
  async function deleteTask(id) {
    if (!confirm("Delete this task?")) return;

    await api(`/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  }

  /* 🔹 Optimistic update after edit */
  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    );
    setEditingTask(null);
  };

  return (
    <div className="bg-[#05080E] rounded-xl p-5 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-sm font-semibold">Tasks</h2>

        <select
          value={activeTeam}
          onChange={(e) => setActiveTeam(e.target.value)}
          className="bg-black border border-gray-700 rounded-md px-3 py-1.5 text-sm text-white"
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tasks */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500 text-sm">No tasks found</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border border-gray-800 rounded-md p-4 hover:border-sky-500 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white text-sm font-medium">
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    {task.first_name
                      ? `Assigned to ${task.first_name} ${task.last_name}`
                      : "Unassigned"}
                  </p>
                </div>

                <div className="flex gap-2">
                  {/* Edit */}
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-sky-400 text-xs hover:text-sky-300"
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 text-xs hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <span
                className={`inline-block mt-3 text-xs px-2 py-1 rounded-md ${
                  task.completed
                    ? "bg-green-500/10 text-green-400"
                    : "bg-sky-500/10 text-sky-400"
                }`}
              >
                {task.completed ? "Completed" : "Open"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdated={async () => {
            // close modal
            setEditingTask(null);

            // re-fetch tasks for the active team
            const updatedTasks = await api(`/tasks?team_id=${activeTeam}`);
            setTasks(updatedTasks);
          }}
        />
      )}
    </div>
  );
}
