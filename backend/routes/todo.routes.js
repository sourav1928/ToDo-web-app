const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/todo.controller");

router.get("/", ctrl.getAllTodos);
router.get("/:id", ctrl.getTodoById);
router.post("/", ctrl.createTodo);
router.put("/:id", ctrl.updateTodo);
router.patch("/:id/status", ctrl.updateStatus);
router.delete("/:id", ctrl.deleteTodo);

module.exports = router;
