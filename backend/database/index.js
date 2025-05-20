const mongoose = require("mongoose");
require('dotenv').config(); // Ensure this is only used once in the whole project

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
};

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { collection: 'users' }); // Optional: makes it explicit

const TodoSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
}, { collection: 'todos' });

const userModel = mongoose.model('users', UserSchema);
const todoModel = mongoose.model('todos', TodoSchema);

module.exports = {
    connectToDb,
    userModel,
    todoModel,
};
