import React, { forwardRef } from 'react';

export const Input = forwardRef(({ 
  label, 
  error, 
  id, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`w-full px-4 py-3 bg-slate-950 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors placeholder:text-slate-600 ${
          error ? 'border-rose-500/50 text-rose-200 focus:ring-rose-500/50' : 'border-slate-800 text-slate-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-rose-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
