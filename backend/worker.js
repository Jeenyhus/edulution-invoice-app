const { exec } = require('child_process');
const { initializeDb } = require('./config/db');

console.log('Starting worker to run initialization scripts...');

initializeDb()
  .then(() => {
    console.log('Database initialized successfully');
    const scripts = [
      'setupDepartmentsAndCareers.js',
      'migrateUsers.js',
      'createAdminUser.js',
    ];

    const runScript = (index) => {
      if (index >= scripts.length) {
        console.log('All initialization scripts completed successfully');
        process.exit(0); // This exits the process, which is fine for build phase
      }

      const script = scripts[index];
      console.log(`Executing ${script}...`);
      exec(`node scripts/${script}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing ${script}: ${error.message}`);
          process.exit(1);
        }
        if (stderr) {
          console.warn(`Warnings in ${script}: ${stderr}`);
        }
        console.log(`${script} completed: ${stdout}`);
        runScript(index + 1);
      });
    };

    runScript(0);
  })
  .catch((err) => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });