const Note = require('../model/note.model.js');
const mongoose = require('mongoose');
// exports.addNote = async (req, res) => {
//     try {
//         const { title, content, tags } = req.body;
//         const { id } = req.user

//         if (!title || !content) {
//             return res.status(400).json({ message: "Title and content are required" });
//         }

//         // Create a new note 
//         const note = new Note({ title, content, tags, userId: id });

//         // Save the note
//         await note.save();

//         // Send success response
//         res.status(201).json({ message: 'Note added successfully', note });

//     } catch (error) {
//         res.status(500).json({ error: "Internal server error", details: error.message });
//     }
// };
exports.addNote = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const { id } = req.user;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        // Ensure tags is an array (if it's sent as a string, convert it)
        const parsedTags = Array.isArray(tags) ? tags : tags?.split(",").map(tag => tag.trim());

        // Create a new note 
        const note = new Note({ title, content, tags: parsedTags, userId: id });

        // Save the note
        await note.save();

        res.status(201).json({ message: 'Note added successfully', note });

    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


//Edit Note
// exports.editNote = async (req, res) => {
//     try {
//         const { title, content, tags, isPinned } = req.body;
//         const { id } = req.user;

//         // Ensure at least one field is provided for update
//         if (title === undefined && content === undefined && tags === undefined && isPinned === undefined) {
//             return res.status(400).json({ message: "No changes provided" });
//         }

//         // Fetch the note by ID
//         const note = await Note.findById(req.params.noteId);
//         if (!note) {
//             return res.status(404).json({ message: "Note not found" });
//         }

//         // Check if the logged-in user is the owner of the note
//         if (note.userId.toString() !== id) {
//             return res.status(403).json({ message: "Unauthorized to edit this note" });
//         }

//         // Update only provided fields
//         if (title) note.title = title;
//         if (content) note.content = content;
//         if (tags) note.tags = tags;
//         if (isPinned) note.isPinned = isPinned;

//         await note.save();
//         res.status(200).json({ message: "Note updated successfully", note });

//     } catch (error) {
//         res.status(500).json({ error: "Internal server error", details: error.message });
//     }
// };
exports.editNote = async (req, res) => {
    try {
        const { title, content, tags, isPinned } = req.body;
        const { id } = req.user;

        if (title === undefined && content === undefined && tags === undefined && isPinned === undefined) {
            return res.status(400).json({ message: "No changes provided" });
        }

        const note = await Note.findById(req.params.noteId);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.userId.toString() !== id) {
            return res.status(403).json({ message: "Unauthorized to edit this note" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = Array.isArray(tags) ? tags : tags.split(",").map(tag => tag.trim());
        if (isPinned !== undefined) note.isPinned = isPinned;

        await note.save();
        res.status(200).json({ message: "Note updated successfully", note });

    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


//getAll Note
exports.getAllNotesById= async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const notes = await Note.find({ userId }).sort({ isPinned: -1 });

        res.status(200).json({ message: "All notes retrieved successfully", notes });

    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};
    

/*exports.getAllNotes = async (req, res) => {
    try {

        const notes = await Note.find().sort({ isPinned: -1 });

        res.status(200).json({ message: "All notes retrieved successfully", notes });

    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};
*/

exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.user;
        const note = await Note.findById(req.params.noteId);
        
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.userId.toString() !== id) {
            return res.status(403).json({ message: "Unauthorized to delete this note" });
        }

        await Note.deleteOne({ _id: req.params.noteId });

        res.status(200).json({ message: "Note deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};
 exports.updatePinned = async(req,res)=>{
    try {
        const { isPinned } = req.body;
        const { id } = req.user;

        // Ensure at least one field is provided for update
        if (isPinned === undefined) {
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
        if (isPinned) note.isPinned = isPinned ;

        await note.save();
        res.status(200).json({ message: "Note updated successfully", note });

    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    } 
 };

 exports.searchNote = async (req, res) => {
    try {
        const { query } = req.body; // Get the search query from the request body
        const userId = req.user._id;  // Assuming you're getting the user id from the token or session

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Perform a case-insensitive search across title, content, and tags
        const notes = await Note.find({
            userId,  // Make sure the search only returns notes for the logged-in user
            $or: [
                { title: { $regex: query, $options: 'i' } },  // Search in title (case-insensitive)
                { content: { $regex: query, $options: 'i' } },  // Search in content
                { tags: { $regex: query, $options: 'i' } }    // Search in tags (case-insensitive)
            ]
        });

        if (notes.length === 0) {
            return res.status(404).json({ message: "No notes found matching your search" });
        }

        // Return the matching notes
        res.status(200).json({  success:true, message: "Notes matching the search query retrived successfully", notes });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", details: error.message });
    }
};
