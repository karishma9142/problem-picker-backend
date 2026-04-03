import express from "express";
import { requireAuth, getAuth } from "@clerk/express";
import Progress from "../modules/Progress.js";
import Question from "../modules/Question.js";

const router = express.Router();

// ✅ Mark solved / skipped
router.post("/update", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { questionId, status } = req.body;

    if (!questionId || !status) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const today = new Date().toISOString().split("T")[0];

    const progress = await Progress.findOneAndUpdate(
      { userId, questionId },
      {
        status,
        day: today,   // ✅ ALWAYS SET THIS
        date: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all-status", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const questions = await Question.find();

    const progress = await Progress.find({ userId });

    // map progress for quick lookup
    const map = {};

    progress.forEach((p) => {
      map[p.questionId.toString()] = p.status;
    });

    const result = questions.map((q) => ({
      id: q._id,
      title: q.title,
      status: map[q._id] || "unsolved",
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;