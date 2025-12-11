import React, { useState, useEffect } from 'react';
import SummaryBox from './SummaryBox';
import TagInput from './TagInput';
import { summarizeText } from '../services/api';
import { StarIcon as StarIconSolid, TrashIcon, SunIcon, MoonIcon, SparklesIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

const Editor = ({ selectedNote, onSave, onDelete, onSummaryUpdated, onBack, darkMode, toggleDarkMode }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastModified, setLastModified] = useState('');

  const prevNoteIdRef = React.useRef(null);
  
  useEffect(() => {
    if (selectedNote) {
      if (selectedNote.id !== prevNoteIdRef.current) {
         // New Note selected: Load everything
         setTitle(selectedNote.title);
         setContent(selectedNote.content);
         setSummary(selectedNote.summary || '');
         setTags(selectedNote.tags || []);
         setIsBookmarked(selectedNote.isBookmarked || false);
         prevNoteIdRef.current = selectedNote.id;
      } else {
         // Same Note: Only update metadata or bookmarks if needed
         // Do NOT overwrite Title/Content/Tags as Editor is source of truth while active
         setIsBookmarked(selectedNote.isBookmarked || false);
      }
      setLastModified(new Date(selectedNote.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
    } else {
      setTitle('');
      setContent('');
      setSummary('');
      setTags([]);
      setIsBookmarked(false);
      setLastModified('');
      prevNoteIdRef.current = null;
    }
  }, [selectedNote]);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    // Save locally and trigger parent save
    setSaving(true);
    setIsSaved(false);
    
    if (onSave) {
        // Await onSave if it returns a promise (it does in App.jsx)
        await onSave({ title, content, summary, tags, isBookmarked });
    }
    
    setSaving(false);
    setIsSaved(true);
    // Timeout removed to keep "Saved" state persistent until next edit
  };

  const toggleBookmark = () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    if (selectedNote && onSave) onSave({ title, content, summary, tags, isBookmarked: newState });
  };
  
  const handleTagsChange = async (newTags) => {
      console.log("Editor: Tags Changed:", newTags);
      setTags(newTags);
      setSaving(true);
      setIsSaved(false);
      
      if (selectedNote && onSave) {
          console.log("Editor: Calling onSave with tags:", newTags);
          await onSave({ title, content, summary, tags: newTags, isBookmarked });
      }
      
      setSaving(false);
      setIsSaved(true);
  };

  const handleSummarize = async () => {
    if (!content.trim()) return alert("Add some content first");
    
    setLoading(true);
    try {
      const { data } = await summarizeText(content);
      
      const newSummary = data.summary;
      setSummary(newSummary);
      if (onSummaryUpdated) onSummaryUpdated(newSummary);
    } catch (err) {
      console.error("Summarize Error:", err);
      alert("Failed to generate summary: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 transition-colors duration-300 font-sans">
      {/* Top Bar - Always Visible */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-transparent">
        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
             {selectedNote ? (
                <span className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">
                    Modified {lastModified}
                    {saving && <span className="text-emerald-500 ml-2 animate-pulse">Saving...</span>}
                    {isSaved && !saving && <span className="text-emerald-600 ml-2">Saved</span>}
                </span>
             ) : (
                <span className="opacity-0">Placeholder</span> 
             )}
        </div>
        
        <div className="flex items-center gap-2">
           <button 
             onClick={toggleDarkMode}
             className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
             title="Toggle Dark Mode"
           >
             {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
           </button>
           
           {selectedNote && (
               <>
                <button 
                    onClick={toggleBookmark}
                    className={`p-2 rounded-lg transition-all ${isBookmarked ? 'text-yellow-400' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'}`}
                    title="Bookmark Note"
                >
                    {isBookmarked ? <StarIconSolid className="w-5 h-5" /> : <StarIconOutline className="w-5 h-5" />}
                </button>

                <button 
                    onClick={onDelete}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    title="Delete Note"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
               </>
           )}
        </div>
      </div>

      {/* Main Area: Logic to switch between Empty State and Editor */}
      {!selectedNote ? (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-400 opacity-60">
            <SparklesIcon className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-xl font-display font-medium">Select a note to view</p>
          </div>
      ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar px-12 py-6 max-w-5xl mx-auto w-full">
              
              <div className="flex items-center gap-2 mb-4">
                 <button 
                    onClick={onBack}
                    className="md:hidden p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                    title="Back to List"
                 >
                    <ChevronLeftIcon className="w-6 h-6" />
                 </button>

                 {/* Title input */}
                 <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setIsSaved(false); }}
                onBlur={handleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="Untitled Note"
                className="w-full text-5xl font-extrabold font-display bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-200 dark:placeholder-slate-800 tracking-tight leading-tight"
              />
              </div>

              {/* Tags */}
              <div className="mb-8 pl-1">
                 <TagInput tags={tags} onChange={handleTagsChange} />
              </div>
              
              {/* Summary Section */}
              {(summary || content.length > 0) && (
                  <div className="mb-8 p-1">
                     <div className="flex items-center justify-between mb-2">
                         <button
                            onClick={handleSummarize}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-all ml-auto"
                         >
                            <SparklesIcon className="w-3.5 h-3.5" />
                            {loading ? 'Thinking...' : 'Summary'} 
                         </button>
                     </div>
                     {summary && <SummaryBox summary={summary} />}
                  </div>
              )}
              
              {/* Divider */}
              <hr className="border-slate-100 dark:border-slate-800 mb-8" />

              {/* Text Area */}
              <textarea
                value={content}
                onChange={(e) => { setContent(e.target.value); setIsSaved(false); }}
                onBlur={handleSave} 
                placeholder="Type / for commands..."
                className="w-full min-h-[60vh] bg-transparent resize-none focus:outline-none text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans"
              ></textarea>
          
                {/* Floating Save Button */}
                <div className="fixed bottom-8 right-8 flex gap-2">
                    <button 
                    onClick={handleSave}
                    className={`px-6 py-3 rounded-full font-bold shadow-2xl hover:scale-105 transition-all duration-300 ${isSaved ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'}`}
                    >
                        {isSaved ? 'Saved ✔️' : 'Save'}
                    </button>
                </div>


          </div>
      )}
    </div>
  );

};

export default Editor;
