import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-xl border-4 border-black bg-[#FFDE59] animate-spin shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
      </div>
      <h3 className="mt-6 text-xl font-black tracking-tight">Syncing Campus Hub...</h3>
      <p className="mt-1 text-sm text-neutral-600 font-medium">Fetching verified students and active projects</p>
    </div>
  );
}
