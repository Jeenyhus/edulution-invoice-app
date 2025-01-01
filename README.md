# Edulution Invoice App

## Overview

The Invoice Management App is a web-based solution designed to simplify time tracking, task logging, and invoice generation for consultants. The app integrates task management and invoicing into a seamless workflow, eliminating the need to manually fill in spreadsheets. It allows users to log work hours, manage tasks, and generate invoices for submission in a spreadsheet or CSV format.

## Features
	•	Task Logging:
Log work hours for morning and afternoon shifts, categorize tasks, and add descriptions. The app auto-calculates total hours worked based on input times.
	•	Invoice Generation:
Automatically generate monthly invoices that summarize tasks and hours worked. Export invoices as Excel or CSV files for submission.
	•	User Profile Management:
Store personal details such as name, address, worker ID, and bank details for seamless invoice generation.
	•	Time-Based Workflow:
	•	Work Hours: 7:00 AM - 12:30 PM and 1:30 PM - 5:00 PM (chargeable).
	•	Lunch Break: 12:30 PM - 1:30 PM (non-chargeable).
	•	Responsive Design:
A user-friendly interface for both desktop and mobile devices.

Technologies Used

#### Backend:
	•	Node.js with Express.js for server-side logic.
	•	MongoDB for task and user data storage.
	•	ExcelJS for generating Excel invoices.
	•	dotenv for managing environment variables.

#### Frontend:
	•	React.js for building the user interface.
	•	React Router for navigation.
	•	Axios for API communication.

#### Other Tools:
	•	Concurrently: Run frontend and backend servers simultaneously during development.
	•	Nodemon: Auto-restart the backend server on file changes.

## Getting Started

1. Prerequisites

Make sure you have the following installed:
	•	Node.js (v14+)
	•	npm or yarn
	•	MongoDB (local or Atlas)

2. Installation

Clone the repository:

git clone git@github.com:Jeenyhus/edulution-invoice-app.git
cd edulution-invoice-app

Install dependencies for both backend and frontend:

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

3. Environment Variables

Create a .env file in the backend/ directory with the following content:

MONGO_URI=your_mongodb_connection_string
PORT=5000

Running the Project

To start both the backend and frontend servers:

npm run start

This will:
	•	Start the backend server on http://localhost:5000.
	•	Start the frontend app on http://localhost:3000.

## File Structure
```
invoice-app/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic for API endpoints
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper utilities (e.g., Excel generator)
│   ├── server.js        # Backend entry point
│   └── .env             # Environment variables
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page-level components
│   │   ├── utils/       # Frontend utilities
│   │   ├── App.js       # Main React App
│   │   └── index.js     # Entry point
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── README.md            # Documentation
```

## API Endpoints

#### Tasks
	•	POST /api/tasks: Log a new task.
	•	GET /api/tasks: Fetch all tasks.
	•	PUT /api/tasks/:id: Update a task.
	•	DELETE /api/tasks/:id: Delete a task.

#### Invoices
	•	GET /api/invoices/monthly: Generate a monthly invoice.

#### Users
	•	POST /api/users: Add user profile details.
	•	GET /api/users/me: Get user profile.

## Future Enhancements
	1.	Authentication:
Add user authentication with JWT for secure access.
	2.	Analytics Dashboard:
Visualize work hours and earnings over time.
	3.	Multi-Tenant Support:
Support multiple users with role-based permissions.
	4.	Cloud Integration:
Store generated invoices in AWS S3 or Google Drive.

## Contributing

We welcome contributions! To get started:
	1.	Fork the repository.
	2.	Create a new branch: git checkout -b feature-name.
	3.	Commit your changes: git commit -m 'Add feature name'.
	4.	Push to the branch: git push origin feature-name.
	5.	Submit a pull request.

## License

This project is licensed under the MIT License.
