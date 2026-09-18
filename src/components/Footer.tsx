import React from 'react';
import Link from 'next/link';
import { Leaf, Sparkles, Shield, Cpu, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0F3D2E] text-white border-t border-[#1F5341] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2E7058] flex items-center justify-center text-[#A3C9AB]">
                <Leaf className="w-5 h-5 text-[#A3C9AB]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">CampusCollab</span>
            </div>
            <p className="text-stone-300 text-sm leading-relaxed max-w-md">
              A campus-specific talent network designed around one core idea: <br />
              <strong className="text-[#A3C9AB] font-semibold">
                Project → Required Skills → Matching Students → Portfolio Proof → Collaboration.
              </strong>
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 bg-[#1A4B3A] border border-[#2E7058] px-3 py-1 rounded-full text-xs text-[#A3C9AB]">
                <Shield className="w-3.5 h-3.5" /> Privacy-First Requests
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#1A4B3A] border border-[#2E7058] px-3 py-1 rounded-full text-xs text-[#D9C3A5]">
                <Cpu className="w-3.5 h-3.5" /> AWS Serverless & AI Powered
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A3C9AB] mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/students" className="text-stone-300 hover:text-white transition-colors">
                  Find Talented Students
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-stone-300 hover:text-white transition-colors">
                  Project Requirements Feed
                </Link>
              </li>
              <li>
                <Link href="/match" className="text-stone-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A3C9AB]" />
                  AI Teammate Matcher
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-stone-300 hover:text-white transition-colors">
                  Campus Hackathons & Events
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-stone-300 hover:text-white transition-colors">
                  Collaboration Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Design & Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A3C9AB] mb-4">
              Design & Tech
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed mb-3">
              Crafted using the Editorial Nature Design System: Deep Green, Sand, and Warm Cream.
            </p>
            <div className="text-xs text-stone-400 space-y-1.5 border-t border-[#1F5341] pt-3">
              <div>Next.js 16 · Tailwind CSS · TypeScript</div>
              <div>AWS DynamoDB · Lambda · Bedrock AI</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1F5341] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} CampusCollab. Find People · Build Projects · Grow Together.
          </div>
          <div className="flex items-center gap-1 text-stone-300">
            Built for college students everywhere <Heart className="w-3.5 h-3.5 text-[#EA580C] fill-[#EA580C] inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
