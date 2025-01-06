const { db } = require('../config/db');

const departments = [
  {
    name: 'Accounts Department',
    careers: ['Junior Accountant', 'Senior Accountant']
  },
  {
    name: 'Technology Department',
    careers: ['Technical Support', 'Junior Software Developer', 'Senior Software Developer', 'Hardware Support']
  },
  {
    name: 'Operations Department',
    careers: ['Office Manager', 'Assistant Office Manager', 'Operations Officer']
  },
  {
    name: 'Quality Assurance',
    careers: ['Field Coordinator', 'Silver Star Coach']
  }
];

async function setupDepartmentsAndCareers() {
  try {
    // Check existing departments
    const existingDepartments = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM departments', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    // Only insert departments that don't exist
    for (const dept of departments) {
      if (!existingDepartments.some(d => d.name === dept.name)) {
        await new Promise((resolve, reject) => {
          db.run('INSERT INTO departments (name) VALUES (?)', [dept.name], function(err) {
            if (err) {
              console.error('Error inserting department:', err);
              reject(err);
              return;
            }
            
            const departmentId = this.lastID;
            
            // Insert careers for this department
            const careerPromises = dept.careers.map(career => {
              return new Promise((resolve, reject) => {
                db.run('INSERT INTO careers (name, department_id) VALUES (?, ?)',
                  [career, departmentId],
                  (err) => {
                    if (err) {
                      console.error('Error inserting career:', err);
                      reject(err);
                    } else {
                      resolve();
                    }
                  }
                );
              });
            });

            Promise.all(careerPromises)
              .then(() => resolve())
              .catch(reject);
          });
        });
      }
    }
    
    console.log('Departments and careers setup completed');
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  }
}

module.exports = setupDepartmentsAndCareers; 