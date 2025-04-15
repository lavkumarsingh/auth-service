import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(_=> console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error", err))

// Routes
app.use(authRoutes);

// Protected Route
app.get("/api/profile", protect, (req, res) => {
    res.json({
        message: `Welcome ${req.user.username}`,
        requestTime: new Date(req.requestTime).toISOString()
    });
});

app.listen(port, () => {
    console.log(`Server running on port ::: ${port}`)
});