import React, { useState, useEffect } from 'react';
import NotesList from './components/NotesList';
import Editor from './components/Editor';
import { loadNotes, saveNotes } from './services/storage';

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial Load
  useEffect(() => {
    console.log("App mounted. Loading notes...");
    const storedNotes = loadNotes();
    console.log("Loaded notes:", storedNotes);
    if (storedNotes) {
        setNotes(storedNotes);
    }
    setIsLoaded(true);
    
    // Check local storage or preference for Dark Mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Auto-save notes whenever they change (only after initial load)
  useEffect(() => {
    if (isLoaded) {
        saveNotes(notes);
    }
  }, [notes, isLoaded]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "",
      content: "",
      summary: "",
      tags: [],
      isBookmarked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  // Local CRUD Handlers passed to Editor
  const handleSaveNote = (noteData) => {
    if (selectedNote) {
      // Update
      const updatedNotes = notes.map((n) => 
        n.id === selectedNote.id ? { ...selectedNote, ...noteData, updatedAt: new Date().toISOString() } : n
      );
      setNotes(updatedNotes);
      // Update selected note to reflect changes immediately
      setSelectedNote({ ...selectedNote, ...noteData, updatedAt: new Date().toISOString() });
    } else {
      // Create
      const newNote = {
        id: Date.now().toString(), // Simple ID
        ...noteData,
        summary: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
    }
  };

  const handleDeleteNote = () => {
    if (!selectedNote) return;
    const filtered = notes.filter((n) => n.id !== selectedNote.id);
    setNotes(filtered);
    setSelectedNote(null);
  };

  // Handle AI Summary Update (from Editor)
  const handleSummaryUpdated = (summary) => {
     if (!selectedNote) return;
     const updatedNotes = notes.map((n) => 
       n.id === selectedNote.id ? { ...n, summary } : n
     );
     setNotes(updatedNotes);
     setSelectedNote({ ...selectedNote, summary });
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${darkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
      <NotesList 
        notes={notes} 
        selectedNote={selectedNote} 
        onSelectNote={handleSelectNote} 
        onNewNote={handleNewNote}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <main className="flex-1 h-full flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Editor 
          selectedNote={selectedNote} 
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onSummaryUpdated={handleSummaryUpdated}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </main>
    </div>
  );
}

export default App;
