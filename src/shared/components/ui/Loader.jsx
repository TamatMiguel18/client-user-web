import React from 'react';

export const Loader = ({ fullScreen = false }) => {
  const loader = (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-500/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-emerald-500 font-bold animate-pulse">Cargando...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        {loader}
      </div>
    );
  }

  return <div className="w-full flex justify-center py-8">{loader}</div>;
};
