const { exec } = require('child_process');
const { initializeDb } = require('./config/db');

console.log('Starting worker to run scripts...');

// Initialize database first
initializeDb()
  .then(() => {
    console.log('Database initialized, running scripts...');
    const scripts = [
      'setupDepartmentsAndCareers.js',
      'migrateUsers.js',
      'createAdminUser.js'
    ];

    // Run scripts sequentially
    const runScript = (index) => {
      if (index >= scripts.length) {
        console.log('All scripts completed');
        process.exit(0); // Exit worker after completion
      }

      const script = scripts[index];
      console.log(`Running ${script}...`);
      exec(`node scripts/${script}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error in ${script}: ${error.message}`);
        }
        if (stderr) {
          console.error(`Stderr in ${script}: ${stderr}`);
        }
        console.log(`${script} output: ${stdout}`);
        runScript(index + 1); // Run next script
      });
    };

    runScript(0); // Start with first script
  })
  .catch(err => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });