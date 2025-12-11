import React, { useState, useEffect } from 'react';
import NotesList from './components/NotesList';
import Editor from './components/Editor';
import * as api from './services/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  
  const getErrorMessage = (err) => {
      if (err.response?.data?.message) return err.response.data.message;
      if (err.response?.data?.error) return err.response.data.error;
      return err.message || "Unknown Error";
  };

  // Initial Load
  useEffect(() => {
    console.log("App mounted. Loading notes...");
    api.getNotes()
      .then((res) => {
        // Normalize _id to id for frontend consistency
        const normalized = res.data.map(n => ({ ...n, id: n._id }));
        console.log("LOADED RAW DATA FROM API:", res.data);
        console.log("Loaded notes:", normalized);
        setNotes(normalized);
      })
      .catch((err) => {
          console.error("Failed to load notes", err);
          setError(`Failed to load notes: ${getErrorMessage(err)}`);
      })
      .finally(() => setIsLoaded(true));
    
    // Check local storage or preference for Dark Mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);



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
    // Draft note logic (temp ID)
    const newNote = {
      id: `temp-${Date.now()}`,
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
  const handleSaveNote = async (noteData) => {
    console.log("App: handleSaveNote called with:", noteData);
    if (!selectedNote) return;

    // Optimistic update locally
    const updatedLocal = { ...selectedNote, ...noteData, updatedAt: new Date().toISOString() };
    
    // If it's a temp ID, create it on backend
    if (selectedNote.id.toString().startsWith('temp-')) {
       // Only create if there's actual content/title/tags to avoid spamming empty notes
       if (!noteData.title && !noteData.content && (!noteData.tags || noteData.tags.length === 0)) {
            // Just update state locally for draft
            const updatedNotes = notes.map((n) => 
                n.id === selectedNote.id ? updatedLocal : n
            );
            setNotes(updatedNotes);
            setSelectedNote(updatedLocal);
            return;
       }

       try {
         // Create in DB
         // Note: we strip ID so DB generates one, or we use temp ID? MongoDB generates _id.
         // Client expects 'id'. DB returns '_id' usually.
         // Controller returns 'savedNote'.
         // Ensure we handle mapping if needed. 
         // But the noteController seems to accept req.body.
         const { id, ...dataToSave } = noteData; // omit temp id
         const res = await api.createNote(dataToSave);
         const savedNote = res.data; // Should have _id or id
         
         // Replace temp note with real note
         const newId = savedNote._id || savedNote.id;
         const finalNote = { ...savedNote, id: newId };
         
         const updatedNotes = notes.map((n) => 
            n.id === selectedNote.id ? finalNote : n
         );
         setNotes(updatedNotes);
         setSelectedNote(finalNote);
        } catch (err) {
          console.error("Failed to create note", err);
          setError(`Failed to create note: ${getErrorMessage(err)}`);
        }

    } else {
      // Update existing
      try {
        const res = await api.updateNote(selectedNote.id, noteData);
        console.log("App: Update Response from Server:", res.data);
        const updatedNotes = notes.map((n) => 
            n.id === selectedNote.id ? updatedLocal : n
        );
        setNotes(updatedNotes);
        setSelectedNote(updatedLocal);
      } catch (err) {
        console.error("Failed to update note", err);
        setError(`Failed to update note: ${getErrorMessage(err)}`);
      }
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    
    // If temp, just remove
    if (selectedNote.id.toString().startsWith('temp-')) {
        const filtered = notes.filter((n) => n.id !== selectedNote.id);
        setNotes(filtered);
        setSelectedNote(null);
        return;
    }

    // Call API
    try {
        await api.deleteNote(selectedNote.id);
        const filtered = notes.filter((n) => n.id !== selectedNote.id);
        setNotes(filtered);
        setSelectedNote(null);
    } catch(err) {
        console.error("Failed to delete note", err);
    }
  };

  // Handle AI Summary Update (from Editor)
  const handleSummaryUpdated = (summary) => {
     if (!selectedNote) return;
     
     const targetId = selectedNote.id;

     // Update notes list
     setNotes(prevNotes => prevNotes.map(n => 
        n.id === targetId ? { ...n, summary } : n
     ));

     // Update selected note (functional update to preserve latest content)
     setSelectedNote(prevSelected => {
        if (prevSelected && prevSelected.id === targetId) {
            return { ...prevSelected, summary };
        }
        return prevSelected;
     });
  };

  // Derive all unique tags from notes
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags || []))).sort();

  // Filter notes based on selected tag
  const filteredNotes = selectedTag 
    ? notes.filter(note => note.tags && note.tags.includes(selectedTag))
    : notes;

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${darkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
      <NotesList 
        notes={filteredNotes} 
        selectedNote={selectedNote} 
        onSelectNote={handleSelectNote} 
        onNewNote={handleNewNote}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        tags={allTags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
      />
      
      <main className="flex-1 h-full flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {error && (
            <div className="bg-red-500 text-white px-4 py-2 text-sm font-bold flex justify-between items-center">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-4 hover:bg-red-600 rounded px-2">X</button>
            </div>
        )}
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
