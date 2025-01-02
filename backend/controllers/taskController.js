const Task = require('../models/Task');
const db = Task.db;

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
  
  const { description, date, shift, startTime, endTime, hoursWorked, category } = req.body;
  const userId = req.user.id; // Get userId from authenticated user
  
  const sql = `
    INSERT INTO tasks (description, date, shift, startTime, endTime, hoursWorked, category, userId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [description, date, shift, startTime, endTime, hoursWorked, category, userId], function(err) {
    if (err) {
      console.error('Error creating task:', err);
      return res.status(400).json({ message: err.message });
    }
    
    // Get the newly created task
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, task) => {
      if (err) {
        console.error('Error fetching new task:', err);
        return res.status(500).json({ message: err.message });
      }
      console.log('Successfully created task:', task);
      res.status(201).json(task);
    });
  });
};

const updateTask = async (req, res) => {
  const { description, date, shift, startTime, endTime, hoursWorked } = req.body;
  
  const sql = `
    UPDATE tasks 
    SET description = ?, date = ?, shift = ?, startTime = ?, endTime = ?, hoursWorked = ?
    WHERE id = ?
  `;
  
  db.run(sql, [description, date, shift, startTime, endTime, hoursWorked, req.params.id], (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, task) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    });
  });
};

const deleteTask = async (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Task deleted' });
  });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
}; 