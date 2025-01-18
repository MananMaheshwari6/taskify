const express = require('express');
const router = express.Router();
const { todoModel } = require('../database/index');
const { userAuthJWT } = require("../middleware/user");
router.use(express.json());
router.use(userAuthJWT);

router.get("/", async (req, res) => {
    try {
        const todos = await todoModel.find({ userId: req.userId });
        res.json({ todos: todos });
    } catch (error) {
        res.status(500).json({
            msg: "Error fetching todos",
            error: error.message,
        });
    }
});

router.post("/", async (req, res) => {
    const payload = req.body;
    try {
        const newTodo = await todoModel.create({
            userId: req.userId,
            title: payload.title,
            completed: false,
        });

        res.status(201).json({
            message: "Todo added successfully",
            todo: newTodo,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating todo", error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    const todoId = req.params.id;
    try {
        await todoModel.updateOne({ _id: req.params.id }, { completed: req.body.completed });
        res.json({ message: "Todo updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating todo", error: error.message });
    }
});

module.exports = router;
