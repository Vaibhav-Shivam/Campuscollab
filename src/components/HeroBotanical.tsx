'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Briefcase, CheckCircle, ShieldCheck } from 'lucide-react';

export default function HeroBotanical() {
  return (
    <section className="relative bg-[#0F3D2E] text-white overflow-hidden pt-12 pb-20 md:py-24 border-b border-[#1F5341]">
      {/* Organic Nature Background Glow & Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Decorative leaf shapes & ambient gradients matching reference */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2E7058]/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#8B6F47]/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Campus Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-[#2E7058]/80 border border-[#A3C9AB]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#A3C9AB] shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#A3C9AB]" />
              <span>Campus Talent & Teammate Network</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Find Your <br />
              <span className="text-[#A3C9AB] underline decoration-[#8B6F47]/60 underline-offset-8">
                Project People
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-stone-200 leading-relaxed max-w-xl font-normal">
              Connect with students, find teammates, showcase your verified portfolio proof, and build amazing projects together — within your campus.
            </p>

            {/* Editorial Statement from UI/UX Spec */}
            <div className="border-l-2 border-[#D9C3A5] pl-4 py-1 text-xs sm:text-sm text-stone-300 italic font-light">
              &ldquo;Skills create opportunities. People bring ideas to life.&rdquo;
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/match"
                className="bg-[#2E7058] hover:bg-[#245946] text-white font-semibold px-7 py-3.5 rounded-full shadow-[0_4px_20px_rgba(46,112,88,0.4)] hover:shadow-[0_8px_25px_rgba(46,112,88,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center gap-2.5 text-sm sm:text-base ring-2 ring-[#A3C9AB]/20"
              >
                <span>Find Teammates with AI</span>
                <ArrowRight className="w-4 h-4 text-[#A3C9AB]" />
              </Link>

              <Link
                href="/students"
                className="bg-[#D9C3A5] hover:bg-[#CBB08E] text-[#17231D] font-semibold px-6 py-3.5 rounded-full shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer text-sm sm:text-base"
              >
                Explore Students
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#A3C9AB]" />
                <span>Verified Portfolio Proofs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D9C3A5]" />
                <span>Private Request System</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#10B981]" />
                <span>Active Campus Community</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Visual & Interactive Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Reference Botanical Accent Background Frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#8B6F47]/40 via-[#2E7058]/50 to-[#A3C9AB]/20 rounded-3xl blur-xl"></div>

              {/* Main Visual Composition Card */}
              <div className="relative bg-[#174636] border border-[#2E7058] rounded-3xl p-6 sm:p-7 shadow-2xl text-white backdrop-blur-md">
                {/* AI Match Floating Ribbon */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2E7058] mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span className="text-xs font-semibold text-[#A3C9AB] tracking-wide uppercase">
                      Live Teammate Match
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-[#A3C9AB] text-[#0F3D2E] px-2.5 py-0.5 rounded-full">
                    92% Match
                  </span>
                </div>

                {/* Candidate Highlight */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400"
                    alt="Priya Patel"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#A3C9AB]"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-white">Priya Patel</h3>
                    <p className="text-xs text-[#D9C3A5] font-medium">React Developer & UI/UX</p>
                    <p className="text-[11px] text-stone-300">Institute of Eng & Tech · 3rd Year</p>
                  </div>
                </div>

                {/* Why Recommended AI breakdown */}
                <div className="bg-[#0F3D2E]/90 rounded-2xl p-4 border border-[#2E7058] space-y-2 mb-5 text-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#A3C9AB]">
                    Why Recommended:
                  </div>
                  <div className="flex items-center gap-2 text-stone-200">
                    <span className="text-[#10B981] font-bold">✓</span>
                    <span>Proficient in React, Next.js & Tailwind CSS</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-200">
                    <span className="text-[#10B981] font-bold">✓</span>
                    <span>4 verified projects in portfolio (Study Room Planner)</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-200">
                    <span className="text-[#10B981] font-bold">✓</span>
                    <span className="text-[#A3C9AB] font-medium">Currently Available for Projects</span>
                  </div>
                </div>

                {/* Simulated Collaboration Request Bar */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-stone-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#D9C3A5]" />
                    <span>Project: <strong>AI Expense Tracker</strong></span>
                  </div>
                  <Link
                    href="/match"
                    className="text-xs font-bold bg-[#D9C3A5] hover:bg-[#CBB08E] text-[#17231D] px-4 py-2 rounded-full transition-all shadow cursor-pointer"
                  >
                    Match Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
