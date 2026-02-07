const router = require("express").Router();
const isAuth = require("../middleware/isAuth");
const {
  createTask,
  getTasks,
  updateTask,
} = require("../controllers/tasks.controller");

router.post("/", isAuth, createTask);
router.get("/", isAuth, getTasks);
router.put("/:id", isAuth, updateTask);

module.exports = router;
