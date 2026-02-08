const pool = require("../db");

exports.createTask = async (req, res) => {
  const { title, description, team_id, assigned_to } = req.body;

  const result = await pool.query(
    `
    INSERT INTO tasks (title, description, team_id, assigned_to, created_by)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [title, description, team_id, assigned_to, req.user.id],
  );

  res.json(result.rows[0]);
};

exports.getTasks = async (req, res) => {
  const { team_id } = req.query;

  const result = await pool.query(
    `
    SELECT 
      t.*,
      u.id AS assignee_id,
      u.first_name,
      u.last_name
    FROM tasks t
    LEFT JOIN users u ON u.id = t.assigned_to
    WHERE t.team_id = $1
    ORDER BY t.created_at DESC
    `,
    [team_id],
  );

  res.json(result.rows);
};

exports.updateTask = async (req, res) => {
  const { title, description, assigned_to } = req.body;

  const result = await pool.query(
    `
    UPDATE tasks
    SET
      title = $1,
      description = $2,
      assigned_to = $3
    WHERE id = $4
    RETURNING *
    `,
    [title, description, assigned_to || null, req.params.id],
  );

  res.json(result.rows[0]);
};

// controllers/tasks.controller.js
exports.deleteTask = async (req, res) => {
  await pool.query("DELETE FROM tasks WHERE id = $1 AND created_by = $2", [
    req.params.id,
    req.user.id,
  ]);

  res.json({ success: true });
};
