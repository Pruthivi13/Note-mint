const router = require('express').Router();
const Note = require('../models/Note');

// GET all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE a note
router.post('/', async (req, res) => {
  const newNote = new Note(req.body);
  try {
    const savedNote = await newNote.save();
    res.status(200).json(savedNote);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE a note
router.put('/:id', async (req, res) => {
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
});

// DELETE a note
router.delete('/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json("Note has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// SUMMARIZE a note (MOCK)
router.post('/:id/summarize', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json("Note not found");

    // Mock AI Summary Logic
    // In a real app, this would call OpenAI/Gemini API
    const mockSummary = `[AI Summary]: This note titled "${note.title}" contains approximately ${note.content.length} characters. Key points extracted... (Simulation)`;
    
    // Update the note with the summary
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { summary: mockSummary },
      { new: true }
    );
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
