const service = require("../services/todo.service");

const getAllTodos = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy } = req.query;
    const todos = await service.getAllTodos({ search, status, priority, sortBy });
    res.json({ todos, count: todos.length });
  } catch (err) {
    next(err);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const todo = await service.getTodoById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Task not found" });
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const todo = await service.createTodo({ title, description, priority, dueDate });
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const todo = await service.updateTodo(req.params.id, req.body);
    if (!todo) return res.status(404).json({ message: "Task not found" });
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { completed } = req.body;
    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "'completed' must be a boolean" });
    }
    const todo = await service.updateStatus(req.params.id, completed);
    if (!todo) return res.status(404).json({ message: "Task not found" });
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todo = await service.deleteTodo(req.params.id);
    if (!todo) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTodos, getTodoById, createTodo, updateTodo, updateStatus, deleteTodo };
