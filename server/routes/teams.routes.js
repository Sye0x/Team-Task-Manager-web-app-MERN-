const router = require("express").Router();
const isAuth = require("../middleware/isAuth");
const {
  createTeam,
  getTeams,
  deleteTeam,
  updateTeam,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  getAvailableUsers,
} = require("../controllers/teams.controller");

router.post("/", isAuth, createTeam);
router.get("/", isAuth, getTeams);
router.delete("/:id", isAuth, deleteTeam);
router.put("/:id", isAuth, updateTeam);

router.get("/:id/members", isAuth, getTeamMembers);
router.post("/:id/members", isAuth, addTeamMember);
router.delete("/:teamId/members/:userId", isAuth, removeTeamMember);
router.get("/:id/available-users", isAuth, getAvailableUsers);

module.exports = router;
