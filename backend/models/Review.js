import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    // Store only a snippet of the original code to save space
    codeSnippet: {
      type: String,
      maxlength: 500,
    },
    result: {
      bugs: [{ text: String, line: String, fix: String }],
      security_issues: [{ text: String, line: String, fix: String }],
      improvements: [{ text: String, line: String, fix: String }],
      summary: String,
      rating: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
