import mongoose from 'mongoose';

const tasksSchema = new mongoose.Schema(
  {
    tasks:  { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const tasksCollection = mongoose.model('tasks', tasksSchema);
export default tasksCollection;
