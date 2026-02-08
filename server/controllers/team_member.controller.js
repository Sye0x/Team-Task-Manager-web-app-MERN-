getTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;

    const membership = await pool.query(
      `
      SELECT 1
      FROM team_members
      WHERE team_id = $1 AND user_id = $2
      `,
      [teamId, userId],
    );

    if (membership.rowCount === 0) {
      return res.json([]);
    }

    const { rows } = await pool.query(
      `
      SELECT u.id, u.name
      FROM users u
      JOIN team_members tm ON tm.user_id = u.id
      WHERE tm.team_id = $1
      ORDER BY u.name
      `,
      [teamId],
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch team members" });
  }
};
