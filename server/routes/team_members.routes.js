const router = require("express").Router();
const isAuth = require("../middleware/isAuth");
const { getTeamMembers } = require("../controllers/team_member.controller");

router.get("/:teamId", isAuth, getTeamMembers);
router.post("/user_id", isAuth, addTeamMember);

module.exports = router;
