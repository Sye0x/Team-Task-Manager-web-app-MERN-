const pool = require("../db");

// Create a new task
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

// Get tasks for a team
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

// Update a task (title, description, assigned_to, or completed)
exports.updateTask = async (req, res) => {
  const { title, description, assigned_to, completed } = req.body;

  const result = await pool.query(
    `
    UPDATE tasks
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      assigned_to = COALESCE($3, assigned_to),
      completed = COALESCE($4, completed)
    WHERE id = $5
    RETURNING *
    `,
    [title, description, assigned_to, completed, req.params.id],
  );

  res.json(result.rows[0]);
};

exports.updateTaskStatus = async (req, res) => {
  const { completed } = req.body;

  const result = await pool.query(
    `
    UPDATE tasks
    SET completed = $1
    WHERE id = $2
    RETURNING *
    `,
    [completed, req.params.id],
  );

  res.json(result.rows[0]);
};

// Delete task (only creator can delete)
exports.deleteTask = async (req, res) => {
  await pool.query("DELETE FROM tasks WHERE id = $1 AND created_by = $2", [
    req.params.id,
    req.user.id,
  ]);

  res.json({ success: true });
};
