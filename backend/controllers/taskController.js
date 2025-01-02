const Task = require('../models/Task');
const { db } = require('../config/db');

const getTasks = async (req, res) => {
  console.log('Received GET request for tasks');
  
  try {
    const tasks = await Task.getAllTasks();
    console.log(`Found ${tasks.length} tasks`);
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
  console.log('Received POST request for task creation:', req.body);
  
  try {
    const { description, date, shift, startTime, endTime, hoursWorked, category } = req.body;
    const userId = req.user.id;
    
    const taskId = await Task.createTask({
      description,
      date,
      shift,
      startTime,
      endTime,
      hoursWorked,
      category,
      userId
    });
    
    const newTask = await Task.getTaskById(taskId);
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ 
      message: 'Error creating task',
      error: err.message 
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const changes = await Task.updateTask(id, req.body);
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