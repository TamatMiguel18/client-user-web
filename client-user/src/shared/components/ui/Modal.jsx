import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-[3rem] bg-slate-900 border border-white/10 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl animate-fadeIn">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
          
          <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center relative z-10">
            <h3 className="text-xl font-bold text-slate-200">{title}</h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 focus:outline-none p-1 rounded-xl hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="px-8 py-6 relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
