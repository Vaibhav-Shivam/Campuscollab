'use client';

import React, { useState } from 'react';
import { Student, Project } from '@/types';
import { useApp } from '@/context/AppContext';
import { X, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CollabRequestModalProps {
  targetStudent: Student;
  onClose: () => void;
  preselectedProjectId?: string;
}

export default function CollabRequestModal({
  targetStudent,
  onClose,
  preselectedProjectId
}: CollabRequestModalProps) {
  const { currentUser, projects, sendCollaborationRequest } = useApp();

  // Projects owned by current user
  const myProjects = projects.filter((p) => p.ownerId === currentUser.id);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    preselectedProjectId || (myProjects.length > 0 ? myProjects[0].id : '')
  );
  const [message, setMessage] = useState<string>(
    `Hi ${targetStudent.name}! We're working on ${
      myProjects.length > 0 ? myProjects[0].title : 'a new project'
    } and would love to collaborate with you given your skills in ${
      targetStudent.skills.slice(0, 2).map((s) => s.name).join(' and ')
    }. Would you be interested?`
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      alert('Please select a project to collaborate on.');
      return;
    }
    sendCollaborationRequest(targetStudent.id, selectedProjectId, message);
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#F5F1E6] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#D9C3A5] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-[#10B981]/20 text-[#10B981] rounded-full flex items-center justify-center mx-auto ring-8 ring-[#10B981]/10">
              <CheckCircle2 className="w-9 h-9 text-[#065F46]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0F3D2E]">Collaboration Request Sent!</h3>
            <p className="text-sm text-stone-600 max-w-sm mx-auto">
              We notified <strong className="text-[#0F3D2E]">{targetStudent.name}</strong>. Once they accept, you will both receive access to direct campus communication.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#8B6F47]">
                Connect & Collaborate
              </div>
              <h3 className="text-2xl font-bold text-[#0F3D2E] mt-0.5">
                Send Collaboration Request
              </h3>
            </div>

            {/* Recipient Card */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-[#E8E2D5] shadow-sm">
              <img
                src={targetStudent.avatar}
                alt={targetStudent.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-stone-200"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#0F3D2E] text-sm">{targetStudent.name}</div>
                <div className="text-xs text-stone-600">{targetStudent.primaryRole}</div>
                <div className="text-[11px] text-stone-400">{targetStudent.college}</div>
              </div>
            </div>

            {/* Select Project */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Select Your Project
              </label>
              {myProjects.length > 0 ? (
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-white border border-[#D9C3A5] rounded-xl px-4 py-2.5 text-sm text-[#0F3D2E] font-medium focus:outline-none focus:ring-2 focus:ring-[#2E7058]"
                  required
                >
                  {myProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.type})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-[#D9C3A5] text-xs text-stone-600">
                  You don’t have an active project post yet. Defaulting to general campus collaboration.
                </div>
              )}
            </div>

            {/* Personalized Message */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Collaboration Note
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-white border border-[#D9C3A5] rounded-xl p-3.5 text-sm text-[#17231D] focus:outline-none focus:ring-2 focus:ring-[#2E7058] placeholder:text-stone-400"
                placeholder="Explain what role you need help with and why you want to collaborate..."
                required
              />
            </div>

            {/* Privacy notice */}
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-[#E8E2D5]/50 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#2E7058] shrink-0" />
              <span>
                Personal contact info is protected. Once {targetStudent.name} accepts, campus contact details will be shared.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-xs font-semibold text-stone-700 bg-stone-200/80 hover:bg-stone-300 rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 text-xs font-semibold text-white bg-[#2E7058] hover:bg-[#245946] rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#A3C9AB]" />
                <span>Send Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
