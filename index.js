const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/user.model'); 
//const Note = require("./model/note.model")
const dotenv = require('dotenv').config();
const userRouts= require('./routes/user.routes')
const noteRouts = require('./routes/note.routs')
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to NoteApplication');
});

app.use("/api/v1/users",userRouts)
app.use("/api/v1/notes",noteRouts)


// MongoDB Connection
const mongoURL = 'mongodb://127.0.0.1:27017/NoteApp';
mongoose.connect(mongoURL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Start Server
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});


