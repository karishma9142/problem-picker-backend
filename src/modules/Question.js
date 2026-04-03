import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  platform: {
    type: String,
    default: 'LeetCode',
  },
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

export default Question;