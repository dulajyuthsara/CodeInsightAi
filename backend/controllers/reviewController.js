import Review from "../models/Review.js";
import { analyzeCode } from "../services/openaiService.js";

export const createReview = async (req, res) => {
  const { code, language } = req.body;

  if (!code || typeof code !== "string" || code.trim().length < 5) {
    return res.status(400).json({ error: "Code is required" });
  }

  const allowedLangs = ["javascript", "typescript", "python", "java", "cpp", "go", "rust"];
  if (!allowedLangs.includes(language)) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  try {
    const result = await analyzeCode(code, language);

    const review = await Review.create({
      userId: req.user.id,
      language,
      codeSnippet: code.slice(0, 500),
      result,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("Review error:", err.message);
    res.status(500).json({ error: "Analysis failed. Please try again." });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id })
      .select("language codeSnippet result.rating createdAt")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch reviews" });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch review" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete review" });
  }
};
