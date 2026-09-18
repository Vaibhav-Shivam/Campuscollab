'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Shield, Cpu, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t-[2.5px] border-black bg-[#FAF8F5] text-black mt-auto">
      {/* Gumroad-style Bubblegum Pink Action Banner (from Image 2) */}
      <div className="bg-[#FF70A6] border-b-2 border-black py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="text-xs font-black uppercase tracking-wider text-black">
              ★ CAMPUS COLLABORATION COMMUNITY
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1">
              Find People. Build Projects. Grow Together.
            </h3>
          </div>

          {/* Quick email / join input */}
          <div className="flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your campus email..."
              className="flex-1 bg-white border-2 border-black rounded-xl px-4 py-2.5 text-xs font-bold text-black focus:outline-none shadow-[2.5px_2.5px_0px_0px_#000] placeholder:text-stone-500"
            />
            <button
              onClick={() => alert('Welcome to CampusCollab newsletter!')}
              className="bg-black hover:bg-[#FFDE59] hover:text-black text-white font-black text-xs uppercase px-5 py-2.5 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <span>Join</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Meta */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFDE59] border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-black text-black">
                ★
              </div>
              <span className="text-xl font-black uppercase tracking-tight text-black">
                CampusCollab
              </span>
            </div>
            <p className="text-xs font-semibold text-stone-700 leading-relaxed max-w-md">
              A purpose-built talent network where students find teammates based on real skills, verified portfolio proofs, and availability.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 bg-[#4FD1C5] border-2 border-black px-2.5 py-1 rounded-lg text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
                <Shield className="w-3 h-3" /> Private Requests
              </span>
              <span className="inline-flex items-center gap-1 bg-[#FFDE59] border-2 border-black px-2.5 py-1 rounded-lg text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
                <Cpu className="w-3 h-3" /> AWS & AI Powered
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-black mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <Link href="/students" className="hover:underline">
                  Explore Students Directory
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:underline">
                  Project Requirements Feed
                </Link>
              </li>
              <li>
                <Link href="/match" className="hover:underline flex items-center gap-1">
                  <span>AI Teammate Matcher</span>
                  <span className="bg-[#9B87F5] text-black text-[9px] px-1.5 rounded border border-black font-black">AI</span>
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:underline">
                  Campus Hackathons & Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Stack & Style */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-black mb-3">
              Design System
            </h4>
            <p className="text-xs font-medium text-stone-600 leading-relaxed mb-3">
              Neo-Brutalism: Bold borders, hard shadows, vibrant color blocks, and tactile interactions.
            </p>
            <div className="text-[11px] font-bold text-stone-700 space-y-1 border-t-2 border-black pt-2">
              <div>Next.js 16 · Tailwind CSS · TypeScript</div>
              <div>AWS DynamoDB · Lambda · Bedrock AI</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-black mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-black">
          <div>
            © {new Date().getFullYear()} CampusCollab. Built for students who ship.
          </div>
          <div className="flex items-center gap-1 font-bold">
            Neo-Brutalist Edition <span className="text-[#FF70A6]">★</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
