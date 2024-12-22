const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();

const corsOptions = {
  origin: 'https://jandb-todo.vercel.app/', 
  optionsSuccessStatus: 200
};


app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
})();

// Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await db.all('SELECT * FROM tasks');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
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

app.put('/api/tasks/:id', async (req, res) => {
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

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM tasks WHERE id = ?', req.params.id);
    res.json({ message: 'Task deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});