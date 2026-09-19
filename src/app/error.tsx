'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled CampusCollab runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 bg-[#FF6B6B] border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl max-w-md w-full text-black">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-white border-2 border-black rounded-xl">
            <AlertTriangle className="w-8 h-8 text-[#FF6B6B]" />
          </div>
        </div>
        <h2 className="text-2xl font-black mb-1 tracking-tight">Something went sideways</h2>
        <p className="text-sm font-medium opacity-90 mb-6">
          We encountered an unexpected error while loading this campus module.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white font-bold border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FFDE59] font-bold border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Campus
          </Link>
        </div>
      </div>
    </div>
  );
}
