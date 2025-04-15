import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { reqTime } from "./middleware/reqTime.js";
import { protect } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(reqTime);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB error:", err));

// Routes
app.use("/api/auth", authRoutes);


// Protected example route
app.get("/api/profile", protect, (req, res) => {
    res.json({
        message: `Welcome ${req.user.username}`,
        requestTime: new Date(req.requestTime).toISOString()
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
