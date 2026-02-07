import { useEffect, useState } from "react";
import { api } from "../api/api";
import TaskModal from "./TaskModal";

export default function TaskList({ team }) {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api(`/tasks?team_id=${team.id}`).then(setTasks);
  }, [team]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">{team.name} Tasks</h2>
        <button
          className="bg-black text-white px-3 py-1"
          onClick={() => setOpen(true)}
        >
          + Task
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-2">
            <div className="flex justify-between">
              <span>{task.title}</span>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  api(`/tasks/${task.id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                      assigned_to: task.assigned_to,
                      completed: !task.completed,
                    }),
                  }).then(() =>
                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === task.id
                          ? { ...t, completed: !t.completed }
                          : t,
                      ),
                    ),
                  )
                }
              />
            </div>
          </li>
        ))}
      </ul>

      {open && (
        <TaskModal
          team={team}
          onClose={() => setOpen(false)}
          onCreate={(task) => setTasks((prev) => [...prev, task])}
        />
      )}
    </div>
  );
}
