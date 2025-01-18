require("dotenv").config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { connectToDb,userModel } = require('../database/index');
const {userAuthJWT, secret } = require("../middleware/user");
app.use(express.json());

connectToDb();

app.post("/signup",async(req,res) => {
    const {username , password} = req.body;
    const existingUser = await userModel.findOne({username});
    if(existingUser){
        return res.status(403).json({message : "user already exist"});
    }
    
    const newUser = await userModel.create({
        password: password,
        username: username,
    });

    const token = jwt.sign({userId: newUser._id} , secret, { expiresIn: '1h' });

    if(token){
        return res.json({message: "token created successfully" , token});
    }
    return res.status(500).json({message:"error creating user"});
    
})

app.post('/signin', async (req, res) => {
    const { username, password } = req.body; 
    try {
      const user = await userModel.findOne({ username, password });
      if (user) {
        const token = jwt.sign({username}, secret, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
      } else {
        res.status(403).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error signing in', error });
    }
  });

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});