const express = require('express');
const app = express();
const userRouter = require("./routes/user");
const todoRouter = require("./routes/todo");
const {connectToDb} = require('./database/index');
connectToDb();

app.use("/user",userRouter);
app.use("/todo",todoRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
