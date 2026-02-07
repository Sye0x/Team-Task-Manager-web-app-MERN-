const pool = require("../db");

exports.createTeam = async (req, res) => {
  const { name } = req.body;

  const teamResult = await pool.query(
    "INSERT INTO teams (name, owner_id) VALUES ($1, $2) RETURNING *",
    [name, req.user.id],
  );

  const team = teamResult.rows[0];

  await pool.query(
    "INSERT INTO team_members (user_id, team_id) VALUES ($1, $2)",
    [req.user.id, team.id],
  );

  res.json(team);
};

exports.getTeams = async (req, res) => {
  const result = await pool.query(
    `
    SELECT t.*
    FROM teams t
    JOIN team_members tm ON t.id = tm.team_id
    WHERE tm.user_id = $1
    `,
    [req.user.id],
  );

  res.json(result.rows);
};
