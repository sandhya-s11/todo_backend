import tasksCollection from '../Model/model.js';

// POST /tasks/addtodo
export const addToDo = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!tasks || typeof tasks !== 'string' || tasks.trim().length === 0) {
      return res.status(400).json({ message: 'Task text is required.' });
    }

    const data = await tasksCollection.create({ tasks: tasks.trim(), userId: req.user.id });
    res.status(201).json({ message: 'Task added successfully.', task: data });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// GET /tasks/gettodo
export const getToDo = async (req, res) => {
  try {
    const data = await tasksCollection.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// PATCH /tasks/updatetodo/:id
export const updateToDo = async (req, res) => {
  try {
    const { id } = req.params;
    const { tasks } = req.body;

    if (!tasks || typeof tasks !== 'string' || tasks.trim().length === 0) {
      return res.status(400).json({ message: 'Task text is required.' });
    }

    const task = await tasksCollection.findOne({ _id: id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    task.tasks = tasks.trim();
    await task.save();

    res.status(200).json({ message: 'Task updated successfully.', task });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// DELETE /tasks/deletetodo/:id
export const deleteToDo = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await tasksCollection.findOne({ _id: id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
