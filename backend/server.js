const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const url = 'mongodb://localhost:27017';
const dbName = 'cyberquest';
let db;

// Connect to MongoDB
MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Save user score
app.post('/api/saveScore', (req, res) => {
  const { username, score } = req.body;
  if (!username || score === undefined) {
    return res.status(400).send('Username and score are required');
  }
  db.collection('users').updateOne(
    { username },
    { $set: { score, lastUpdated: new Date() } },
    { upsert: true }
  )
    .then(() => res.send('Score saved'))
    .catch(err => res.status(500).send('Error saving score: ' + err));
});

// Get user score
app.get('/api/getScore/:username', (req, res) => {
  const username = req.params.username;
  db.collection('users').findOne({ username })
    .then(user => res.json(user || { username, score: 0 }))
    .catch(err => res.status(500).send('Error fetching score: ' + err));
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));