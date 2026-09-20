'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Briefcase, CheckCircle, ShieldCheck, ArrowUpRight, Search } from 'lucide-react';

export default function HeroBotanical() {
  return (
    <section className="relative bg-[#FAF8F5] text-black overflow-hidden pt-12 pb-16 md:py-20 border-b-[2.5px] border-black">
      {/* Subtle retro dot background grid */}
      <div className="absolute inset-0 opacity-40 pointer-events-none neo-dot-bg"></div>

      {/* Floating 3D Gumroad-style Coin Stickers (from Image 2) */}
      <div className="absolute top-10 right-8 lg:right-28 hidden sm:flex flex-col items-center gap-3 pointer-events-none animate-bounce duration-1000">
        <div className="w-20 h-20 rounded-full bg-[#FF70A6] border-[2.5px] border-black shadow-[5px_5px_0px_0px_#000] flex items-center justify-center font-black text-2xl text-black rotate-12">
          ★
        </div>
      </div>
      <div className="absolute top-44 right-4 lg:right-12 hidden md:flex pointer-events-none">
        <div className="w-14 h-14 rounded-full bg-[#FFDE59] border-2 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center font-black text-lg text-black -rotate-12">
          ✦
        </div>
      </div>
      <div className="absolute bottom-12 left-6 hidden lg:flex pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-[#4FD1C5] border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center font-black text-xl text-black rotate-6">
          ⚡
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Giant Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Pill Sticker */}
            <div className="inline-flex items-center gap-2 bg-[#FFDE59] border-2 border-black px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_#000]">
              <span>★</span>
              <span>CAMPUS TALENT & PROJECT MATCHING</span>
            </div>

            {/* Giant Headline (Matching Image 2: "GO FROM 0 TO $1") */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[0.98]">
              GO FROM IDEA <br />
              <span className="bg-[#FF70A6] px-2 py-0.5 border-2 border-black shadow-[4px_4px_0px_0px_#000] inline-block mt-2 rotate-[-1deg]">
                TO REALITY.
              </span> <br />
              <span className="text-black inline-block mt-1">
                FIND YOUR PEOPLE.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-stone-800 font-medium leading-relaxed max-w-xl">
              Anyone with an idea can build it on campus. Connect with skilled designers, backend developers, and video creators ready to collaborate right now.
            </p>

            {/* Search/Explore Bar matching Gumroad input */}
            <div className="pt-2 max-w-lg">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/match"
                  className="bg-black hover:bg-[#FFDE59] hover:text-black text-white font-black text-sm uppercase tracking-wider px-7 py-3.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Find Teammates AI</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/students"
                  className="bg-[#FFDE59] hover:bg-[#ffe780] text-black font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer text-center"
                >
                  Explore Students
                </Link>
              </div>
            </div>

            {/* Neo-brutalist feature badges */}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-xs font-bold uppercase">
              <span className="inline-flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
                <CheckCircle className="w-3.5 h-3.5 text-black" />
                <span>Verified Code Proofs</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>Privacy-First Requests</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#4FD1C5] border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
                <Users className="w-3.5 h-3.5 text-black" />
                <span>Active Campuses</span>
              </span>
            </div>
          </div>

          {/* Right Column: Neo-Brutalist Bento Card Composition (Matching Image 0 & 2) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none space-y-4">
              {/* Main Card with Pink Header Block */}
              <div className="bg-white border-[2.5px] border-black rounded-2xl shadow-[7px_7px_0px_0px_#000] overflow-hidden">
                {/* Colored Top Header Block */}
                <div className="bg-[#FF70A6] border-b-2 border-black p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-black"></span>
                    <span className="font-black text-xs uppercase tracking-wider text-black">
                      Live Teammate Match
                    </span>
                  </div>
                  <span className="text-xs font-black bg-black text-[#FFDE59] px-3 py-0.5 rounded-full border border-black shadow-[1.5px_1.5px_0px_0px_#FFDE59]">
                    92% MATCH
                  </span>
                </div>

                {/* Candidate Highlight */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                      alt="Verified Campus Collaborator"
                      className="w-16 h-16 rounded-xl object-cover border-2 border-black shadow-[3px_3px_0px_0px_#000]"
                    />
                    <div>
                      <h3 className="font-black text-lg text-black uppercase">Verified Collaborator</h3>
                      <p className="text-xs font-bold text-black bg-[#FFDE59] px-2 py-0.5 rounded-md border border-black inline-block mt-0.5">
                        React Developer & UI/UX
                      </p>
                      <p className="text-[11px] font-medium text-stone-600 mt-1">
                        Campus Talent Network · Ready to Build
                      </p>
                    </div>
                  </div>

                  {/* Why Recommended AI breakdown */}
                  <div className="bg-[#FAF8F5] rounded-xl p-3.5 border-2 border-black space-y-1.5 text-xs font-bold">
                    <div className="text-[11px] uppercase tracking-wider text-black flex items-center gap-1 font-black">
                      <span>★</span> WHY RECOMMENDED:
                    </div>
                    <div className="flex items-center gap-2 text-stone-800 font-semibold">
                      <span className="font-black text-black">✓</span>
                      <span>Mastery in React, Next.js & Tailwind CSS</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-800 font-semibold">
                      <span className="font-black text-black">✓</span>
                      <span>4 verified project proofs on GitHub</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-800 font-semibold">
                      <span className="font-black text-black">✓</span>
                      <span className="bg-[#4FD1C5] px-1.5 py-0.5 rounded border border-black text-black">Available for Projects</span>
                    </div>
                  </div>

                  {/* Connect Action Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="text-xs font-bold text-black flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Project: <strong>AI Expense Tracker</strong></span>
                    </div>
                    <Link
                      href="/match"
                      className="text-xs font-black bg-black text-white hover:bg-[#FFDE59] hover:text-black px-4 py-2 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] transition-all cursor-pointer inline-flex items-center gap-1 uppercase"
                    >
                      <span>Match ↗</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Smaller Yellow Bento Stat Badge (Matching Image 2 Yellow Box) */}
              <div className="bg-[#FFDE59] border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-black">
                    Real Students · Real Projects
                  </div>
                  <div className="text-2xl font-black text-black tracking-tight">
                    100% FREE CAMPUS NETWORK
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-black text-xl">
                  🚀
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
