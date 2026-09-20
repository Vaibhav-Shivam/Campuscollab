'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Student } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import CollabRequestModal from '@/components/CollabRequestModal';
import EditProfileModal from '@/components/EditProfileModal';
import {
  ArrowLeft,
  ExternalLink,
  Send,
  Trophy,
  Briefcase,
  Star,
  CheckCircle2,
  Mail,
  Code2,
  ArrowUpRight,
  Edit3,
  Plus,
  Link as LinkIcon
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
      <path fill="#000000" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
      <path fill="#2E7058" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
      <path fill="#8B6F47" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
      <path fill="#A3C9AB" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { allStudents, currentUser } = useApp();
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [cloudStudent, setCloudStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const studentId = params?.id as string;
  const localStudent = allStudents.find((s) => s.id === studentId);
  const student = localStudent || cloudStudent;

  useEffect(() => {
    if (!localStudent && studentId) {
      setIsLoading(true);
      fetch(`/api/students/${studentId}?_t=${Date.now()}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.student) {
            setCloudStudent(data.student);
          } else {
            // Fallback to query all
            return fetch(`/api/students?_t=${Date.now()}`)
              .then((r) => r.json())
              .then((allData) => {
                if (allData.success && Array.isArray(allData.students)) {
                  const found = allData.students.find((s: Student) => s.id === studentId);
                  if (found) setCloudStudent(found);
                }
              });
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [localStudent, studentId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-8 max-w-md text-center space-y-4 shadow-[5px_5px_0px_0px_#000]">
          <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-base font-black uppercase text-black">Loading Student Profile...</h2>
          <p className="text-xs font-medium text-stone-600">
            Fetching verified student proofs and details from campus network.
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-8 max-w-md text-center space-y-4 shadow-[5px_5px_0px_0px_#000]">
          <h2 className="text-xl font-black uppercase text-black">Profile Not Found</h2>
          <p className="text-xs font-medium text-stone-600">
            This student profile does not exist or may have been removed.
          </p>
          <Link
            href="/students"
            className="inline-flex items-center gap-2 text-xs font-black uppercase text-white bg-black px-5 py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const isSelf = student.id === currentUser.id;

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-white px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFDE59] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Profile Header Card */}
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000]"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                    {student.name}
                  </h1>
                  <StatusBadge status={student.status} size="md" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider bg-[#FFDE59] text-black px-2.5 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                    {student.primaryRole}
                  </span>
                </div>
                <div className="text-xs text-stone-600 font-bold pt-1">
                  {student.college} · {student.year} · {student.major}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {!isSelf ? (
                <button
                  onClick={() => setShowCollabModal(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-black hover:bg-[#FF70A6] hover:text-black text-white font-black text-xs sm:text-sm uppercase px-6 py-3.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Collaboration Request</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#FFDE59] hover:bg-[#ffe373] text-black font-black text-xs uppercase px-5 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile & Links</span>
                  </button>
                  <Link
                    href="/dashboard"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-black font-black text-xs uppercase px-4 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-colors"
                  >
                    <span>Dashboard</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Skills, Experience Metrics, Links */}
          <div className="space-y-6">
            {/* Experience Metrics */}
            <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000]">
              <h3 className="text-xs font-black uppercase tracking-wider text-black mb-4">
                ★ Experience Record
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FFDE59] rounded-xl p-4 text-center border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <Briefcase className="w-5 h-5 text-black mx-auto mb-1.5" />
                  <div className="text-3xl font-black text-black">
                    {student.projectCount}
                  </div>
                  <div className="text-[10px] font-black uppercase text-black">Projects</div>
                </div>
                <div className="bg-[#4FD1C5] rounded-xl p-4 text-center border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <Trophy className="w-5 h-5 text-black mx-auto mb-1.5" />
                  <div className="text-3xl font-black text-black">
                    {student.hackathonCount}
                  </div>
                  <div className="text-[10px] font-black uppercase text-black">Hackathons</div>
                </div>
              </div>
            </div>

            {/* Skills & Star Ratings */}
            <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-black">
                ★ Skills & Mastery
              </h3>
              <div className="space-y-3">
                {student.skills.map((sk) => (
                  <div key={sk.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-black">{sk.name}</span>
                      <span className="text-[10px] font-bold text-stone-500 uppercase">{sk.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${
                            star <= sk.level ? 'text-black' : 'text-stone-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio & External Proofs */}
            <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-black">
                  ★ External Proofs & Links
                </h3>
                {isSelf && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="text-[10px] font-black uppercase bg-[#FAF8F5] hover:bg-[#FFDE59] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="space-y-2 text-xs">
                {student.githubUrl && (
                  <a
                    href={student.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#FFDE59] text-black font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <GithubIcon className="w-4 h-4 text-black" />
                      GitHub Profile
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {student.portfolioUrl && (
                  <a
                    href={student.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#FFDE59] text-black font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-black" />
                      Portfolio Site
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {student.linkedinUrl && (
                  <a
                    href={student.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#0077B5] hover:text-white text-black font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <LinkedinIcon className="w-4 h-4 text-[#0077B5] group-hover:text-white" />
                      LinkedIn Network
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {student.figmaUrl && (
                  <a
                    href={student.figmaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#FFDE59] text-black font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FigmaIcon className="w-4 h-4 text-black" />
                      Figma Canvas
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {!student.githubUrl && !student.portfolioUrl && !student.linkedinUrl && !student.figmaUrl && (
                  <div className="text-center py-4 bg-[#FAF8F5] rounded-xl border-2 border-dashed border-stone-300 p-4 space-y-2">
                    <p className="text-xs font-bold text-stone-500">No external links connected yet.</p>
                    {isSelf ? (
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-black uppercase bg-[#FFDE59] text-black px-3.5 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-[-1px] transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Portfolio & GitHub</span>
                      </button>
                    ) : (
                      <p className="text-[11px] text-stone-400">Links will appear here when added.</p>
                    )}
                  </div>
                )}

                {isSelf && (student.githubUrl || student.portfolioUrl || student.linkedinUrl || student.figmaUrl) && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 mt-1 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-black text-[11px] uppercase border border-black shadow-[1.5px_1.5px_0px_0px_#000] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Manage / Add Links</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: About, Looking For, Verified Projects List */}
          <div className="lg:col-span-2 space-y-6">
            {/* About & Interests */}
            <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-8 shadow-[5px_5px_0px_0px_#000] space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-black">
                ★ About Me
              </h3>
              <p className="text-sm text-stone-800 font-semibold leading-relaxed">
                {student.bio}
              </p>

              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-black mb-2">
                  Interests
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {student.interests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-[#FAF8F5] text-black text-xs font-bold px-3 py-1 rounded-lg border border-black shadow-[1.5px_1.5px_0px_0px_#000]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Looking For goal */}
              {student.lookingForRole && (
                <div className="bg-[#FFDE59] border-2 border-black rounded-xl p-4 shadow-[2.5px_2.5px_0px_0px_#000]">
                  <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1">
                    Collaboration Goal:
                  </div>
                  <p className="text-xs text-black font-bold">
                    {student.lookingForRole}
                  </p>
                </div>
              )}
            </div>

            {/* Proof of Skills / Real Projects Built */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-black">
                    Verified Portfolio Proofs
                  </h3>
                  <p className="text-xs font-semibold text-stone-600">
                    Real code and interactive products built by {student.name}.
                  </p>
                </div>
                {isSelf && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-flex items-center gap-1.5 bg-[#4FD1C5] hover:bg-[#38b2ac] text-black font-black text-xs uppercase px-3.5 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Proof</span>
                  </button>
                )}
              </div>

              {student.proofs.length === 0 ? (
                <div className="bg-white border-[2.5px] border-black rounded-2xl p-8 shadow-[5px_5px_0px_0px_#000] text-center space-y-3">
                  <p className="text-sm font-bold text-stone-600">
                    {isSelf
                      ? 'No verified proofs added yet. Showcase your GitHub repos, live web apps, and Figma prototypes to attract teammates!'
                      : `${student.name} hasn't added any project proofs yet.`}
                  </p>
                  {isSelf && (
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="inline-flex items-center gap-1.5 bg-[#FFDE59] text-black font-black text-xs uppercase px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-[-1px] transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Your First Proof</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {student.proofs.map((proof, idx) => (
                    <div
                      key={idx}
                      className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] hover:-translate-y-0.5 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#4FD1C5] text-black border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                            {proof.role}
                          </span>
                          <h4 className="text-lg font-black uppercase text-black mt-2">
                            {proof.title}
                          </h4>
                        </div>
                      </div>

                      <p className="text-xs text-stone-700 font-medium leading-relaxed">
                        {proof.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {proof.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="bg-[#FAF8F5] text-black text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-black"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-3 border-t-2 border-black text-xs font-black uppercase">
                        {proof.githubUrl && (
                          <a
                            href={proof.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-black hover:underline"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                            <span>View Code ↗</span>
                          </a>
                        )}
                        {proof.liveDemoUrl && (
                          <a
                            href={proof.liveDemoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#FFDE59] px-3 py-1 rounded-lg border border-black shadow-[1.5px_1.5px_0px_0px_#000] text-black"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live Demo ↗</span>
                          </a>
                        )}
                        {proof.figmaUrl && (
                          <a
                            href={proof.figmaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#FF70A6] px-3 py-1 rounded-lg border border-black shadow-[1.5px_1.5px_0px_0px_#000] text-black"
                          >
                            <FigmaIcon className="w-3.5 h-3.5" />
                            <span>Figma Prototype ↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Edit Profile & Links Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        student={student}
      />
    </div>
  );
}
