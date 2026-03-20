const Todo = require("../models/todo.model");

const getAllTodos = async ({ search, status, priority, sortBy }) => {
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (status === "completed") query.completed = true;
  if (status === "pending") query.completed = false;
  if (priority && priority !== "all") query.priority = priority;

  const sortMap = {
    createdAt: { createdAt: -1 },
    dueDate: { dueDate: 1 },
    priority: { priority: -1 },
    title: { title: 1 },
  };
  const sort = sortMap[sortBy] || { createdAt: -1 };

  return await Todo.find(query).sort(sort);
};

const getTodoById = async (id) => {
  return await Todo.findById(id);
};

const createTodo = async (data) => {
  const todo = new Todo(data);
  return await todo.save();
};

const updateTodo = async (id, data) => {
  return await Todo.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const updateStatus = async (id, completed) => {
  return await Todo.findByIdAndUpdate(id, { completed }, { new: true });
};

const deleteTodo = async (id) => {
  return await Todo.findByIdAndDelete(id);
};

module.exports = { getAllTodos, getTodoById, createTodo, updateTodo, updateStatus, deleteTodo };
