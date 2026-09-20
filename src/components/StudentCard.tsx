'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Student } from '@/types';
import StatusBadge from './StatusBadge';
import { Briefcase, Trophy, ArrowUpRight, Send, Sparkles, Code2 } from 'lucide-react';
import CollabRequestModal from './CollabRequestModal';

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function FigmaIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 38 57" fill="currentColor">
      <path fill="#EA580C" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
      <path fill="#000000" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
      <path fill="#2E7058" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
      <path fill="#8B6F47" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
      <path fill="#A3C9AB" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
    </svg>
  );
}

function LinkedinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

interface StudentCardProps {
  student: Student;
  matchScore?: number;
  highlightReason?: string;
}

export default function StudentCard({ student, matchScore, highlightReason }: StudentCardProps) {
  const [showCollabModal, setShowCollabModal] = useState(false);

  const safeProofs = Array.isArray(student.proofs) ? student.proofs : [];
  const safeSkills = Array.isArray(student.skills)
    ? student.skills.map((sk) =>
        typeof sk === 'string'
          ? { name: sk, level: 4, category: 'General' }
          : { name: sk?.name || '', level: sk?.level || 4, category: sk?.category || 'General' }
      )
    : [];

  return (
    <>
      <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#000] transition-all duration-150 flex flex-col justify-between group relative">
        {/* Match score badge if passed from AI matcher */}
        {matchScore !== undefined && (
          <div className="absolute -top-3.5 right-5 bg-[#FF70A6] text-black border-2 border-black px-3.5 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 z-10 uppercase">
            <span>★</span>
            <span>{matchScore}% Match</span>
          </div>
        )}

        <div>
          {/* Header Info: Avatar, Name, Role, College */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <img
                src={student.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(student.name || 'User')}`}
                alt={student.name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000]"
              />
              {safeProofs.length > 0 && (
                <span
                  className="absolute -bottom-1 -right-1 bg-[#FFDE59] text-black border-1.5 border-black p-1 rounded-full shadow-[1px_1px_0px_0px_#000]"
                  title="Verified Project Proofs Available"
                >
                  <Briefcase className="w-3 h-3" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                href={`/students/${student.id}`}
                className="font-black text-lg text-black hover:text-[#FF70A6] transition-colors line-clamp-1 cursor-pointer uppercase tracking-tight"
              >
                {student.name}
              </Link>
              <div className="text-xs font-bold text-black bg-[#FFDE59] px-2 py-0.5 rounded-md border border-black inline-block mt-0.5">
                {student.primaryRole}
              </div>
              <div className="text-xs text-stone-600 mt-1 truncate font-medium">
                {student.college} · {student.year}
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mb-4">
            <StatusBadge status={student.status || 'available'} size="sm" />
          </div>

          {/* AI Match Reason snippet if applicable */}
          {highlightReason && (
            <div className="mb-4 bg-[#FAF8F5] border-2 border-black rounded-xl p-2.5 text-xs text-black font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
              <span className="font-black">★</span>
              <span className="truncate">{highlightReason}</span>
            </div>
          )}

          {/* Bio preview */}
          <p className="text-xs text-stone-700 font-medium line-clamp-2 leading-relaxed mb-4">
            {student.bio || 'Campus collaborator ready to build.'}
          </p>

          {/* Skills Badges */}
          <div className="mb-4">
            <div className="text-[10px] font-black text-black uppercase tracking-wider mb-2">
              Skills & Stack
            </div>
            <div className="flex flex-wrap gap-1.5">
              {safeSkills.slice(0, 4).map((skill, idx) => (
                <span
                  key={skill.name || idx}
                  className="bg-[#FAF8F5] text-black text-xs font-bold px-2.5 py-1 rounded-lg border border-black shadow-[1.5px_1.5px_0px_0px_#000]"
                >
                  {skill.name}
                </span>
              ))}
              {safeSkills.length > 4 && (
                <span className="text-[11px] font-bold text-black self-center pl-1">
                  +{safeSkills.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Connected Portfolio & Social Links */}
          {(student.githubUrl || student.portfolioUrl || student.linkedinUrl || student.figmaUrl) && (
            <div className="flex items-center gap-1.5 mb-3">
              {student.githubUrl && (
                <a
                  href={student.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub Profile"
                  className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#FFDE59] border border-black text-black transition-colors shadow-[1px_1px_0px_0px_#000]"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {student.portfolioUrl && (
                <a
                  href={student.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Portfolio Website"
                  className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#FFDE59] border border-black text-black transition-colors shadow-[1px_1px_0px_0px_#000]"
                >
                  <Code2 className="w-3.5 h-3.5" />
                </a>
              )}
              {student.linkedinUrl && (
                <a
                  href={student.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="LinkedIn Network"
                  className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#0077B5] hover:text-white border border-black text-[#0077B5] transition-colors shadow-[1px_1px_0px_0px_#000]"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {student.figmaUrl && (
                <a
                  href={student.figmaUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Figma Portfolio"
                  className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#FF70A6] border border-black text-black transition-colors shadow-[1px_1px_0px_0px_#000]"
                >
                  <FigmaIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Proof Evidence Metrics Box */}
          <div className="flex items-center gap-4 py-2.5 px-3 rounded-xl bg-[#FAF8F5] border-2 border-black text-xs text-black font-bold mb-4 shadow-[2px_2px_0px_0px_#000]">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-black" />
              <span>{student.projectCount} Projects</span>
            </div>
            <div className="w-px h-3.5 bg-black"></div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-black" />
              <span>{student.hackathonCount} Hackathons</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t-2 border-black">
          <Link
            href={`/students/${student.id}`}
            className="flex-1 py-2 text-center text-xs font-bold text-black bg-white hover:bg-stone-100 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1 uppercase"
          >
            <span>Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setShowCollabModal(true)}
            className="flex-1 py-2 text-center text-xs font-black text-black bg-[#FFDE59] hover:bg-[#FF70A6] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase"
          >
            <Send className="w-3 h-3 text-black" />
            <span>Connect</span>
          </button>
        </div>
      </div>

      {showCollabModal && (
        <CollabRequestModal
          targetStudent={student}
          onClose={() => setShowCollabModal(false)}
        />
      )}
    </>
  );
}
