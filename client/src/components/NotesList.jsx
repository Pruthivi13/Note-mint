import { StarIcon } from '@heroicons/react/24/solid';
import { PlusIcon } from '@heroicons/react/24/outline';

const NotesList = ({ notes, selectedNote, onSelectNote, onNewNote, darkMode, toggleDarkMode, tags, selectedTag, onSelectTag }) => {
  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-10 font-sans transition-colors duration-300">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-display">
            <img src="/notes.svg" alt="Logo" className="w-6 h-6" />
            NOTE MINT
          </h1>
          {/* Theme Toggle can function as the "Settings" or explicit toggle */}
        </div>
        
        <button 
          onClick={onNewNote}
          className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-4 rounded-lg transition-all duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Note</span>
        </button>
      </div>

      {/* Tags Filter (Horizontal Scroll) */}
      {tags && tags.length > 0 && (
         <div className="px-5 pb-4 overflow-x-auto whitespace-nowrap custom-scrollbar flex gap-2">
             {selectedTag && (
                <button
                    onClick={() => onSelectTag(null)}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
                    title="Clear Filter"
                >
                    Clear
                </button>
             )}
             
            {tags.map(tag => (
                <button
                    key={tag}
                    onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border transition-colors flex-shrink-0 ${
                         selectedTag === tag
                         ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800'
                         : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                >
                    #{tag}
                </button>
            ))}
         </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4 space-y-2">
        {notes.map((note) => (
          <div 
            key={note.id || note._id}
            onClick={() => onSelectNote(note)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
              selectedNote && (selectedNote.id === note.id || selectedNote._id === note._id)
                ? 'bg-slate-800 text-white shadow-md' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
                <h3 className={`font-bold text-sm truncate flex-1 pr-2 ${
                    selectedNote && (selectedNote.id === note.id || selectedNote._id === note._id) ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                }`}>
                {note.title || "Untitled Note"}
                </h3>
                {note.isBookmarked && <StarIcon className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />}
            </div>
            
            {/* Tags Preview */}
            {(note.tags && note.tags.length > 0) && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                    {note.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                             selectedNote && (selectedNote.id === note.id || selectedNote._id === note._id)
                             ? 'bg-slate-700 text-slate-300'
                             : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}
          </div>
        ))}
        {notes.length === 0 && (
          <div className="text-center mt-10">
            <p className="text-slate-400 text-sm">No notes created yet.</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center mt-auto">
        <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">
          Copyright &copy; Pruthiviraj
        </p>
      </div>
    </div>
  );
};

export default NotesList;
