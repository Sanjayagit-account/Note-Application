const Note = require('../model/note.model.js');

exports.addNote = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const { id } = req.user

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        // Create a new note 
        const note = new Note({ title, content, tags, userId: id });

        // Save the note
        await note.save();

        // Send success response
        res.status(201).json({ message: 'Note added successfully', note });

    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


exports.editNote = async (req, res) => {
    try {
        const { title, content, tags, isPinned } = req.body;
        const { id } = req.user;

        // Ensure at least one field is provided for update
        if (title === undefined && content === undefined && tags === undefined && isPinned === undefined) {
            return res.status(400).json({ message: "No changes provided" });
        }

        // Fetch the note by ID
        const note = await Note.findById(req.params.noteId);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        // Check if the logged-in user is the owner of the note
        if (note.userId.toString() !== id) {
            return res.status(403).json({ message: "Unauthorized to edit this note" });
        }

        // Update only provided fields
        if (title ) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned ) note.isPinned = isPinned;

        await note.save();
        res.status(200).json({ message: "Note updated successfully", note });

    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};






