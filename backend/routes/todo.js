const express = require('express');
const Todo = require('../database/todoModel');
const auth = require('../middleware/auth');
const router = express.Router();

// Apply auth middleware to all todo routes
router.use(auth);

// Get all todos for the logged-in user
router.get('/', async (req, res) => {
  try {
    // Find todos for current user
    const todos = await Todo.find({ userId: req.userId });

    res.json({ todos });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching todos',
      error: error.message
    });
  }
});

// Create a new todo
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Create new todo
    const newTodo = await Todo.create({
      title,
      userId: req.userId,
      completed: false
    });

    res.status(201).json({
      message: 'Todo added successfully',
      todo: newTodo
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating todo',
      error: error.message
    });
  }
});

// Update a todo (mark as completed/uncompleted)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    // Check if completed is provided
    if (completed === undefined) {
      return res.status(400).json({ message: 'Completed status is required' });
    }

    // Find and update todo
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { completed },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or not authorized' });
    }

    res.json({
      message: 'Todo updated successfully',
      todo
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating todo',
      error: error.message
    });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete todo
    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or not authorized' });
    }

    res.json({
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting todo',
      error: error.message
    });
  }
});

module.exports = router;
