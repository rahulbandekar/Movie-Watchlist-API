import express from "express";
import { addToWatchlist, removefromWatchlist, updateWatchlistItem,  } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema, updateWatchlistSchema } from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authMiddleware); // Apply authentication middleware to all routes in this router

router.post("/", validateRequest(addToWatchlistSchema), addToWatchlist);

router.put("/:id", validateRequest(updateWatchlistSchema), updateWatchlistItem);

router.delete("/:id", removefromWatchlist); 


export default router;
