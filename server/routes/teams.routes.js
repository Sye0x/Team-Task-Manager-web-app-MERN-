const router = require("express").Router();
const isAuth = require("../middleware/isAuth");
const {
  createTeam,
  getTeams,
} = require("../controllers/teams.controller");

router.post("/", isAuth, createTeam);
router.get("/", isAuth, getTeams);

module.exports = router;
