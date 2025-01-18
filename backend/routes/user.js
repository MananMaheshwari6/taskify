const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { userModel } = require('../database/index');
const { userAuthJWT, secret } = require("../middleware/user");
router.use(express.json());

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
        return res.status(403).json({ message: "User already exists" });
    }

    const newUser = await userModel.create({
        password: password,
        username: username,
    });

    const token = jwt.sign({ userId: newUser._id }, secret, { expiresIn: '1h' });

    if (token) {
        return res.json({ message: "Token created successfully", token });
    }
    return res.status(500).json({ message: "Error creating user" });
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userModel.findOne({ username, password });
        if (user) {
            const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
            res.json({ message: 'Logged in successfully', token });
        } else {
            res.status(403).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error signing in', error });
    }
});

module.exports = router;
