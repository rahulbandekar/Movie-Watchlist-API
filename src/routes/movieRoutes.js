import express from "express";
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createMovieSchema, updateMovieSchema } from "../validators/movieValidators.js";

const router = express.Router();

// Public routes
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// Protected routes (require authentication)
router.post("/", authMiddleware, validateRequest(createMovieSchema), createMovie);
router.put("/:id", authMiddleware, validateRequest(updateMovieSchema), updateMovie);
router.delete("/:id", authMiddleware, deleteMovie);

export default router;