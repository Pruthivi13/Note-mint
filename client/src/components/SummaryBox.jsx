import React from 'react';

const SummaryBox = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="mt-10 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group transition-colors duration-300">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500"></div>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <svg className="w-24 h-24 text-indigo-900 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /></svg>
      </div>
      
      <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        AI Summary
      </h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium">
        {summary}
      </p>
    </div>
  );
};

export default SummaryBox;
