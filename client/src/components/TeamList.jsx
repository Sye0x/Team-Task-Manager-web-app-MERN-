export default function TeamList({ teams, onSelect }) {
  return (
    <ul className="space-y-2">
      {teams.map((team) => (
        <li
          key={team.id}
          className="cursor-pointer p-2 hover:bg-gray-100"
          onClick={() => onSelect(team)}
        >
          {team.name}
        </li>
      ))}
    </ul>
  );
}
