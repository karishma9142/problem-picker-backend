import express from "express";
import Question from "../modules/Question.js";
import Progress from "../modules/Progress.js";
import mongoose from "mongoose";


const router = express.Router();


router.get("/random", async (req, res) => {
  try {
    const question = await Question.aggregate([
      { $sample: { size: 1 } }
    ]);

    res.json(question[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/unsolved/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const solved = await Progress.find({
      userId,
      status: "solved",
    }).select("questionId");

    const solvedIds = solved.map(
      (p) => new mongoose.Types.ObjectId(p.questionId)
    );

    const filter =
      solvedIds.length > 0
        ? { _id: { $nin: solvedIds } }
        : {};

    const question = await Question.find(filter)
      .skip(Math.floor(Math.random() * 10))
      .limit(1);

    res.json(question[0] || null);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});



export default router;