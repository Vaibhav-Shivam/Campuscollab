'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/StatusBadge';
import CreateProjectModal from '@/components/CreateProjectModal';
import EditProfileModal from '@/components/EditProfileModal';
import {
  Users,
  FolderKanban,
  Bell,
  Sparkles,
  Calendar,
  CheckCircle,
  CheckCircle2,
  PlusCircle,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  Edit3,
  ExternalLink,
  Code2,
  Plus,
  Link as LinkIcon
} from 'lucide-react';
import { AvailabilityStatus } from '@/types';

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

export default function StudentDashboardPage() {
  const {
    currentUser,
    projects,
    requests,
    events,
    updateUserStatus,
    respondToRequest
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [lookingGoal, setLookingGoal] = useState(currentUser.lookingForRole || '');
  const [statusUpdatedToast, setStatusUpdatedToast] = useState(false);

  const receivedRequests = requests.filter((r) => r.receiverId === currentUser.id);
  const sentRequests = requests.filter((r) => r.senderId === currentUser.id);
  const myProjects = projects.filter((p) => p.ownerId === currentUser.id);
  const registeredEvents = events.filter((e) => e.isRegistered);

  const handleStatusChange = (newStatus: AvailabilityStatus) => {
    updateUserStatus(newStatus, lookingGoal);
    setStatusUpdatedToast(true);
    setTimeout(() => setStatusUpdatedToast(false), 2500);
  };

  const handleSaveLookingGoal = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserStatus(currentUser.status, lookingGoal);
    setStatusUpdatedToast(true);
    setTimeout(() => setStatusUpdatedToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header Card */}
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000]"
              />
              <div className="space-y-1">
                <div className="text-[10px] font-black text-black uppercase tracking-wider bg-[#FFDE59] px-2.5 py-0.5 rounded-md border border-black inline-block shadow-[1.5px_1.5px_0px_0px_#000]">
                  ★ Student Dashboard
                </div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                  Hello, {currentUser.name.split(' ')[0]}!
                </h1>
                <p className="text-xs text-stone-600 font-bold">
                  {currentUser.primaryRole} · {currentUser.college}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#4FD1C5] hover:bg-[#38b2ac] text-black font-black text-xs uppercase px-4 py-2.5 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-black" />
                <span>Edit Profile & Links</span>
              </button>
              <Link
                href={`/students/${currentUser.id}`}
                className="flex-1 sm:flex-none text-center text-xs font-black uppercase px-4 py-2.5 rounded-xl border-2 border-black bg-white hover:bg-stone-100 text-black shadow-[2.5px_2.5px_0px_0px_#000] transition-colors"
              >
                Public Profile ↗
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#FF70A6] hover:bg-[#ff85b3] text-black font-black text-xs uppercase px-5 py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-black" />
                <span>Post Project</span>
              </button>
            </div>
          </div>

          {/* Activity Metrics Bar (Neo-Brutalist Colored Bento Tiles) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t-2 border-black">
            <div className="bg-[#FFDE59] rounded-xl p-4 border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000]">
              <div className="text-3xl font-black text-black">{myProjects.length}</div>
              <div className="text-[10px] font-black uppercase text-black">Active Projects</div>
            </div>
            <div className="bg-[#FF70A6] rounded-xl p-4 border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000]">
              <div className="text-3xl font-black text-black">
                {receivedRequests.filter((r) => r.status === 'pending').length}
              </div>
              <div className="text-[10px] font-black uppercase text-black">Pending Requests</div>
            </div>
            <div className="bg-[#4FD1C5] rounded-xl p-4 border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000]">
              <div className="text-3xl font-black text-black">{sentRequests.length}</div>
              <div className="text-[10px] font-black uppercase text-black">Sent Invites</div>
            </div>
            <div className="bg-[#9B87F5] rounded-xl p-4 border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000]">
              <div className="text-3xl font-black text-black">{registeredEvents.length}</div>
              <div className="text-[10px] font-black uppercase text-black">Events RSVP&apos;d</div>
            </div>
          </div>
        </div>

        {/* Section: Two-Way Availability Status Switcher */}
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-8 shadow-[5px_5px_0px_0px_#000] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-black">
                ★ Collaboration Status Switcher
              </h3>
              <p className="text-xs font-semibold text-stone-600">
                Choose how peer students discover you in searches and smart AI matching.
              </p>
            </div>
            {statusUpdatedToast && (
              <span className="text-xs font-black uppercase text-black bg-[#38E54D] border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-1 rounded-lg animate-in fade-in">
                ✓ Status updated!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Available button */}
            <button
              onClick={() => handleStatusChange('available')}
              className={`p-5 rounded-xl border-[2.5px] border-black text-left transition-all cursor-pointer ${
                currentUser.status === 'available'
                  ? 'bg-[#4FD1C5] shadow-[4px_4px_0px_0px_#000]'
                  : 'bg-[#FAF8F5] opacity-70 hover:opacity-100 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 rounded-full bg-black"></span>
                <span className="font-black text-sm uppercase text-black">
                  🟢 I am Available for Projects
                </span>
              </div>
              <p className="text-xs font-bold text-stone-800 leading-relaxed">
                I have skills and want to join active campus projects, hackathons, or startup teams.
              </p>
            </button>

            {/* Looking button */}
            <button
              onClick={() => handleStatusChange('looking')}
              className={`p-5 rounded-xl border-[2.5px] border-black text-left transition-all cursor-pointer ${
                currentUser.status === 'looking'
                  ? 'bg-[#FF6B6B] shadow-[4px_4px_0px_0px_#000]'
                  : 'bg-[#FAF8F5] opacity-70 hover:opacity-100 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 rounded-full bg-black"></span>
                <span className="font-black text-sm uppercase text-black">
                  🟠 I am Looking for Teammates
                </span>
              </div>
              <p className="text-xs font-bold text-stone-800 leading-relaxed">
                I have an active project and need students with specific skills to collaborate with me.
              </p>
            </button>
          </div>

          {/* Optional Goal / Note */}
          <form onSubmit={handleSaveLookingGoal} className="pt-2 flex gap-3">
            <input
              type="text"
              value={lookingGoal}
              onChange={(e) => setLookingGoal(e.target.value)}
              placeholder="Collaboration goal: e.g. Looking for React and UI/UX designers for AI projects..."
              className="flex-1 bg-[#FAF8F5] border-2 border-black rounded-xl px-4 py-2.5 text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
            />
            <button
              type="submit"
              className="bg-black hover:bg-[#FFDE59] hover:text-black text-white text-xs font-black uppercase px-5 py-2.5 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] transition-colors cursor-pointer"
            >
              Save Goal
            </button>
          </form>
        </div>

        {/* Section: Portfolio & External Links Hub */}
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-8 shadow-[5px_5px_0px_0px_#000] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase bg-[#4FD1C5] px-2.5 py-0.5 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000] mb-1.5">
                ★ Proof of Work Hub
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-black">
                Your Portfolio, GitHub & Work Proofs
              </h3>
              <p className="text-xs font-semibold text-stone-600">
                Connect your GitHub profile, personal portfolio website, LinkedIn, and Figma to build instant credibility.
              </p>
            </div>

            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 bg-[#FFDE59] hover:bg-[#ffe373] text-black font-black text-xs uppercase px-4 py-2.5 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Links & Proofs</span>
            </button>
          </div>

          {/* Grid of 4 Link Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* GitHub */}
            <div className={`p-4 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] flex flex-col justify-between ${
              currentUser.githubUrl ? 'bg-[#FAF8F5]' : 'bg-stone-50 border-dashed'
            }`}>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-black" />
                    <span className="font-black text-xs uppercase text-black">GitHub</span>
                  </div>
                  {currentUser.githubUrl ? (
                    <span className="text-[10px] font-black uppercase text-black bg-[#38E54D] px-2 py-0.5 rounded border border-black">
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase text-stone-500">Not set</span>
                  )}
                </div>
                <p className="text-[11px] text-stone-600 truncate font-semibold">
                  {currentUser.githubUrl || 'Add your GitHub profile'}
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-black/20">
                {currentUser.githubUrl ? (
                  <a
                    href={currentUser.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-black text-black hover:underline uppercase"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-black text-black hover:underline uppercase cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add GitHub Link</span>
                  </button>
                )}
              </div>
            </div>

            {/* Portfolio */}
            <div className={`p-4 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] flex flex-col justify-between ${
              currentUser.portfolioUrl ? 'bg-[#FAF8F5]' : 'bg-stone-50 border-dashed'
            }`}>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-black" />
                    <span className="font-black text-xs uppercase text-black">Portfolio</span>
                  </div>
                  {currentUser.portfolioUrl ? (
                    <span className="text-[10px] font-black uppercase text-black bg-[#38E54D] px-2 py-0.5 rounded border border-black">
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase text-stone-500">Not set</span>
                  )}
                </div>
                <p className="text-[11px] text-stone-600 truncate font-semibold">
                  {currentUser.portfolioUrl || 'Add personal website'}
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-black/20">
                {currentUser.portfolioUrl ? (
                  <a
                    href={currentUser.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-black text-black hover:underline uppercase"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-black text-black hover:underline uppercase cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Portfolio</span>
                  </button>
                )}
              </div>
            </div>

            {/* LinkedIn */}
            <div className={`p-4 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] flex flex-col justify-between ${
              currentUser.linkedinUrl ? 'bg-[#FAF8F5]' : 'bg-stone-50 border-dashed'
            }`}>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LinkedinIcon className="w-4 h-4 text-[#0077B5]" />
                    <span className="font-black text-xs uppercase text-black">LinkedIn</span>
                  </div>
                  {currentUser.linkedinUrl ? (
                    <span className="text-[10px] font-black uppercase text-black bg-[#38E54D] px-2 py-0.5 rounded border border-black">
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase text-stone-500">Not set</span>
                  )}
                </div>
                <p className="text-[11px] text-stone-600 truncate font-semibold">
                  {currentUser.linkedinUrl || 'Add LinkedIn profile'}
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-black/20">
                {currentUser.linkedinUrl ? (
                  <a
                    href={currentUser.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-black text-black hover:underline uppercase"
                  >
                    <span>Open LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-black text-black hover:underline uppercase cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add LinkedIn</span>
                  </button>
                )}
              </div>
            </div>

            {/* Figma */}
            <div className={`p-4 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] flex flex-col justify-between ${
              currentUser.figmaUrl ? 'bg-[#FAF8F5]' : 'bg-stone-50 border-dashed'
            }`}>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FigmaIcon className="w-4 h-4 text-black" />
                    <span className="font-black text-xs uppercase text-black">Figma</span>
                  </div>
                  {currentUser.figmaUrl ? (
                    <span className="text-[10px] font-black uppercase text-black bg-[#38E54D] px-2 py-0.5 rounded border border-black">
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase text-stone-500">Not set</span>
                  )}
                </div>
                <p className="text-[11px] text-stone-600 truncate font-semibold">
                  {currentUser.figmaUrl || 'Add Figma design link'}
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-black/20">
                {currentUser.figmaUrl ? (
                  <a
                    href={currentUser.figmaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-black text-black hover:underline uppercase"
                  >
                    <span>View Canvas</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-black text-black hover:underline uppercase cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Figma Link</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Project Proofs Summary */}
          <div className="pt-3 border-t-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-stone-700">
              <span className="font-black text-black uppercase">
                ★ {currentUser.proofs?.length || 0} Verified Proofs Attached
              </span>
              <span>— GitHub repos, deployed demo apps & design files</span>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#4FD1C5] hover:bg-[#38b2ac] text-black font-black text-xs uppercase px-3.5 py-1.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Manage Proofs</span>
            </button>
          </div>
        </div>

        {/* Section: Collaboration Requests Hub (Received & Sent) */}
        <div id="requests" className="space-y-5">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                Collaboration Requests Hub
              </h2>
              <p className="text-xs font-semibold text-stone-600">
                Manage invitations. Direct contact details unlock upon mutual acceptance.
              </p>
            </div>
            <span className="text-xs font-black uppercase text-black bg-[#FFDE59] border-2 border-black px-3.5 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#000]">
              {receivedRequests.length} Received · {sentRequests.length} Sent
            </span>
          </div>

          {/* Received Requests List */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black px-1">
              ★ Received Invitations
            </h3>

            {receivedRequests.length > 0 ? (
              receivedRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={req.senderAvatar}
                        alt={req.senderName}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                      />
                      <div>
                        <div className="font-black text-base uppercase text-black">
                          {req.senderName}
                        </div>
                        <div className="text-xs font-bold text-stone-600">
                          {req.senderRole} · {req.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase px-3 py-1 rounded-lg bg-[#FFDE59] border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]">
                        Project: {req.projectTitle}
                      </span>
                    </div>
                  </div>

                  {/* Message Note */}
                  <div className="bg-[#FAF8F5] rounded-xl p-4 border-2 border-black text-xs font-semibold text-stone-900 leading-relaxed shadow-[2px_2px_0px_0px_#000]">
                    &ldquo;{req.message}&rdquo;
                  </div>

                  {/* Actions or Accepted Contact Information */}
                  {req.status === 'pending' ? (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => respondToRequest(req.id, 'declined')}
                        className="px-5 py-2 rounded-xl border-2 border-black text-black bg-white hover:bg-stone-100 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => respondToRequest(req.id, 'accepted')}
                        className="px-6 py-2 rounded-xl bg-[#38E54D] hover:bg-[#2ecc71] text-black text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Accept Invitation ✓</span>
                      </button>
                    </div>
                  ) : req.status === 'accepted' ? (
                    <div className="bg-[#38E54D] border-2 border-black rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-black shadow-[3px_3px_0px_0px_#000]">
                      <div className="flex items-center gap-2 font-black uppercase">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>
                          Collaboration Accepted! You are connected with {req.senderName}.
                        </span>
                      </div>
                      <a
                        href={`mailto:${req.contactEmail || 'campus@collab.edu'}`}
                        className="inline-flex items-center gap-1.5 bg-black text-white font-black uppercase text-xs px-4 py-1.5 rounded-xl border border-black shadow-[1.5px_1.5px_0px_0px_#FFF]"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Teammate</span>
                      </a>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-500 font-bold italic pt-1">
                      You declined this invitation.
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white border-[2.5px] border-black rounded-2xl p-8 text-center text-xs font-bold text-stone-600 shadow-[4px_4px_0px_0px_#000]">
                No received requests at this time. Set your status to &ldquo;Available for Projects&rdquo; to be discovered!
              </div>
            )}
          </div>

          {/* Sent Requests List */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black px-1">
              ★ Sent Invitations
            </h3>

            {sentRequests.length > 0 ? (
              <div className="space-y-3">
                {sentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white border-2 border-black rounded-xl p-4 flex items-center justify-between gap-4 text-xs shadow-[3px_3px_0px_0px_#000]"
                  >
                    <div>
                      <div className="font-black text-black uppercase">
                        To: {req.receiverName}
                      </div>
                      <div className="text-stone-600 font-medium text-[11px]">
                        Project: {req.projectTitle} · Sent {req.createdAt}
                      </div>
                    </div>

                    <div>
                      {req.status === 'accepted' ? (
                        <span className="inline-flex items-center gap-1 bg-[#38E54D] text-black border-2 border-black px-3 py-1 rounded-lg font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
                          <CheckCircle className="w-3 h-3" />
                          Accepted
                        </span>
                      ) : req.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 bg-[#FFDE59] text-black border-2 border-black px-3 py-1 rounded-lg font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 border border-black px-3 py-1 rounded-lg font-black uppercase">
                          Declined
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-[2.5px] border-black rounded-2xl p-8 text-center text-xs font-bold text-stone-600 shadow-[4px_4px_0px_0px_#000]">
                You haven&apos;t sent any collaboration requests yet. Browse the student directory or use the AI matcher!
              </div>
            )}
          </div>
        </div>

        {/* Section: My Projects */}
        <div className="space-y-5 pt-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                My Active Projects ({myProjects.length})
              </h2>
              <p className="text-xs font-semibold text-stone-600">
                Projects created by your account looking for teammates.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 bg-black hover:bg-[#FFDE59] hover:text-black text-white font-black text-xs uppercase px-4 py-2.5 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FFDE59] text-black border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                      {proj.type}
                    </span>
                    <span className="text-xs font-bold text-stone-500">{proj.createdAt}</span>
                  </div>
                  <h4 className="font-black text-lg uppercase text-black">{proj.title}</h4>
                  <p className="text-xs font-medium text-stone-700 line-clamp-2 mt-1">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.requiredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="bg-[#FAF8F5] text-black text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-black"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t-2 border-black text-xs font-bold">
                  <span className="text-black">
                    Roster: <strong>{proj.currentMembers}/{proj.maxMembers}</strong>
                  </span>
                  <Link
                    href={`/projects/${proj.id}`}
                    className="font-black uppercase text-black hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>View Post</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}

      {showEditModal && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          student={currentUser}
        />
      )}
    </div>
  );
}
