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
  Calendar,
  CheckCircle,
  ArrowUpRight
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
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-8 max-w-md text-center space-y-4 shadow-[5px_5px_0px_0px_#000]">
          <h2 className="text-xl font-black uppercase text-black">Project Not Found</h2>
          <p className="text-xs font-semibold text-stone-600">
            This project post could not be found or has concluded.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-black uppercase text-white bg-black px-5 py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#FAF8F5] py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-white px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFDE59] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        {/* Project Header Card */}
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_#000] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-black">
            {/* Creator Info */}
            <div className="flex items-center gap-3.5">
              <img
                src={project.ownerAvatar}
                alt={project.ownerName}
                className="w-12 h-12 rounded-xl object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000]"
              />
              <div>
                <div className="font-black text-base text-black uppercase">
                  {project.ownerName}
                </div>
                <div className="text-xs text-stone-600 font-bold">
                  {project.ownerCollege} · Posted {project.createdAt}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#FFDE59] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                {project.type}
              </span>
              <button
                onClick={handleLike}
                className={`px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  hasLiked
                    ? 'bg-[#FF6B6B] text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white hover:bg-stone-100 shadow-[2px_2px_0px_0px_#000]'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-black text-black' : ''}`} />
                <span>{likes} Likes</span>
              </button>
            </div>
          </div>

          {/* Project Title & Pitch */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              {project.title}
            </h1>
            <p className="text-sm sm:text-base font-bold text-stone-800 leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Description */}
          <div className="text-sm font-medium text-stone-800 leading-relaxed max-w-none pt-1">
            <p>{project.description}</p>
          </div>

          {/* Roles / Skills Needed */}
          <div className="pt-4 border-t-2 border-black">
            <div className="text-[10px] font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
              <span>★</span> Required Skills & Roles
            </div>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-[#FFDE59] text-black border-2 border-black text-xs font-black uppercase px-3 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Team Capacity Progress Bar */}
          <div className="bg-[#FAF8F5] rounded-xl p-5 border-2 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-black">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black uppercase text-black">
                  Team Slots: {project.currentMembers} of {project.maxMembers} Filled
                </div>
                <div className="text-[11px] font-bold text-stone-600">
                  {project.maxMembers - project.currentMembers} collaborator spot(s) remaining
                </div>
              </div>
            </div>

            {!isOwner && ownerStudent && (
              <button
                onClick={() => setShowCollabModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-[#FF70A6] hover:text-black text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <span>Send Collaboration Request</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Discussion / Comments Section (Neo-Brutalism speech cards) */}
        <div id="comments" className="bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_#000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-black" />
              <h2 className="text-xl font-black uppercase text-black tracking-tight">
                Discussion & Skill Offers
              </h2>
            </div>
            <span className="text-xs font-black bg-[#FFDE59] text-black px-3 py-1 rounded-full border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              {project.comments.length} Comments
            </span>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handlePostComment} className="bg-[#FAF8F5] border-2 border-black rounded-2xl p-5 space-y-4 shadow-[3px_3px_0px_0px_#000]">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-black"
              />
              <div className="text-xs font-black uppercase text-black">
                Commenting as <span className="underline">{currentUser.name}</span> ({currentUser.primaryRole})
              </div>
            </div>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              placeholder="e.g. I do React & UI/UX in Figma. I have built 3 similar projects and would love to collaborate!"
              className="w-full bg-white border-2 border-black rounded-xl p-3 text-xs sm:text-sm font-medium text-black focus:outline-none shadow-[2px_2px_0px_0px_#000] placeholder:text-stone-400"
              required
            />

            {/* Quick tag offering skills */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-black mb-2">
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
                      className={`text-xs px-3 py-1 rounded-lg border-2 border-black transition-all cursor-pointer font-bold ${
                        isSelected
                          ? 'bg-[#38E54D] text-black shadow-[2px_2px_0px_0px_#000]'
                          : 'bg-white text-black hover:bg-[#FFDE59] shadow-[1.5px_1.5px_0px_0px_#000]'
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
                className="inline-flex items-center gap-2 bg-black hover:bg-[#FFDE59] hover:text-black text-white font-black text-xs uppercase px-5 py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <span>Post Offer</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4 pt-2">
            {project.comments.length > 0 ? (
              project.comments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="p-5 rounded-xl bg-[#FAF8F5] border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={cmt.authorAvatar}
                        alt={cmt.authorName}
                        className="w-9 h-9 rounded-lg object-cover border border-black"
                      />
                      <div>
                        <div className="text-xs font-black uppercase text-black">
                          {cmt.authorName}
                        </div>
                        <div className="text-[11px] text-stone-600 font-bold">
                          {cmt.authorRole} · {cmt.createdAt}
                        </div>
                      </div>
                    </div>

                    {cmt.offeringSkills && cmt.offeringSkills.length > 0 && (
                      <div className="hidden sm:flex items-center gap-1.5">
                        {cmt.offeringSkills.map((sk) => (
                          <span
                            key={sk}
                            className="bg-[#38E54D] text-black border border-black text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#000]"
                          >
                            ✓ Offers {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed pl-12">
                    {cmt.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs font-bold text-stone-500">
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
