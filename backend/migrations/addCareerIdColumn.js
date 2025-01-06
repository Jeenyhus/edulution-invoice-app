const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../config/database.sqlite'));

const addCareerIdColumn = () => {
  return new Promise((resolve, reject) => {
    // First check if column exists
    db.get("PRAGMA table_info(users)", (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      // Add the column if it doesn't exist
      db.run(`
        ALTER TABLE users 
        ADD COLUMN career_id INTEGER REFERENCES careers(id)
      `, (err) => {
        if (err) {
          // If error is about column already existing, resolve successfully
          if (err.message.includes('duplicate column')) {
            console.log('Column already exists');
            resolve();
          } else {
            console.error('Migration error:', err);
            reject(err);
          }
        } else {
          console.log('Successfully added career_id column');
          resolve();
        }
      });
    });
  });
};

// Run the migration
addCareerIdColumn()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  }); 