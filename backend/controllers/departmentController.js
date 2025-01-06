const { db } = require('../config/db');

const getDepartments = async (req, res) => {
  try {
    db.all(`
      SELECT 
        d.*,
        GROUP_CONCAT(c.id || ':' || c.name) as careers
      FROM departments d
      LEFT JOIN careers c ON d.id = c.department_id
      GROUP BY d.id
    `, [], (err, rows) => {
      if (err) {
        console.error('Error fetching departments:', err);
        return res.status(500).json({ error: 'Failed to fetch departments' });
      }

      // Transform the results to include careers as an array
      const departments = rows.map(row => {
        const careers = row.careers 
          ? row.careers.split(',').map(career => {
              const [id, name] = career.split(':');
              return { id: parseInt(id), name };
            })
          : [];
        
        return {
          id: row.id,
          name: row.name,
          careers
        };
      });

      res.json(departments);
    });
  } catch (error) {
    console.error('Error in getDepartments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addDepartment = async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Department name is required' });
  }

  try {
    db.run('INSERT INTO departments (name) VALUES (?)', [name], function(err) {
      if (err) {
        console.error('Error adding department:', err);
        return res.status(500).json({ error: 'Failed to add department' });
      }
      
      res.status(201).json({
        id: this.lastID,
        name,
        careers: []
      });
    });
  } catch (error) {
    console.error('Error in addDepartment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addCareer = async (req, res) => {
  const { departmentId } = req.params;
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Career name is required' });
  }

  try {
    db.run(
      'INSERT INTO careers (name, department_id) VALUES (?, ?)',
      [name, departmentId],
      function(err) {
        if (err) {
          console.error('Error adding career:', err);
          return res.status(500).json({ error: 'Failed to add career' });
        }
        
        res.status(201).json({
          id: this.lastID,
          name,
          department_id: departmentId
        });
      }
    );
  } catch (error) {
    console.error('Error in addCareer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDepartments,
  addDepartment,
  addCareer
}; 