const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const User = require('./model/user.model'); 
const Note = require("./model/note.model")
const dotenv = require('dotenv').config();
const userRouts= require('./routes/user.routes')
const noteRouts = require('./routes/note.routs')
const app = express();


app.use(cors({
  origin: "http://localhost:5173", // Allow requests from your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // If you're using cookies or authentication headers
}));
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


