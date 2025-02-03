const express = require('express');
const authenticateToken = require('../middleware/auth');
const { addNote, editNote } = require('../controller/note.controller');

const router = express.Router();

// Routes
router.post('/addNote', authenticateToken, addNote);
router.put('/editNote/:noteId',authenticateToken,editNote)
module.exports = router;
