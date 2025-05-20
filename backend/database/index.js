const mongoose = require("mongoose");
require('dotenv').config();


const connectToDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected");
    } catch(error){
        console.log("database not connected");
    }
}

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    username: String,
    password: String,
});

const TodoSchema = new Schema({
    userId: ObjectId,
    title: String,
    completed: Boolean,
});

const userModel = mongoose.model('users', UserSchema);
const todoModel = mongoose.model('todos', TodoSchema);

module.exports = {
    connectToDb,
    userModel,
    todoModel,
};
