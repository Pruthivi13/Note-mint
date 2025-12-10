const Note = require('../models/Note');
const { generateSummary } = require('../services/aiService');

// Get all notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Create a new note
const createNote = async (req, res) => {
  const newNote = new Note(req.body);
  try {
    const savedNote = await newNote.save();
    res.status(200).json(savedNote);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json("Note has been deleted...");
  } catch (err) {
    res.status(500).json(err);
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
