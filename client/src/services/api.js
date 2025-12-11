import axios from "axios";

// Helper to get notes from Local Storage
const getLocalNotes = () => {
  const notes = localStorage.getItem('notes');
  return notes ? JSON.parse(notes) : [];
};

// Helper to save notes to Local Storage
const saveLocalNotes = (notes) => {
  localStorage.setItem('notes', JSON.stringify(notes));
};

// ---------------------------
// Notes CRUD Operations (Local Storage)
// ---------------------------

// Get all notes
export const getNotes = async () => {
  // Simulate network delay slightly for realism (optional) or just return immediately
  return Promise.resolve({ data: getLocalNotes() });
};

// Create a new note
export const createNote = async (data) => {
  const notes = getLocalNotes();
  const newNote = {
    ...data,
    id: Date.now().toString(), // Simple ID generation
    _id: Date.now().toString(), // Maintain compatibility if app checks _id
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Add to beginning of list
  const updatedNotes = [newNote, ...notes];
  saveLocalNotes(updatedNotes);
  
  return Promise.resolve({ data: newNote });
};

// Update an existing note
export const updateNote = async (id, data) => {
  const notes = getLocalNotes();
  const index = notes.findIndex(n => n.id === id || n._id === id);
  
  if (index === -1) {
    return Promise.reject(new Error("Note not found"));
  }
  
  const updatedNote = {
    ...notes[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  notes[index] = updatedNote;
  saveLocalNotes(notes);
  
  return Promise.resolve({ data: updatedNote });
};

// Delete note
export const deleteNote = async (id) => {
  const notes = getLocalNotes();
  const filteredNotes = notes.filter(n => n.id !== id && n._id !== id);
  saveLocalNotes(filteredNotes);
  
  return Promise.resolve({ data: { message: "Deleted successfully" } });
};

// Summarize raw text (Keeps Server-Side logic for AI)
export const summarizeText = (content) => {
  const apiBase = import.meta.env.PROD 
      ? "/api/summarize"  // Vercel Function Path
      : "http://localhost:5000/api/notes/summarize-text"; // Keep dev fallback or point to same if using vercel dev

  return axios.post(apiBase, { content });
};

// Deprecated: Summarize note by ID (No longer supported with Local Storage)
export const summarizeNote = async (id) => {
  console.warn("summarizeNote(id) is deprecated in Local Storage mode.");
  return Promise.reject(new Error("Summarize by ID not supported in Local Storage mode"));
};

const API = {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
    summarizeText,
    summarizeNote
};

export default API;
