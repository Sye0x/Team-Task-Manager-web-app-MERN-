import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function TaskModal({ onClose }) {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);

  const [title, setTitle] = useState("");
  const [teamId, setTeamId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState("");

  /* 🔹 Fetch teams */
  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoadingTeams(true);
        const res = await api("/teams");
        setTeams(res);
      } catch {
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    }

    fetchTeams();
  }, []);

  /* 🔹 Fetch members when team changes */
  useEffect(() => {
    if (!teamId) {
      setMembers([]);
      setAssigneeId("");
      return;
    }

    async function fetchMembers() {
      try {
        setLoadingMembers(true);
        const res = await api(`/team_member/${teamId}`);
        setMembers(res);
      } catch (e) {
        setMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    }

    fetchMembers();
  }, [teamId]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#05080E] rounded-xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-white text-lg font-semibold mb-4">Create Task</h2>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="space-y-4">
          {/* Task title */}
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-white
              focus:ring-2 focus:ring-sky-400 outline-none"
          />

          {/* Teams */}
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            disabled={loadingTeams || teams.length === 0}
            className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-white
              disabled:opacity-50"
          >
            {loadingTeams ? (
              <option value="">Loading teams...</option>
            ) : teams.length === 0 ? (
              <option value="" disabled>
                No teams available
              </option>
            ) : (
              <>
                <option value="">Select team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </>
            )}
          </select>

          {/* Members (depends on team) */}
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            disabled={!teamId || loadingMembers}
            className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-white
              disabled:opacity-50"
          >
            {!loadingMembers && members.length === 0 ? (
              <option value="" disabled>
                {!teamId ? "Select team first" : "No team members"}
              </option>
            ) : (
              <option value="">
                {!teamId
                  ? "Select team first"
                  : loadingMembers
                    ? "Loading members..."
                    : "Assign to"}
              </option>
            )}
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
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

          <button className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-4 py-2 rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
