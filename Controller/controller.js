const Task = require('../Model/model');

exports.addToDo = async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!tasks || !tasks.trim()) return res.status(400).json({ message: 'Task text is required.' });
    const data = await Task.create({ tasks: tasks.trim(), userId: req.user.id });
    res.status(201).json({ message: 'Task added successfully.', task: data });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.getToDo = async (req, res) => {
  try {
    const data = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.updateToDo = async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!tasks || !tasks.trim()) return res.status(400).json({ message: 'Task text is required.' });
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found or unauthorized.' });
    task.tasks = tasks.trim();
    await task.save();
    res.status(200).json({ message: 'Task updated successfully.', task });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.deleteToDo = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found or unauthorized.' });
    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
