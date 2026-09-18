'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import CollabRequestModal from '@/components/CollabRequestModal';
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Sparkles,
  Send,
  Heart,
  Share2,
  Calendar,
  CheckCircle,
  Tag
} from 'lucide-react';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, allStudents, currentUser, addCommentToProject } = useApp();

  const projectId = params?.id as string;
  const project = projects.find((p) => p.id === projectId);

  const [commentText, setCommentText] = useState('');
  const [selectedOfferSkills, setSelectedOfferSkills] = useState<string[]>([]);
  const [likes, setLikes] = useState(project ? project.likesCount : 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F5F1E6] flex items-center justify-center p-4">
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-8 max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold text-[#0F3D2E]">Project Not Found</h2>
          <p className="text-xs text-stone-500">
            This project post could not be found or has concluded.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-[#0F3D2E] px-5 py-2.5 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>
      </div>
    );
  }

  // Find owner student profile if on platform
  const ownerStudent = allStudents.find((s) => s.id === project.ownerId);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleToggleOfferSkill = (skill: string) => {
    if (selectedOfferSkills.includes(skill)) {
      setSelectedOfferSkills(selectedOfferSkills.filter((s) => s !== skill));
    } else {
      setSelectedOfferSkills([...selectedOfferSkills, skill]);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addCommentToProject(project.id, commentText.trim(), selectedOfferSkills);
    setCommentText('');
    setSelectedOfferSkills([]);
  };

  const isOwner = project.ownerId === currentUser.id;

  return (
    <div className="min-h-screen bg-[#F5F1E6] py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#0F3D2E] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        {/* Project Header Card */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            {/* Creator Info */}
            <div className="flex items-center gap-3.5">
              <img
                src={project.ownerAvatar}
                alt={project.ownerName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-stone-200"
              />
              <div>
                <div className="font-bold text-base text-[#0F3D2E]">
                  {project.ownerName}
                </div>
                <div className="text-xs text-stone-500">
                  {project.ownerCollege} · Posted {project.createdAt}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#D9C3A5]/40 text-[#8B6F47] border border-[#D9C3A5]">
                {project.type}
              </span>
              <button
                onClick={handleLike}
                className={`p-2.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                  hasLiked
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-600' : ''}`} />
                <span>{likes}</span>
              </button>
            </div>
          </div>

          {/* Project Title & Pitch */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-bold text-[#0F3D2E] tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm sm:text-base text-[#8B6F47] font-medium leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Description */}
          <div className="prose prose-stone text-sm text-stone-700 leading-relaxed max-w-none pt-2">
            <p>{project.description}</p>
          </div>

          {/* Roles / Skills Needed */}
          <div className="pt-4 border-t border-stone-100">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8B6F47] mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2E7058]" />
              Required Skills & Roles
            </div>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-[#2E7058]/10 text-[#0F3D2E] border border-[#2E7058]/20 text-xs font-bold px-3.5 py-1.5 rounded-xl"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Team Capacity Progress Bar */}
          <div className="bg-[#F5F1E6] rounded-2xl p-5 border border-[#E8E2D5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#2E7058] shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0F3D2E]">
                  Team Slots: {project.currentMembers} of {project.maxMembers} Filled
                </div>
                <div className="text-[11px] text-stone-500">
                  {project.maxMembers - project.currentMembers} collaborator spot(s) remaining
                </div>
              </div>
            </div>

            {!isOwner && ownerStudent && (
              <button
                onClick={() => setShowCollabModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2E7058] hover:bg-[#245946] text-white font-semibold text-xs px-6 py-3 rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#A3C9AB]" />
                <span>Send Collaboration Request</span>
              </button>
            )}
          </div>
        </div>

        {/* Discussion / Comments Section (Feature 6 from UI/UX Spec) */}
        <div id="comments" className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#2E7058]" />
              <h2 className="text-xl font-bold text-[#0F3D2E]">
                Project Discussion & Offers
              </h2>
            </div>
            <span className="text-xs font-semibold text-stone-500 bg-[#F5F1E6] px-3 py-1 rounded-full">
              {project.comments.length} comment{project.comments.length === 1 ? '' : 's'}
            </span>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed -mt-2">
            Interested in contributing? Leave a comment offering your skills or ask questions directly to the project lead.
          </p>

          {/* Add Comment Form */}
          <form onSubmit={handlePostComment} className="bg-[#FAF7F0] border border-[#D9C3A5] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#A3C9AB]"
              />
              <div className="text-xs font-semibold text-[#0F3D2E]">
                Commenting as <span className="underline">{currentUser.name}</span> ({currentUser.primaryRole})
              </div>
            </div>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              placeholder="e.g. I know React and UI/UX in Figma. I have built 3 similar projects and would love to help!"
              className="w-full bg-white border border-[#D9C3A5] rounded-xl p-3.5 text-xs sm:text-sm text-[#17231D] focus:outline-none focus:ring-2 focus:ring-[#2E7058] placeholder:text-stone-400"
              required
            />

            {/* Quick tag offering skills */}
            <div>
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                Tag skills you can contribute:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.requiredSkills.map((sk) => {
                  const isSelected = selectedOfferSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => handleToggleOfferSkill(sk)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2E7058] text-white border-[#2E7058] font-bold'
                          : 'bg-white text-stone-700 border-[#D9C3A5] hover:bg-[#F5F1E6]'
                      }`}
                    >
                      {isSelected ? `✓ Offering ${sk}` : `+ Offer ${sk}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#0F3D2E] hover:bg-[#1A4B3A] text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <span>Post Comment</span>
                <Send className="w-3 h-3 text-[#A3C9AB]" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4 pt-2">
            {project.comments.length > 0 ? (
              project.comments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#F5F1E6]/60 border border-[#E8E2D5] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={cmt.authorAvatar}
                        alt={cmt.authorName}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-stone-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#0F3D2E]">
                          {cmt.authorName}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {cmt.authorRole} · {cmt.createdAt}
                        </div>
                      </div>
                    </div>

                    {cmt.offeringSkills && cmt.offeringSkills.length > 0 && (
                      <div className="hidden sm:flex items-center gap-1.5">
                        {cmt.offeringSkills.map((sk) => (
                          <span
                            key={sk}
                            className="bg-[#10B981]/15 text-[#065F46] border border-[#10B981]/30 text-[10px] font-bold px-2 py-0.5 rounded-md"
                          >
                            ✓ Offers {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pl-12">
                    {cmt.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-stone-400">
                No comments yet. Be the first to express interest or ask a question!
              </div>
            )}
          </div>
        </div>
      </div>

      {showCollabModal && ownerStudent && (
        <CollabRequestModal
          targetStudent={ownerStudent}
          preselectedProjectId={project.id}
          onClose={() => setShowCollabModal(false)}
        />
      )}
    </div>
  );
}
