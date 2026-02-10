import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function TaskModal({ onClose, onTaskCreated }) {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch logged-in user
  useEffect(() => {
    async function fetchMe() {
      const me = await api("/auth/me");
      setCurrentUserId(me.id);
    }
    fetchMe();
  }, []);

  // Fetch owned teams
  useEffect(() => {
    if (!currentUserId) return;

    async function fetchTeams() {
      try {
        setLoadingTeams(true);
        const res = await api("/teams");
        const ownedTeams = res.filter(
          (team) => team.owner_id === currentUserId,
        );
        setTeams(ownedTeams);
      } catch {
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    }

    fetchTeams();
  }, [currentUserId]);

  // Fetch members when team changes
  useEffect(() => {
    if (!teamId) {
      setMembers([]);
      setAssigneeId("");
      return;
    }

    async function fetchMembers() {
      try {
        setLoadingMembers(true);
        const res = await api(`/teams/${teamId}/members`);
        setMembers(res);
      } catch {
        setMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    }

    fetchMembers();
  }, [teamId]);

  async function handleCreateTask() {
    setError("");

    if (!title.trim()) return setError("Task title is required");
    if (!teamId) return setError("Please select a team");

    try {
      setSaving(true);

      await api("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          team_id: teamId,
          assigned_to: assigneeId || null,
        }),
      });

      onTaskCreated(); // refresh TasksPanel in Dashboard
      onClose();
    } catch {
      setError("Failed to create task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#05080E] rounded-xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-white text-lg font-semibold mb-4">Create Task</h2>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="space-y-4">
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-white
              focus:ring-2 focus:ring-sky-400 outline-none"
          />

          <textarea
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-white
              focus:ring-2 focus:ring-sky-400 outline-none resize-none"
          />

          {/* Teams */}
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            disabled={loadingTeams}
            className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-white"
          >
            <option value="">
              {loadingTeams ? "Loading teams..." : "Select your team"}
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          {/* Members */}
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            disabled={!teamId || loadingMembers}
            className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-white"
          >
            <option value="">
              {!teamId
                ? "Select team first"
                : loadingMembers
                  ? "Loading members..."
                  : "Unassigned"}
            </option>
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
            onClick={handleCreateTask}
            disabled={saving}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
