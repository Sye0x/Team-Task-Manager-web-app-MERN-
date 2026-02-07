const router = require("express").Router();
const passport = require("passport");
const { register, login, me } = require("../controllers/auth.controller");
const isAuth = require("../middleware/isAuth");

router.post("/register", register);
router.post("/login", passport.authenticate("local"), login);
router.get("/me", isAuth, me);

module.exports = router;
