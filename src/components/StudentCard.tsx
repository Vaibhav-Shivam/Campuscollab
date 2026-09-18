'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Student } from '@/types';
import StatusBadge from './StatusBadge';
import { Briefcase, Trophy, ExternalLink, Send, Sparkles } from 'lucide-react';
import CollabRequestModal from './CollabRequestModal';

interface StudentCardProps {
  student: Student;
  matchScore?: number;
  highlightReason?: string;
}

export default function StudentCard({ student, matchScore, highlightReason }: StudentCardProps) {
  const [showCollabModal, setShowCollabModal] = useState(false);

  return (
    <>
      <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,61,46,0.06)] hover:shadow-[0_14px_36px_rgba(15,61,46,0.12)] transition-all duration-250 flex flex-col justify-between hover:-translate-y-1 group relative">
        {/* Match score badge if passed from AI matcher */}
        {matchScore !== undefined && (
          <div className="absolute -top-3 right-5 bg-[#0F3D2E] text-white border border-[#A3C9AB] px-3.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 z-10">
            <Sparkles className="w-3.5 h-3.5 text-[#A3C9AB]" />
            <span>{matchScore}% Match</span>
          </div>
        )}

        <div>
          {/* Header Info: Avatar, Name, Role, College */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#E8E2D5] group-hover:ring-[#2E7058] transition-all"
              />
              {student.proofs.length > 0 && (
                <span
                  className="absolute -bottom-1 -right-1 bg-[#2E7058] text-[#A3C9AB] p-1 rounded-full shadow"
                  title="Verified Project Proofs Available"
                >
                  <Briefcase className="w-3 h-3" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                href={`/students/${student.id}`}
                className="font-bold text-lg text-[#0F3D2E] hover:text-[#2E7058] transition-colors line-clamp-1 cursor-pointer"
              >
                {student.name}
              </Link>
              <div className="text-xs font-semibold text-[#8B6F47] uppercase tracking-wide">
                {student.primaryRole}
              </div>
              <div className="text-xs text-stone-500 mt-0.5 truncate">
                {student.college} · {student.year}
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mb-4">
            <StatusBadge status={student.status} size="sm" />
          </div>

          {/* AI Match Reason snippet if applicable */}
          {highlightReason && (
            <div className="mb-4 bg-[#F5F1E6] border border-[#D9C3A5] rounded-xl p-2.5 text-xs text-[#0F3D2E] font-medium flex items-center gap-2">
              <span className="text-[#2E7058] font-bold">✓</span>
              <span className="truncate">{highlightReason}</span>
            </div>
          )}

          {/* Bio preview */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {student.bio}
          </p>

          {/* Skills Badges */}
          <div className="mb-4">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              Skills & Tools
            </div>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill.name}
                  className="bg-[#F5F1E6] hover:bg-[#E8E2D5] text-[#0F3D2E] text-xs font-medium px-2.5 py-1 rounded-lg border border-[#E8E2D5] transition-colors"
                >
                  {skill.name}
                </span>
              ))}
              {student.skills.length > 4 && (
                <span className="text-[11px] text-stone-400 self-center pl-1 font-medium">
                  +{student.skills.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Proof Evidence Metrics */}
          <div className="flex items-center gap-4 py-2.5 px-3 rounded-2xl bg-[#F5F1E6]/70 border border-[#E8E2D5] text-xs text-stone-700 mb-4">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#2E7058]" />
              <span className="font-bold text-[#0F3D2E]">{student.projectCount}</span> Projects
            </div>
            <div className="w-px h-3.5 bg-stone-300"></div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#D97706]" />
              <span className="font-bold text-[#0F3D2E]">{student.hackathonCount}</span> Hackathons
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
          <Link
            href={`/students/${student.id}`}
            className="flex-1 py-2.5 text-center text-xs font-semibold text-[#0F3D2E] bg-stone-100 hover:bg-[#E8E2D5] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <span>View Profile</span>
            <ExternalLink className="w-3 h-3 text-stone-500" />
          </Link>
          <button
            onClick={() => setShowCollabModal(true)}
            className="flex-1 py-2.5 text-center text-xs font-semibold text-white bg-[#2E7058] hover:bg-[#245946] rounded-xl transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Send className="w-3 h-3 text-[#A3C9AB]" />
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
