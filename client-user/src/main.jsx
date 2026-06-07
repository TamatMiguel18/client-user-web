import React from 'react'; 
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster 
        position="top-right"
        toastOptions={{
            style: {
                background: '#1E293B',
                color: '#fff',
                border: '1px solid #374151',
                borderRadius: '12px',
            },
        }}
    />
  </React.StrictMode>
);