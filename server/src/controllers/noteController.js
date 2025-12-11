const Note = require('../models/Note');
const { generateSummary } = require('../services/aiService');

// Helper logger
const logDebug = (msg) => console.log("[BACKEND DEBUG] " + msg);

// Get all notes
const getNotes = async (req, res) => {
  try {
    // Use .lean() to bypass hydration and potential schema mismatches
    const notes = await Note.find().sort({ createdAt: -1 }).lean();
    logDebug("FETCHED NOTES COUNT: " + notes.length);
    if (notes.length > 0) {
        logDebug("FIRST NOTE KEYS: " + Object.keys(notes[0]).join(","));
        logDebug("FIRST NOTE TAGS: " + JSON.stringify(notes[0].tags));
    }
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes", error: err.message });
  }
};

// Create a new note
const createNote = async (req, res) => {
  logDebug("CREATE BODY: " + JSON.stringify(req.body));
  const newNote = new Note(req.body);
  try {
    const savedNote = await newNote.save();
    logDebug("SAVED NOTE: " + JSON.stringify(savedNote));
    res.status(200).json(savedNote);
  } catch (err) {
    logDebug("CREATE ERROR: " + err);
    res.status(500).json({ message: "Failed to create note", error: err.message });
  }
};

// Update a note
const updateNote = async (req, res) => {
  logDebug("UPDATE ID: " + req.params.id);
  logDebug("UPDATE BODY: " + JSON.stringify(req.body));
  
  try {
    const { title, content, summary, tags, isBookmarked } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (summary !== undefined) updateData.summary = summary;
    if (tags !== undefined) updateData.tags = tags;
    if (isBookmarked !== undefined) updateData.isBookmarked = isBookmarked;
    
    logDebug("CONSTRUCTED UPDATE DATA: " + JSON.stringify(updateData));

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    logDebug("UPDATED NOTE (SENDING): " + JSON.stringify(updatedNote));
    res.status(200).json(updatedNote);
  } catch (err) {
    logDebug("UPDATE ERROR: " + err);
    res.status(500).json({ message: "Update Failed", error: err.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json("Note has been deleted...");
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note", error: err.message });
  }
};

// Summarize a note
const summarizeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json("Note not found");

    if (!note.content) return res.status(400).json("Note content is empty");

    // Call AI Service
    const summary = await generateSummary(note.content);
    
    // Update the note with the summary
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { summary: summary },
      { new: true }
    );
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json(err);
  }
};

const summarizeContent = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json("Content is required");

    const summary = await generateSummary(content);
    res.status(200).json({ summary });
  } catch (err) {
    console.error("Summarize Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  summarizeNote,
  summarizeContent
};
