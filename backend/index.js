const express = require('express');
const app = express();
const userRouter = require("./routes/user");
const todoRouter = require("./routes/todo");
const { connectToDb } = require('./database/index');
const cors = require('cors');
require('dotenv').config(); // Also needed to read .env values

connectToDb();

// 🔧 Middleware fixes
app.use(cors());           // 🛠 You were missing parentheses — should be cors()
app.use(express.json());   // 🛠 Needed to parse JSON requests globally

app.use("/user", userRouter);
app.use("/todo", todoRouter);

// 🛠 Ensure PORT is loaded from .env
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
