import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Trash, PencilLine, Cross, X } from "lucide-react";
export default function TeamsPanel() {
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Modals & form states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [creatingTeam, setCreatingTeam] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [updatedTeamName, setUpdatedTeamName] = useState("");
  const [updatingTeam, setUpdatingTeam] = useState(false);

  const [deletingTeamId, setDeletingTeamId] = useState(null);

  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [activeTeam, setActiveTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch teams
  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoadingTeams(true);
        const res = await api("/teams");
        setTeams(res);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    }

    fetchTeams();
  }, []);

  // Create team
  async function handleCreateTeam(e) {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    try {
      setCreatingTeam(true);
      const res = await api("/teams", {
        method: "POST",
        body: JSON.stringify({ name: newTeamName }),
      });
      setTeams([...teams, res]);
      setNewTeamName("");
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Failed to create team:", err);
    } finally {
      setCreatingTeam(false);
    }
  }
  async function openMembersModal(team) {
    setActiveTeam(team);
    setIsMembersModalOpen(true);

    try {
      setLoadingMembers(true);
      const membersRes = await api(`/teams/${team.id}/members`);
      setMembers(membersRes);

      setLoadingUsers(true);
      const usersRes = await api(`/teams/${team.id}/available-users`);
      setAvailableUsers(usersRes);
    } catch {
      setMembers([]);
      setAvailableUsers([]);
    } finally {
      setLoadingMembers(false);
      setLoadingUsers(false);
    }
  }

  // Delete team
  async function handleDeleteTeam(teamId, teamName) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the team "${teamName}"?`,
    );
    if (!confirmed) return;

    try {
      setDeletingTeamId(teamId);
      await api(`/teams/${teamId}`, { method: "DELETE" });
      setTeams(teams.filter((team) => team.id !== teamId));
    } catch (err) {
      console.error("Failed to delete team:", err);
    } finally {
      setDeletingTeamId(null);
    }
  }

  // Open edit modal
  function openEditModal(team) {
    setEditingTeam(team);
    setUpdatedTeamName(team.name);
    setIsEditModalOpen(true);
  }

  // Update team
  async function handleUpdateTeam(e) {
    e.preventDefault();
    if (!updatedTeamName.trim()) return;

    try {
      setUpdatingTeam(true);
      const res = await api(`/teams/${editingTeam.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: updatedTeamName }),
      });

      // Update state
      setTeams(teams.map((t) => (t.id === res.id ? res : t)));
      setIsEditModalOpen(false);
      setEditingTeam(null);
      setUpdatedTeamName("");
    } catch (err) {
      console.error("Failed to update team:", err);
    } finally {
      setUpdatingTeam(false);
    }
  }

  async function addMember(user) {
    const res = await api(`/teams/${activeTeam.id}/members`, {
      method: "POST",
      body: JSON.stringify({ email: user.email }),
    });

    setMembers([...members, res]);
    setAvailableUsers(availableUsers.filter((u) => u.id !== user.id));
  }

  return (
    <div className="bg-[#05080E] rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-sm font-semibold">Teams</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="text-white bg-sky-500/80 hover:bg-sky-500 px-2 py-1 rounded-full font-bold transition"
        >
          +
        </button>
      </div>

      {loadingTeams ? (
        <p className="text-gray-400 text-sm">Loading teams...</p>
      ) : (
        <ul className="space-y-2">
          {teams.map((team) => (
            <li
              key={team.id}
              className="flex items-center px-3 py-2 rounded-md text-sm text-gray-300
    hover:bg-sky-500/10 hover:text-white transition cursor-pointer"
            >
              {/* Delete button */}

              {/* Team name */}
              <span onClick={() => openMembersModal(team)} className="flex-1">
                {team.name}
              </span>

              {/* Edit button */}
              <button
                onClick={() => openEditModal(team)}
                className="ml-2 text-yellow-400 hover:text-yellow-300 transition cursor-pointer"
              >
                <PencilLine className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteTeam(team.id, team.name)}
                disabled={deletingTeamId === team.id}
                className="ml-2 text-red-500 hover:text-red-400 transition cursor-pointer"
              >
                {deletingTeamId === team.id ? (
                  "..."
                ) : (
                  <Trash className="w-4 h-4" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#0A101F] rounded-xl p-6 w-80">
            <h3 className="text-white text-lg font-semibold mb-4">
              Create New Team
            </h3>
            <form onSubmit={handleCreateTeam} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="px-3 py-2 rounded-md bg-[#1B2232] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTeam}
                  className="px-3 py-1 rounded-md bg-sky-500 text-white hover:bg-sky-600 transition disabled:opacity-50"
                >
                  {creatingTeam ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#0A101F] rounded-xl p-6 w-80">
            <h3 className="text-white text-lg font-semibold mb-4">
              Update Team Name
            </h3>
            <form onSubmit={handleUpdateTeam} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Team name"
                value={updatedTeamName}
                onChange={(e) => setUpdatedTeamName(e.target.value)}
                className="px-3 py-2 rounded-md bg-[#1B2232] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingTeam}
                  className="px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  {updatingTeam ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMembersModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0A101F] w-96 rounded-xl p-6 space-y-5">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold">
                {activeTeam?.name} Members
              </h3>
              <button
                onClick={() => setIsMembersModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Members */}
            <div>
              <h4 className="text-gray-300 text-sm mb-2">Team Members</h4>

              {loadingMembers ? (
                <p className="text-gray-400 text-sm">Loading members...</p>
              ) : members.length === 0 ? (
                <p className="text-gray-500 text-sm">No members added</p>
              ) : (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {members.map((m) => (
                    <li
                      key={m.id}
                      className="flex justify-between items-center bg-[#111827] px-3 py-2 rounded"
                    >
                      <span className="text-white text-sm">
                        {m.first_name} {m.last_name}
                      </span>
                      <button
                        onClick={() => removeMember(m.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Available users */}
            <div>
              <h4 className="text-gray-300 text-sm mb-2">Add Members</h4>

              {loadingUsers ? (
                <p className="text-gray-400 text-sm">Loading users...</p>
              ) : availableUsers.length === 0 ? (
                <p className="text-gray-500 text-sm">No users available</p>
              ) : (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {availableUsers.map((u) => (
                    <li
                      key={u.id}
                      className="flex justify-between items-center bg-[#111827] px-3 py-2 rounded"
                    >
                      <span className="text-white text-sm">
                        {u.first_name} {u.last_name}
                      </span>
                      <button
                        onClick={() => addMember(u)}
                        className="text-sky-400 hover:text-sky-300 text-lg"
                      >
                        <Cross className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
