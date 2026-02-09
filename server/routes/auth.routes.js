const router = require("express").Router();
const passport = require("passport");
const {
  register,
  login,
  me,
  logout,
} = require("../controllers/auth.controller");
const isAuth = require("../middleware/isAuth");

router.post("/register", register);
router.post("/login", passport.authenticate("local"), login);
router.get("/me", isAuth, me);
router.post("/logout", isAuth, logout);

module.exports = router;
