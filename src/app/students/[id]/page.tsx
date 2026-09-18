'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/StatusBadge';
import CollabRequestModal from '@/components/CollabRequestModal';
import {
  ArrowLeft,
  ExternalLink,
  Send,
  Trophy,
  Briefcase,
  Star,
  CheckCircle2,
  Mail,
  Code2
} from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function FigmaIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 38 57" fill="currentColor">
      <path fill="#EA580C" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
      <path fill="#0F3D2E" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
      <path fill="#2E7058" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
      <path fill="#8B6F47" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
      <path fill="#A3C9AB" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
    </svg>
  );
}

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { allStudents, currentUser } = useApp();
  const [showCollabModal, setShowCollabModal] = useState(false);

  const studentId = params?.id as string;
  const student = allStudents.find((s) => s.id === studentId);

  if (!student) {
    return (
      <div className="min-h-screen bg-[#F5F1E6] flex items-center justify-center p-4">
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-8 max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold text-[#0F3D2E]">Student Profile Not Found</h2>
          <p className="text-xs text-stone-500">
            The student profile you are trying to view does not exist or may have been removed.
          </p>
          <Link
            href="/students"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-[#0F3D2E] px-5 py-2.5 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Students</span>
          </Link>
        </div>
      </div>
    );
  }

  const isSelf = student.id === currentUser.id;

  return (
    <div className="min-h-screen bg-[#F5F1E6] py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#0F3D2E] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Profile Header Card */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Subtle nature corner gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#A3C9AB]/20 via-[#D9C3A5]/10 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-[#F5F1E6] shadow-md"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0F3D2E]">
                    {student.name}
                  </h1>
                  <StatusBadge status={student.status} size="md" />
                </div>
                <div className="text-sm font-semibold text-[#8B6F47]">
                  {student.primaryRole}
                </div>
                <div className="text-xs text-stone-500">
                  {student.college} · {student.year} · {student.major}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isSelf ? (
                <button
                  onClick={() => setShowCollabModal(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#2E7058] hover:bg-[#245946] text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#A3C9AB]" />
                  <span>Send Collaboration Request</span>
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-[#D9C3A5] hover:bg-[#CBB08E] text-[#17231D] font-semibold text-xs px-5 py-2.5 rounded-full shadow-sm"
                >
                  Edit Profile in Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Skills, Proof Metrics, Links */}
          <div className="space-y-6">
            {/* Experience Metrics */}
            <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B6F47] mb-4">
                Experience Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F5F1E6] rounded-2xl p-4 text-center border border-[#E8E2D5]">
                  <Briefcase className="w-5 h-5 text-[#2E7058] mx-auto mb-1.5" />
                  <div className="text-2xl font-bold text-[#0F3D2E]">
                    {student.projectCount}
                  </div>
                  <div className="text-[11px] font-medium text-stone-600">Projects Built</div>
                </div>
                <div className="bg-[#F5F1E6] rounded-2xl p-4 text-center border border-[#E8E2D5]">
                  <Trophy className="w-5 h-5 text-[#D97706] mx-auto mb-1.5" />
                  <div className="text-2xl font-bold text-[#0F3D2E]">
                    {student.hackathonCount}
                  </div>
                  <div className="text-[11px] font-medium text-stone-600">Hackathons</div>
                </div>
              </div>
            </div>

            {/* Skills & Proficiency Stars */}
            <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B6F47]">
                Skills & Proficiency
              </h3>
              <div className="space-y-3">
                {student.skills.map((sk) => (
                  <div key={sk.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0F3D2E]">{sk.name}</span>
                      <span className="text-stone-400 font-medium">{sk.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= sk.level
                              ? 'text-[#F59E0B] fill-[#F59E0B]'
                              : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio & Verified Links */}
            <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B6F47] mb-2">
                Portfolio & External Proofs
              </h3>
              <div className="space-y-2 text-xs">
                {student.githubUrl && (
                  <a
                    href={student.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F1E6] hover:bg-[#E8E2D5] text-[#0F3D2E] font-medium transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <GithubIcon className="w-4 h-4 text-stone-700" />
                      GitHub Profile
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                  </a>
                )}
                {student.figmaUrl && (
                  <a
                    href={student.figmaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F1E6] hover:bg-[#E8E2D5] text-[#0F3D2E] font-medium transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FigmaIcon className="w-4 h-4 text-[#EA580C]" />
                      Figma Community
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                  </a>
                )}
                {student.portfolioUrl && (
                  <a
                    href={student.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F1E6] hover:bg-[#E8E2D5] text-[#0F3D2E] font-medium transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#2E7058]" />
                      Personal Portfolio
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: About, Looking For, Verified Projects List */}
          <div className="lg:col-span-2 space-y-6">
            {/* About & Interests */}
            <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B6F47]">
                About Me
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed">
                {student.bio}
              </p>

              <div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Interests
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {student.interests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-[#F5F1E6] text-[#0F3D2E] text-xs font-medium px-3 py-1 rounded-lg border border-[#E8E2D5]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Looking For block */}
              {student.lookingForRole && (
                <div className="bg-[#FAF7F0] border border-[#D9C3A5] rounded-2xl p-4 mt-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#8B6F47] mb-1">
                    Looking For / Collaboration Goals:
                  </div>
                  <p className="text-xs text-[#0F3D2E] font-medium">
                    {student.lookingForRole}
                  </p>
                </div>
              )}
            </div>

            {/* Proof of Skills / Real Projects Built */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-xl font-bold text-[#0F3D2E]">
                    Proof of Skills & Projects
                  </h3>
                  <p className="text-xs text-stone-500">
                    Real applications with verified code and interactive demos.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {student.proofs.map((proof, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#2E7058]/10 text-[#2E7058]">
                          {proof.role}
                        </span>
                        <h4 className="text-lg font-bold text-[#0F3D2E] mt-1.5">
                          {proof.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {proof.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {proof.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-[#F5F1E6] text-stone-700 text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-[#E8E2D5]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100 text-xs">
                      {proof.githubUrl && (
                        <a
                          href={proof.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-[#0F3D2E] hover:text-[#2E7058] transition-colors"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>View Code</span>
                        </a>
                      )}
                      {proof.liveDemoUrl && (
                        <a
                          href={proof.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-[#2E7058] hover:text-[#0F3D2E] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Interactive Demo</span>
                        </a>
                      )}
                      {proof.figmaUrl && (
                        <a
                          href={proof.figmaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-[#EA580C] hover:text-[#C2410C] transition-colors"
                        >
                          <FigmaIcon className="w-3.5 h-3.5" />
                          <span>Figma Canvas Prototype</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCollabModal && (
        <CollabRequestModal
          targetStudent={student}
          onClose={() => setShowCollabModal(false)}
        />
      )}
    </div>
  );
}
