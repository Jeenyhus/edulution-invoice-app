const Task = require('../models/Task');
const { db } = require('../config/db');

const getTasks = async (req, res) => {
  console.log('Received GET request for tasks');
  
  try {
    const userId = req.user.id;
    const tasks = await Task.getAllTasks(userId);
    console.log(`Found ${tasks.length} tasks for user ${userId}`);
    res.json(tasks);
  } catch (err) {
    console.error('Error in getTasks:', err);
    return res.status(500).json({ 
      message: 'Error fetching tasks',
      error: err.message 
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { description, date, shift, startTime, endTime, hoursWorked } = req.body;
    const userId = req.user.id;
    
    // Get user's career from the database
    const getUserCareer = () => {
      return new Promise((resolve, reject) => {
        db.get('SELECT career FROM users WHERE id = ?', [userId], (err, user) => {
          if (err) reject(err);
          else resolve(user?.career);
        });
      });
    };

    const userCareer = await getUserCareer();
    
    if (!userCareer) {
      return res.status(400).json({ 
        message: 'User career not found. Please update your profile.' 
      });
    }
    
    // Validate required fields
    if (!description || !date || !shift || !startTime || !endTime || !hoursWorked) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Create task with user's career as category
    const taskId = await Task.createTask({
      description,
      date,
      shift,
      startTime,
      endTime,
      hoursWorked,
      category: userCareer, // Use the career from database
      userId
    });
    
    const newTask = await Task.getTaskById(taskId);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ 
      message: 'Server error while creating task',
      error: error.message 
    });
  }
};

// taskController.js
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // First verify the task belongs to this user
    const existingTask = await Task.getTaskById(id);
    if (!existingTask || existingTask.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Only include category in updateData if it exists in the existing task
    const updateData = {
      ...req.body,
      userId: existingTask.userId  // Preserve the userId
    };

    // Only add category to updateData if it exists in the existing task
    if (existingTask.category) {
      updateData.category = existingTask.category;
    }
    
    console.log('Update data to be sent:', updateData);

    const changes = await Task.updateTask(id, updateData);
    if (changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.getTaskById(id);
    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({
      message: 'Error updating task',
      error: err.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // First verify the task belongs to this user
    const existingTask = await Task.getTaskById(id);
    if (!existingTask || existingTask.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    const changes = await Task.deleteTask(id);
    if (changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ 
      message: 'Error deleting task',
      error: err.message 
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
}; 