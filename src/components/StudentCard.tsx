'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Student } from '@/types';
import StatusBadge from './StatusBadge';
import { Briefcase, Trophy, ArrowUpRight, Send, Sparkles } from 'lucide-react';
import CollabRequestModal from './CollabRequestModal';

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
