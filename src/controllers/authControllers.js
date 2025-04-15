import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User";
dotenv.config();

const generateToken = user => {
    return jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE_IN}
    );
};

export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if(existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword})
        await User.save();

        res.status(200).json({ message: "User registered successfully" })
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;
     try {
        const user = User.findOne({ username });
        if(!user) return res.status(401).json({ message: "Invalid credential" });

        const isMatch = await bcrypt(password, user.password);
        if(!isMatch) return res.status(401).json({ message: "Invalid credential" });
        const token = generateToken(user);
        res.status(200).json({ token })
     } catch (err) {
        res.status(500).json({ message: "Internal server error" });
     }
}