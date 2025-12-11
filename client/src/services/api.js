import axios from "axios";

// Helper to determine URL
const getBaseUrl = () => {
    if (import.meta.env.PROD) {
        return "/api"; 
    }
    return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
};

const API = axios.create({
  baseURL: getBaseUrl(),
});

// ---------------------------
// Notes CRUD Operations
// ---------------------------

// Get all notes (cache-busted)
export const getNotes = async () => {
  return API.get(`/notes?_t=${Date.now()}`);
};

// Create a new note
export const createNote = async (data) => {
  return API.post("/notes", data);
};

// Update an existing note
export const updateNote = async (id, data) => {
  return API.put(`/notes/${id}`, data);
};

// Delete note
export const deleteNote = async (id) => {
  return API.delete(`/notes/${id}`);
};

// Summarize note using AI (ID-based)
export const summarizeNote = async (id) => {
  return API.post(`/notes/${id}/summarize`);
};

// Summarize raw text
export const summarizeText = (content) => {
  // If in Prod (Netlify), target the function directly
  if (import.meta.env.PROD) {
      return axios.post("/.netlify/functions/summarize", { content });
  }
  // Otherwise use local express
  return API.post("/notes/summarize-text", { content });
};

export default API;
