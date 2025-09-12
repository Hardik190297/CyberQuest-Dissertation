// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.json({ message: 'Backend is alive 🎉' }));

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});