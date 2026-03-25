import express from "express";
import {
  createReview,
  getReviews,
  getReviewById,
  deleteReview,
} from "../controllers/reviewController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.use(protect);

router.post("/", createReview);
router.get("/", getReviews);
router.get("/:id", getReviewById);
router.delete("/:id", deleteReview);

export default router;
