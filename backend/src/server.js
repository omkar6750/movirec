dotenv.config();
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import passport from "passport";

import "../config/passport.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import moviesRoute from "./routes/movies.js";
import posterRoute from "./routes/poster.js";
import recommendRoute from "./routes/recommend.js";
import searchRoute from "./routes/search.js";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genres.js";


const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Initialize Passport
app.use(passport.initialize());

// Base Route
app.get("/", (req, res) => {
    res.json({ message: "Backend is running" });
});



// Auth Routes 
app.use("/", authRoutes);

// User Routes (Favourites/Watchlist)
app.use("/api/user", userRoutes);

// Feature Routes
app.use("/api/movies", moviesRoute);
app.use("/api/poster", posterRoute);
app.use("/api/recommendations", recommendRoute);
app.use("/api/search", searchRoute);
app.use("/api/genres", genreRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});