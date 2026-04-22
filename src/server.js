import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDB, disconnectDB, prisma } from "./config/db.js";
// Import routes
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";


config(); // Load environment variables from .env file
connectDB(); // Connect to the database

const app = express();

// cors middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],  // Your frontend URLs
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);

const PORT = process.env.PORT || 5001;

const server = app.listen(process.env.PORT || 5001, "0.0.0.0", () => {
    console.log(`Server running on PORT ${process.env.PORT}`);
  });

// Handle unhandled promise rejections and uncaught exceptions (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

//Handle uncaught exceptions (e.g., syntax errors, reference errors)
process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle graceful shutdown on SIGINT (e.g., Ctrl+C)
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully...");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
})