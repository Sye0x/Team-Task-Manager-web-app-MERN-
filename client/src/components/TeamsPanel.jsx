import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Trash, PencilLine, Cross, X } from "lucide-react";

export default function TeamsPanel() {
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

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
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchMe() {
      const me = await api("/auth/me");
      setCurrentUser(me);
    }
    fetchMe();
  }, []);

  useEffect(() => {
    if (isMembersModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMembersModalOpen]);

  // ================= FETCH TEAMS =================
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

  // ================= CREATE TEAM =================
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
      setIsCreateModalOpen(false);
      setNewTeamName("");
    } finally {
      setCreatingTeam(false);
    }
  }

  // ================= OPEN MEMBERS =================
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
    } finally {
      setLoadingMembers(false);
      setLoadingUsers(false);
    }
  }

  function isOwner(team) {
    return currentUser?.id === team.owner_id;
  }

  // ================= ADD MEMBER =================
  async function addMember(user) {
    if (!isOwner(activeTeam)) return; // extra safety check
    const res = await api(`/teams/${activeTeam.id}/members`, {
      method: "POST",
      body: JSON.stringify({ email: user.email }),
    });

    setMembers([...members, res]);
    setAvailableUsers(availableUsers.filter((u) => u.id !== user.id));
  }

  // ================= REMOVE MEMBER =================
  async function removeMember(userId) {
    if (!isOwner(activeTeam)) return; // extra safety check
    await api(`/teams/${activeTeam.id}/members/${userId}`, {
      method: "DELETE",
    });

    setMembers(members.filter((m) => m.id !== userId));
  }

  // ================= UPDATE TEAM =================
  async function handleUpdateTeam(e) {
    e.preventDefault();
    if (!updatedTeamName.trim()) return;

    try {
      setUpdatingTeam(true);
      const res = await api(`/teams/${editingTeam.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: updatedTeamName }),
      });
      setTeams(teams.map((t) => (t.id === res.id ? res : t)));
      setIsEditModalOpen(false);
    } finally {
      setUpdatingTeam(false);
    }
  }

  // ================= DELETE TEAM =================
  async function handleDeleteTeam(id, name) {
    if (!window.confirm(`Delete team "${name}"?`)) return;

    try {
      setDeletingTeamId(id);
      await api(`/teams/${id}`, { method: "DELETE" });
      setTeams(teams.filter((t) => t.id !== id));
    } finally {
      setDeletingTeamId(null);
    }
  }

  return (
    <div className="bg-[#05080E] rounded-xl p-5 shadow-lg">
      <div className="flex justify-between mb-4">
        <h2 className="text-white font-semibold text-sm">Teams</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-sky-500 text-white px-2 py-1 rounded-full font-bold"
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
              className="flex items-center px-3 py-2 rounded hover:bg-sky-500/10 text-gray-300"
            >
              <span
                className="flex-1 cursor-pointer"
                onClick={() => openMembersModal(team)}
              >
                {team.name}
              </span>

              {isOwner(team) && (
                <>
                  <button
                    onClick={() => {
                      setEditingTeam(team);
                      setUpdatedTeamName(team.name);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <PencilLine className="w-4 h-4 text-yellow-400" />
                  </button>

                  <button
                    onClick={() => handleDeleteTeam(team.id, team.name)}
                    className="ml-2"
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* ================= MEMBERS MODAL ================= */}
      {isMembersModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[#0A101F] w-96 max-h-[85vh] overflow-y-auto rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold">
                {activeTeam?.name} Members
              </h3>
              <button onClick={() => setIsMembersModalOpen(false)}>
                <X className="text-gray-400 w-5 h-5" />
              </button>
            </div>

            {/* MEMBERS */}
            <div className="max-h-40 overflow-y-auto space-y-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center bg-[#111827] px-3 py-2 rounded"
                >
                  <div>
                    <p className="text-white text-sm">
                      {m.first_name} {m.last_name}
                    </p>
                    <p className="text-gray-400 text-xs">{m.email}</p>
                  </div>
                  {isOwner(activeTeam) && (
                    <button onClick={() => removeMember(m.id)}>
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* AVAILABLE USERS */}
            {isOwner(activeTeam) && (
              <div>
                <h4 className="text-gray-300 text-sm mb-2">Add Members</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {availableUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex justify-between items-center bg-[#111827] px-3 py-2 rounded"
                    >
                      <div>
                        <p className="text-white text-sm">
                          {u.first_name} {u.last_name}
                        </p>
                        <p className="text-gray-400 text-xs">{u.email}</p>
                      </div>
                      <button onClick={() => addMember(u)}>
                        <Cross className="w-4 h-4 text-sky-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= CREATE MODAL ================= */}
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

      {/* ================= EDIT MODAL ================= */}
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
    </div>
  );
}
