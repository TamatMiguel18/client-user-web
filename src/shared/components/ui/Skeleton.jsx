import React from 'react';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-slate-800/50 ${className}`}
      {...props}
    />
  );
};
