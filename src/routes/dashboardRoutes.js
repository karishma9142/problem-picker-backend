import express from "express";
import { requireAuth, getAuth } from "@clerk/express";
import Progress from "../modules/Progress.js";

const router = express.Router();

router.get("/", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const progress = await Progress.find({ userId }).populate("questionId");

    const grouped = {};

    progress.forEach((p) => {
      if (!p.day) return; // ❌ skip bad data

      if (!grouped[p.day]) {
        grouped[p.day] = [];
      }

      grouped[p.day].push({
        question: p.questionId?.title || "Unknown Question",
        status: p.status,
      });
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;