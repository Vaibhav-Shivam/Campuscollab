'use client';

import React, { useState } from 'react';
import { Student } from '@/types';
import { useApp } from '@/context/AppContext';
import { X, Send, ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';

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

  const myProjects = projects.filter((p) => p.ownerId === currentUser.id);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    preselectedProjectId || (myProjects.length > 0 ? myProjects[0].id : '')
  );
  const [message, setMessage] = useState<string>(
    `Hi ${targetStudent.name}! We're building ${
      myProjects.length > 0 ? myProjects[0].title : 'our campus project'
    } and would love to team up given your skills in ${
      targetStudent.skills.slice(0, 2).map((s) => s.name).join(' & ')
    }. Would you like to collaborate?`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl max-w-lg w-full border-[3px] border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden relative my-8">
        {/* Top Header Block */}
        <div className="bg-[#FFDE59] border-b-2 border-black p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-black">
              ★ COLLABORATION INVITATION
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-black mt-0.5">
              Send Collaboration Request
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-black hover:bg-[#FF6B6B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-7">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-[#4FD1C5] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
                ✓
              </div>
              <h3 className="text-2xl font-black uppercase text-black">Request Dispatched!</h3>
              <p className="text-xs font-semibold text-stone-700 max-w-sm mx-auto leading-relaxed">
                We notified <strong>{targetStudent.name}</strong>. Once they accept your invitation, campus communication details will unlock.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipient Card */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FAF8F5] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                <img
                  src={targetStudent.avatar}
                  alt={targetStudent.name}
                  className="w-12 h-12 rounded-lg object-cover border-2 border-black"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-black text-black text-sm uppercase">{targetStudent.name}</div>
                  <div className="text-xs font-bold text-stone-700">{targetStudent.primaryRole}</div>
                  <div className="text-[11px] text-stone-500 font-medium">{targetStudent.college}</div>
                </div>
              </div>

              {/* Select Project */}
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
                  Select Project Post *
                </label>
                {myProjects.length > 0 ? (
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                    required
                  >
                    {myProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.type})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border-2 border-black text-xs font-medium text-stone-700">
                    No active project created yet. Defaulting to general collaboration invitation.
                  </div>
                )}
              </div>

              {/* Personalized Message */}
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
                  Collaboration Note *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-white border-2 border-black rounded-xl p-3.5 text-xs font-medium text-black focus:outline-none shadow-[2px_2px_0px_0px_#000] placeholder:text-stone-400"
                  required
                />
              </div>

              {/* Privacy Notice */}
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 bg-[#FAF8F5] p-2.5 rounded-xl border border-black">
                <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                <span>
                  Privacy-first: contact information is only shared after mutual acceptance.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-xs font-black uppercase text-black bg-white hover:bg-stone-100 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-black uppercase text-white bg-black hover:bg-[#FF70A6] hover:text-black rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Send Request</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
