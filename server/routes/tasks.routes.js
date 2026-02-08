const router = require("express").Router();
const isAuth = require("../middleware/isAuth");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/tasks.controller");

router.post("/", isAuth, createTask);
router.get("/", isAuth, getTasks);
router.put("/:id", isAuth, updateTask);
router.delete("/:id", isAuth, deleteTask);

module.exports = router;
