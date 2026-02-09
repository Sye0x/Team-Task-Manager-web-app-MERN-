import { useEffect, useState } from "react";
import { api } from "../api/api";
import EditTaskModal from "./EditTaskModal";

export default function TasksPanel() {
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [activeTab, setActiveTab] = useState("my"); // "my" | "team"
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    async function fetchMe() {
      const me = await api("/auth/me");
      setCurrentUserId(me.id);
    }
    fetchMe();
  }, []);

  // Fetch teams
  useEffect(() => {
    async function fetchTeams() {
      const res = await api("/teams");
      setTeams(res);
      if (res.length) setActiveTeam(res[0].id);
    }
    fetchTeams();
  }, []);

  // Fetch tasks function
  const fetchTasksForActiveTeam = async () => {
    if (!activeTeam) return;
    try {
      setLoading(true);
      const res = await api(`/tasks?team_id=${activeTeam}`);
      setTasks(res);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when active team changes
  useEffect(() => {
    fetchTasksForActiveTeam();
  }, [activeTeam]);

  // Delete task
  async function deleteTask(id) {
    if (!confirm("Delete this task?")) return;

    await api(`/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // Update task after edit
  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t)),
    );
    setEditingTask(null);
  };

  // Toggle task complete/open
  async function toggleTaskStatus(task, status) {
    const newCompleted = status === "complete";

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, completed: newCompleted } : t,
      ),
    );

    try {
      // Backend sync
      const updated = await api(`/tasks/status/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: newCompleted }),
      });

      // Merge response
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)),
      );
    } catch (err) {
      // Rollback on error
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    }
  }

  // Filter tasks by tab
  const filteredTasks = tasks.filter((task) => {
    if (!currentUserId) return true;
    if (activeTab === "my") return task.assigned_to === currentUserId;
    return task.assigned_to !== currentUserId;
  });

  return (
    <div className="bg-[#05080E] rounded-xl p-5 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-sm font-semibold">Tasks</h2>

        <div className="flex items-center gap-2">
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

          {/* Reload button */}
          <button
            onClick={fetchTasksForActiveTeam}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-3 py-1 rounded-md"
          >
            Reload
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("my")}
          className={`px-3 py-1.5 text-xs rounded-md transition ${
            activeTab === "my"
              ? "bg-sky-500/20 text-sky-400"
              : "bg-black text-gray-400 hover:text-white"
          }`}
        >
          My Tasks
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={`px-3 py-1.5 text-xs rounded-md transition ${
            activeTab === "team"
              ? "bg-sky-500/20 text-sky-400"
              : "bg-black text-gray-400 hover:text-white"
          }`}
        >
          Team Tasks
        </button>
      </div>

      {/* Tasks */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-gray-500 text-sm">
          {activeTab === "my"
            ? "No tasks assigned to you"
            : "No tasks assigned to team members"}
        </p>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
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
                  {activeTab === "my" && (
                    <select
                      value={task.completed ? "complete" : "open"}
                      onChange={(e) => toggleTaskStatus(task, e.target.value)}
                      className="text-xs px-2 py-1 rounded-md bg-gray-800 text-white"
                    >
                      <option value="open">Open</option>
                      <option value="complete">Complete</option>
                    </select>
                  )}

                  {activeTab === "team" && (
                    <>
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-sky-400 text-xs hover:text-sky-300"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 text-xs hover:text-red-300"
                      >
                        Delete
                      </button>
                    </>
                  )}
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
          onUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}
