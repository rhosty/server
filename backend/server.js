const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';

const app = express();
const SECRET_KEY = 'your_secret_key'; 

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log("Serverless function loaded on Vercel.");

app.get("/", (req, res) => {
  console.log("Root route hit.");
  res.send("Express on Vercel");
});


// Database setup
let db;
(async () => {
  db = await open({
    filename: 'todos.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // Insert predefined users
  const predefinedUsers = [
    { username: 'Julia', password: 'IcedMatchLatte' },
    { username: 'Berni', password: 'Irmithedog' },
  ];

  for (const user of predefinedUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await db.run('INSERT OR REPLACE INTO users (username, password) VALUES (?, ?)', [user.username, hashedPassword]);
  }
})();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await db.all('SELECT id, username FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await db.all('SELECT * FROM tasks');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { text, completed } = req.body;
    const result = await db.run(
      'INSERT INTO tasks (text, completed) VALUES (?, ?)',
      [text, completed]
    );
    res.json({ 
      id: result.lastID,
      message: 'Task added successfully!' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { text, completed } = req.body;
    await db.run(
      'UPDATE tasks SET text = ?, completed = ? WHERE id = ?',
      [text, completed, req.params.id]
    );
    res.json({ message: 'Task updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    await db.run('DELETE FROM tasks WHERE id = ?', req.params.id);
    res.json({ message: 'Task deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// export default app;



const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

