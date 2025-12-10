import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'; // verify heroicons install

const TagInput = ({ tags = [], onChange }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {tags.map((tag) => (
        <span 
          key={tag} 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
        >
          #{tag}
          <button 
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-1.5 inline-flex flex-shrink-0 h-4 w-4 focus:outline-none focus:text-emerald-900 dark:focus:text-emerald-200 hover:text-emerald-900 dark:hover:text-emerald-200"
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </span>
      ))}
      
      <div className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder="+ Tag"
          className="bg-transparent border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1 text-xs text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-24 hover:w-32 focus:w-32"
        />
      </div>
    </div>
  );
};

export default TagInput;
