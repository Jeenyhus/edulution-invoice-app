const axios = require('axios');
const express = require('express');
const { initializeDb } = require('../config/db');
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const taskRoutes = require('../routes/taskRoutes');
require('dotenv').config();

// Set test environment variables if not present
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-key';
}

// Create test server
const app = express();
app.use(express.json());

// Add basic CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Routes for testing
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.use('/api/tasks', protect, taskRoutes);

const PORT = 5001;
let server;

// Test configuration
const testUser = {
  email: 'test3@example.com',
  password: 'test3123456',
  name: 'Test User1',
  hourlyRate: 20
};

const testTask = {
  description: "Test task description",
  date: "2024-03-20",
  shift: "morning",
  startTime: "09:00",
  endTime: "12:00",
  hoursWorked: 3,
  category: "Testing"
};

const updatedTask = {
  description: "Updated test description",
  date: "2024-03-20",
  shift: "afternoon",
  startTime: "13:00",
  endTime: "17:00",
  hoursWorked: 4,
  category: "Development"
};

// API client setup
const apiClient = axios.create({
  baseURL: `http://localhost:${PORT}`,
  headers: {
    'Content-Type': 'application/json'
  }
});

let authToken = '';
let createdTaskId = null;

// Update auth token
apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

async function runTests() {
  try {
    console.log('\n🚀 Starting Task CRUD Tests...\n');

    // Start server
    await new Promise((resolve) => {
      server = app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
        resolve();
      });
    });

    // Initialize database
    console.log('Initializing database...');
    await initializeDb();
    console.log('Database initialized successfully');

    // 1. Register test user
    console.log('\n1️⃣  Registering test user...');
    try {
      const registerResponse = await apiClient.post('/api/auth/register', testUser);
      authToken = registerResponse.data.token;
      console.log('✅ User registered successfully');
    } catch (error) {
      throw new Error(`Registration failed: ${error.response?.data?.message || error.message}`);
    }

    // 2. Create task
    console.log('\n2️⃣  Creating new task...');
    const createResponse = await apiClient.post('/api/tasks', testTask);
    createdTaskId = createResponse.data.id;
    console.log('✅ Task created successfully:', {
      id: createdTaskId,
      description: createResponse.data.description
    });

    // 3. Get all tasks
    console.log('\n3️⃣  Fetching all tasks...');
    const getAllResponse = await apiClient.get('/api/tasks');
    console.log('✅ Tasks fetched successfully. Count:', getAllResponse.data.length);

    // 4. Update task
    console.log('\n4️⃣  Updating task...');
    const updateResponse = await apiClient.put(`/api/tasks/${createdTaskId}`, updatedTask);
    console.log('✅ Task updated successfully:', {
      description: updateResponse.data.description,
      hoursWorked: updateResponse.data.hoursWorked
    });

    // 5. Delete task
    console.log('\n5️⃣  Deleting task...');
    await apiClient.delete(`/api/tasks/${createdTaskId}`);
    console.log('✅ Task deleted successfully');

    // 6. Verify deletion
    console.log('\n6️⃣  Verifying deletion...');
    const finalResponse = await apiClient.get('/api/tasks');
    const deletedTask = finalResponse.data.find(task => task.id === createdTaskId);
    if (!deletedTask) {
      console.log('✅ Task deletion verified');
    } else {
      throw new Error('Task still exists after deletion');
    }

    console.log('\n✨ All tests completed successfully! ✨\n');

  } catch (error) {
    console.error('\n❌ Test failed:', {
      message: error.message,
      status: error.response?.status,
      endpoint: error.config?.url,
      method: error.config?.method
    });
  } finally {
    if (server) {
      server.close();
    }
    process.exit();
  }
}

// Add cleanup for unexpected errors
process.on('unhandledRejection', (error) => {
  console.error('\n💥 Unhandled rejection:', error);
  process.exit(1);
});

// Run the tests
runTests(); 