const bcrypt = require("bcrypt");
const pool = require("../db");

exports.register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1,$2,$3,$4)",
      [first_name, last_name, email, hashed],
    );

    res.status(200).json({ success: true, message: "Registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

exports.login = (req, res) => {
  try {
    res.json({ success: true, message: "Logged in", user: req.user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.me = (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true, message: "Logged out" });
    });
  });
};
