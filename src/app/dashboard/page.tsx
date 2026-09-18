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
  XCircle,
  PlusCircle,
  Mail,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap
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

  // Filter requests
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
    <div className="min-h-screen bg-[#F5F1E6] py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Welcome Header */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#2E7058]"
              />
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#8B6F47] uppercase tracking-wider">
                  Student Dashboard
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F3D2E]">
                  Hello, {currentUser.name.split(' ')[0]} 👋
                </h1>
                <p className="text-xs text-stone-500">
                  {currentUser.primaryRole} · {currentUser.college}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                href={`/students/${currentUser.id}`}
                className="flex-1 sm:flex-none text-center text-xs font-semibold px-4 py-2.5 rounded-full border border-[#D9C3A5] bg-[#F5F1E6] hover:bg-[#E8E2D5] text-[#0F3D2E] transition-colors"
              >
                View Public Profile
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#2E7058] hover:bg-[#245946] text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#A3C9AB]" />
                <span>Post Project</span>
              </button>
            </div>
          </div>

          {/* Activity Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-stone-100">
            <div className="bg-[#F5F1E6] rounded-2xl p-4 border border-[#E8E2D5]">
              <div className="text-2xl font-bold text-[#0F3D2E]">{myProjects.length}</div>
              <div className="text-xs font-medium text-stone-600">Active Projects</div>
            </div>
            <div className="bg-[#F5F1E6] rounded-2xl p-4 border border-[#E8E2D5]">
              <div className="text-2xl font-bold text-[#0F3D2E]">
                {receivedRequests.filter((r) => r.status === 'pending').length}
              </div>
              <div className="text-xs font-medium text-stone-600">Pending Requests</div>
            </div>
            <div className="bg-[#F5F1E6] rounded-2xl p-4 border border-[#E8E2D5]">
              <div className="text-2xl font-bold text-[#0F3D2E]">{sentRequests.length}</div>
              <div className="text-xs font-medium text-stone-600">Sent Invitations</div>
            </div>
            <div className="bg-[#F5F1E6] rounded-2xl p-4 border border-[#E8E2D5]">
              <div className="text-2xl font-bold text-[#0F3D2E]">{registeredEvents.length}</div>
              <div className="text-xs font-medium text-stone-600">Events RSVP&apos;d</div>
            </div>
          </div>
        </div>

        {/* Section: Two-Way Availability Status Switcher */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#0F3D2E]">
                My Collaboration Status
              </h3>
              <p className="text-xs text-stone-500">
                Control how peer students discover you in searches and smart matching.
              </p>
            </div>
            {statusUpdatedToast && (
              <span className="text-xs font-bold text-[#065F46] bg-[#10B981]/15 border border-[#10B981]/30 px-3 py-1 rounded-full animate-in fade-in">
                ✓ Status updated!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Available button */}
            <button
              onClick={() => handleStatusChange('available')}
              className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                currentUser.status === 'available'
                  ? 'border-[#10B981] bg-[#10B981]/10 shadow-xs'
                  : 'border-[#E8E2D5] bg-[#F5F1E6]/40 hover:bg-[#F5F1E6]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
                <span className="font-bold text-sm text-[#065F46]">
                  🟢 I am Available for Projects
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                I have skills and want to join active projects, student hackathons, or startup teams.
              </p>
            </button>

            {/* Looking button */}
            <button
              onClick={() => handleStatusChange('looking')}
              className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                currentUser.status === 'looking'
                  ? 'border-[#F59E0B] bg-[#F59E0B]/10 shadow-xs'
                  : 'border-[#E8E2D5] bg-[#F5F1E6]/40 hover:bg-[#F5F1E6]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
                <span className="font-bold text-sm text-[#92400E]">
                  🟠 I am Looking for Teammates
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
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
              className="flex-1 bg-[#F5F1E6]/60 border border-[#D9C3A5] rounded-xl px-4 py-2 text-xs text-[#17231D] focus:outline-none focus:ring-2 focus:ring-[#2E7058]"
            />
            <button
              type="submit"
              className="bg-[#2E7058] hover:bg-[#245946] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Update Goal
            </button>
          </form>
        </div>

        {/* Section: Collaboration Requests Hub (Received & Sent) */}
        <div id="requests" className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-2xl font-bold text-[#0F3D2E]">
                Collaboration Requests Hub
              </h2>
              <p className="text-xs text-stone-500">
                Manage invitations. Direct contact details unlock upon mutual acceptance.
              </p>
            </div>
            <span className="text-xs font-bold text-[#2E7058] bg-white border border-[#E8E2D5] px-3.5 py-1.5 rounded-full">
              {receivedRequests.length} Received · {sentRequests.length} Sent
            </span>
          </div>

          {/* Received Requests List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B6F47] px-1">
              Received Invitations
            </h3>

            {receivedRequests.length > 0 ? (
              receivedRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={req.senderAvatar}
                        alt={req.senderName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-stone-200"
                      />
                      <div>
                        <div className="font-bold text-base text-[#0F3D2E]">
                          {req.senderName}
                        </div>
                        <div className="text-xs text-stone-500">
                          {req.senderRole} · {req.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#D9C3A5] text-[#8B6F47]">
                        Project: {req.projectTitle}
                      </span>
                    </div>
                  </div>

                  {/* Message Note */}
                  <div className="bg-[#F5F1E6] rounded-2xl p-4 border border-[#E8E2D5] text-xs text-stone-700 leading-relaxed">
                    &ldquo;{req.message}&rdquo;
                  </div>

                  {/* Actions or Accepted Contact Information */}
                  {req.status === 'pending' ? (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => respondToRequest(req.id, 'declined')}
                        className="px-5 py-2 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => respondToRequest(req.id, 'accepted')}
                        className="px-6 py-2 rounded-full bg-[#2E7058] hover:bg-[#245946] text-white text-xs font-semibold shadow transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-[#A3C9AB]" />
                        <span>Accept Invitation</span>
                      </button>
                    </div>
                  ) : req.status === 'accepted' ? (
                    <div className="bg-[#10B981]/15 border border-[#10B981]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#065F46]">
                      <div className="flex items-center gap-2 font-medium">
                        <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>
                          <strong>Collaboration Accepted!</strong> You are now connected with {req.senderName}.
                        </span>
                      </div>
                      <a
                        href={`mailto:${req.contactEmail || 'campus@collab.edu'}`}
                        className="inline-flex items-center gap-1.5 bg-[#2E7058] text-white font-semibold px-4 py-1.5 rounded-full"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Teammate</span>
                      </a>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-400 italic pt-1">
                      You declined this invitation.
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white border border-[#E8E2D5] rounded-3xl p-8 text-center text-xs text-stone-500">
                No received requests at this time. Set your status to &ldquo;Available for Projects&rdquo; to be discovered!
              </div>
            )}
          </div>

          {/* Sent Requests List */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B6F47] px-1">
              Sent Invitations
            </h3>

            {sentRequests.length > 0 ? (
              <div className="space-y-3">
                {sentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white border border-[#E8E2D5] rounded-2xl p-4 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#0F3D2E]">
                        To: {req.receiverName}
                      </div>
                      <div className="text-stone-500 text-[11px]">
                        Project: {req.projectTitle} · Sent {req.createdAt}
                      </div>
                    </div>

                    <div>
                      {req.status === 'accepted' ? (
                        <span className="inline-flex items-center gap-1 bg-[#10B981]/15 text-[#065F46] border border-[#10B981]/30 px-3 py-1 rounded-full font-bold">
                          <CheckCircle className="w-3 h-3 text-[#10B981]" />
                          Accepted
                        </span>
                      ) : req.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 bg-[#F59E0B]/15 text-[#92400E] border border-[#F59E0B]/30 px-3 py-1 rounded-full font-bold">
                          Pending Response
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-500 px-3 py-1 rounded-full font-bold">
                          Declined
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E8E2D5] rounded-3xl p-8 text-center text-xs text-stone-500">
                You haven&apos;t sent any collaboration requests yet. Browse the student directory or use the AI matcher!
              </div>
            )}
          </div>
        </div>

        {/* Section: My Projects */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-2xl font-bold text-[#0F3D2E]">
                My Active Projects ({myProjects.length})
              </h2>
              <p className="text-xs text-stone-500">
                Projects created by your account looking for teammates.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#0F3D2E] hover:bg-[#1A4B3A] text-white font-semibold text-xs px-4 py-2 rounded-full cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#A3C9AB]" />
              <span>New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D9C3A5]/40 text-[#8B6F47]">
                      {proj.type}
                    </span>
                    <span className="text-xs text-stone-400">{proj.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-lg text-[#0F3D2E]">{proj.title}</h4>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.requiredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="bg-[#F5F1E6] text-[#0F3D2E] text-[11px] font-medium px-2.5 py-0.5 rounded-md"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                  <span className="text-stone-500 font-medium">
                    Team: <strong>{proj.currentMembers}/{proj.maxMembers}</strong>
                  </span>
                  <Link
                    href={`/projects/${proj.id}`}
                    className="font-bold text-[#2E7058] hover:underline"
                  >
                    View Project Page →
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
