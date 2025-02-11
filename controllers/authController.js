import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function register(req, res) {

    try {

        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({status: 0, message: "All fields are required"});
        }

        const user = await User.findOne({email});

        if(user) {
            return res.status(400).json({status: 0, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({name, email, password: hashedPassword});

        await newUser.save();

        return res.status(201).json({status: 1, message: "User created successfully"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }

}

async function login(req, res) {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user) {
            return res.status(200).json({status: 0, message: "User not found"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            return res.status(200).json({status: 0, message: "Invalid password"});
        }

        const token = jwt.sign({id: user._id}, process.env.SCRETE_KEY, {expiresIn: "1h"});

        return res.status(200).json({status: 1, message: "Login successful", token , user: {name: user.name, email: user.email, _id: user._id}});    

    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);

    }
}





export default {
    register,
    login
}
