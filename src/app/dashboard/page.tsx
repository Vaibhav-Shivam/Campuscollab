'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/StatusBadge';
import CreateProjectModal from '@/components/CreateProjectModal';
import {
  Users,
  FolderKanban,
  Bell,
  Sparkles,
  Calendar,
  CheckCircle,
  PlusCircle,
  Mail,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { AvailabilityStatus } from '@/types';

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
    </div>
  );
}
