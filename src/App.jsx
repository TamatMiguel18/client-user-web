import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './app/router/AppRouter';
import { useThemeStore } from './shared/store/useThemeStore';

function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: '!bg-slate-900/90 !text-slate-100 !backdrop-blur-xl !border !border-emerald-500/20 !shadow-2xl !shadow-emerald-500/10',
          style: {
            background: 'transparent',
            color: 'inherit',
            boxShadow: 'none',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          }
        }}
      />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
