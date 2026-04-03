import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },

  status: {
    type: String,
    enum: ["solved", "skipped", "unsolved"],
    default: "unsolved",
  },

  // 📅 used for grouping (LeetCode style)
  day: {
    type: String,
    required: true,
    default: () => new Date().toISOString().split("T")[0],
  },

  // 🕒 real timestamp
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Progress", progressSchema);