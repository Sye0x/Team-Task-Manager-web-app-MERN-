import { useState } from "react";
import TeamsPanel from "../components/TeamsPanel";
import TasksPanel from "../components/TasksPanel";
import TaskModal from "../components/TaskModal";

export default function Dashboard() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-500 via-black to-sky-500">
      {/* Top Bar */}
      <header className="bg-[#05080E] border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-semibold">Team Task Manager</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-4 py-2 rounded-md transition"
        >
          + New Task
        </button>
      </header>

      {/* Main */}
      <div className="grid grid-cols-12 gap-6 p-6">
        <div className="col-span-12 md:col-span-3">
          <TeamsPanel />
        </div>

        <div className="col-span-12 md:col-span-9">
          <TasksPanel />
        </div>
      </div>

      {openModal && <TaskModal onClose={() => setOpenModal(false)} />}
    </div>
  );
}
