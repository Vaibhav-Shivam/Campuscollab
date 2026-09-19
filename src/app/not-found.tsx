import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-8 bg-[#FAF8F5] border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl max-w-lg w-full">
        <div className="inline-block p-4 bg-[#FFDE59] border-2 border-black rounded-2xl mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <Compass className="w-12 h-12 stroke-[2.5]" />
        </div>
        <div className="inline-block bg-[#FF70A6] text-black text-xs font-black px-3 py-1 border border-black rounded-full uppercase tracking-wider mb-2">
          404 Error
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Lost on Campus?</h1>
        <p className="text-neutral-600 font-medium text-sm mb-6 max-w-sm mx-auto">
          The project, student profile, or page you are looking for has either graduated, moved, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#38E54D] font-black border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white font-bold border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
          >
            Explore Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
