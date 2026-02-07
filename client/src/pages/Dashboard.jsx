import { useEffect, useState } from "react";
import { api } from "../api/api";
import TeamList from "../components/TeamList";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    api("/teams").then(setTeams);
  }, []);

  return (
    <div className="h-screen grid grid-cols-4">
      <aside className="border-r p-4">
        <h2 className="font-bold mb-4">Teams</h2>
        <TeamList teams={teams} onSelect={setSelectedTeam} />
      </aside>

      <main className="col-span-3 p-4">
        {selectedTeam ? <TaskList team={selectedTeam} /> : <p>Select a team</p>}
      </main>
    </div>
  );
}
