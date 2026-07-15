const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const query = { user: req.user.id };
    const { search, status, priority, due, sort } = req.query;

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } }
      ];
    }

    if (status === 'active') query.completed = false;
    else if (status === 'completed') query.completed = true;

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    if (due === 'today') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: start, $lte: end };
    } else if (due === 'overdue') {
      query.dueDate = { $lt: new Date() };
      query.completed = false;
    } else if (due === 'upcoming') {
      query.dueDate = { $gte: new Date() };
      query.completed = false;
    }

    let sortOption;
    switch (sort) {
      case 'dueDate': sortOption = { dueDate: 1, createdAt: -1 }; break;
      case 'priority': sortOption = { priority: -1, createdAt: -1 }; break;
      case 'title': sortOption = { title: 1 }; break;
      case 'oldest': sortOption = { createdAt: 1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    const tasks = await Task.find(query).sort(sortOption);
    res.json({ tasks });
  } catch (error) {
    console.error('getTasks error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (title.trim().length > 200) {
      return res.status(400).json({ message: 'Title cannot exceed 200 characters' });
    }

    const task = await Task.create({
      user: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      dueDate: dueDate || null
    });

    res.status(201).json({ task });
  } catch (error) {
    console.error('createTask error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Title cannot be empty' });
      }
      if (title.trim().length > 200) {
        return res.status(400).json({ message: 'Title cannot exceed 200 characters' });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (completed !== undefined) {
      task.completed = completed;
    }

    if (priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority' });
      }
      task.priority = priority;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }

    await task.save();
    res.json({ task });
  } catch (error) {
    console.error('updateTask error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('deleteTask error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed;
    await task.save();
    res.json({ task });
  } catch (error) {
    console.error('toggleTask error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const [total, completed, dueToday, overdue, highPriority] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, completed: true }),
      Task.countDocuments({ user: userId, dueDate: { $gte: startOfDay, $lte: endOfDay } }),
      Task.countDocuments({ user: userId, dueDate: { $lt: now }, completed: false }),
      Task.countDocuments({ user: userId, priority: 'high', completed: false })
    ]);

    res.json({
      stats: { total, completed, remaining: total - completed, dueToday, overdue, highPriority }
    });
  } catch (error) {
    console.error('getStats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, toggleTask, getStats };
