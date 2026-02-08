export default function TasksPanel() {
  const tasks = [
    { title: "Create login UI", assignee: "Ali", status: "Open" },
    { title: "API auth setup", assignee: "Sara", status: "In Progress" },
  ];

  return (
    <div className="bg-[#05080E] rounded-xl p-5 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-sm font-semibold">Tasks</h2>

        <input
          placeholder="Search tasks..."
          className="bg-black border border-gray-700 rounded-md px-3 py-1.5 text-sm text-white
            focus:ring-2 focus:ring-sky-400 outline-none"
        />
      </div>

      <div className="space-y-3">
        {tasks.map((task, i) => (
          <div
            key={i}
            className="border border-gray-800 rounded-md p-4 hover:border-sky-500 transition"
          >
            <h3 className="text-white text-sm font-medium">{task.title}</h3>
            <p className="text-xs text-gray-400 mt-1">
              Assigned to {task.assignee}
            </p>

            <span
              className="inline-block mt-2 text-xs px-2 py-1 rounded-md
                bg-sky-500/10 text-sky-400"
            >
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
