require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

require("./passport");

const authRoutes = require("./routes/auth.routes");
const teamRoutes = require("./routes/teams.routes");
const taskRoutes = require("./routes/tasks.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/teams", teamRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
