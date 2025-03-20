const express = require('express');
const authenticateToken = require('../middleware/auth');
const { addNote, editNote ,getAllNotesById, getAllNotes ,deleteNote,updatePinned ,searchNote} = require('../controller/note.controller');

const router = express.Router();

// Routes
router.post('/addNote', authenticateToken, addNote);
router.put('/editNote/:noteId',authenticateToken, editNote) 
router.get('/getAllNotesById/:all',authenticateToken, getAllNotesById)
//router.get('/getAllNotes/:all', getAllNotes)
router.delete('/deleteNote/:noteId',authenticateToken, deleteNote)
router.put('/updatePinned/:noteId',authenticateToken, updatePinned) 
router.get('/search', authenticateToken, searchNote);  

module.exports = router;
