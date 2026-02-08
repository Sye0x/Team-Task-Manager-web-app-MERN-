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

// DELETE /teams/:id
exports.deleteTeam = async (req, res) => {
  const { id } = req.params;

  try {
    // Optionally, check if the user is owner
    const team = await pool.query("SELECT * FROM teams WHERE id = $1", [id]);
    if (!team.rows.length) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team.rows[0].owner_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this team" });
    }

    // Delete team members first (foreign key constraint)
    await pool.query("DELETE FROM team_members WHERE team_id = $1", [id]);

    // Delete the team
    await pool.query("DELETE FROM teams WHERE id = $1", [id]);

    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete team" });
  }
};

// PUT /teams/:id
exports.updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Fetch team to check ownership
    const teamResult = await pool.query("SELECT * FROM teams WHERE id = $1", [
      id,
    ]);
    if (!teamResult.rows.length) {
      return res.status(404).json({ error: "Team not found" });
    }

    const team = teamResult.rows[0];
    if (team.owner_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this team" });
    }

    // Update team name
    const updatedTeamResult = await pool.query(
      "UPDATE teams SET name = $1 WHERE id = $2 RETURNING *",
      [name, id],
    );

    res.json(updatedTeamResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update team" });
  }
};

// GET /teams/:id/members
exports.getTeamMembers = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await pool.query(
    `
    SELECT u.id, u.first_name, u.last_name, u.email
    FROM team_members tm
    JOIN users u ON u.id = tm.user_id
    WHERE tm.team_id = $1
      AND tm.user_id != $2
    `,
    [id, userId],
  );

  res.json(result.rows);
};

// POST /teams/:id/members
exports.addTeamMember = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const userResult = await pool.query(
    "SELECT id, first_name, last_name FROM users WHERE email = $1",
    [email],
  );

  if (!userResult.rows.length) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = userResult.rows[0];

  await pool.query(
    "INSERT INTO team_members (user_id, team_id) VALUES ($1, $2)",
    [user.id, id],
  );

  res.json(user);
};

// DELETE /teams/:teamId/members/:userId
exports.removeTeamMember = async (req, res) => {
  const { teamId, userId } = req.params;

  await pool.query(
    "DELETE FROM team_members WHERE team_id = $1 AND user_id = $2",
    [teamId, userId],
  );

  res.json({ message: "Member removed" });
};

// GET /teams/:id/available-users
exports.getAvailableUsers = async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;

  const result = await pool.query(
    `
    SELECT u.id, u.first_name, u.last_name, u.email
    FROM users u
    WHERE u.id != $1
      AND u.id NOT IN (
        SELECT user_id
        FROM team_members
        WHERE team_id = $2
      )
    ORDER BY u.first_name
    `,
    [currentUserId, id],
  );

  res.json(result.rows);
};
