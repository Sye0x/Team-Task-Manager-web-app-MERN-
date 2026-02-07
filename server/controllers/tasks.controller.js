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
    SELECT tasks.*, users.email AS assigned_email
    FROM tasks
    LEFT JOIN users ON users.id = tasks.assigned_to
    WHERE team_id = $1
    `,
    [team_id],
  );

  res.json(result.rows);
};

exports.updateTask = async (req, res) => {
  const { assigned_to, completed } = req.body;

  const result = await pool.query(
    `
    UPDATE tasks
    SET assigned_to = $1, completed = $2
    WHERE id = $3
    RETURNING *
    `,
    [assigned_to, completed, req.params.id],
  );

  res.json(result.rows[0]);
};
