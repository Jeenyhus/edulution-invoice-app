-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Create careers table
CREATE TABLE IF NOT EXISTS careers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Add department_id to users table
ALTER TABLE users ADD COLUMN department_id INTEGER REFERENCES departments(id); 