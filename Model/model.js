const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema(
  {
    tasks:  { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('tasks', tasksSchema);
