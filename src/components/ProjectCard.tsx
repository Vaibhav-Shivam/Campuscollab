'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import { Users, MessageSquare, Heart, ArrowRight, Sparkles, Tag } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [likes, setLikes] = useState(project.likesCount);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-[0_8px_24px_rgba(15,61,46,0.06)] hover:shadow-[0_14px_36px_rgba(15,61,46,0.12)] transition-all duration-250 flex flex-col justify-between hover:-translate-y-1 group">
      <div>
        {/* Top Meta: Owner info + Type tag */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={project.ownerAvatar}
              alt={project.ownerName}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-stone-200"
            />
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#0F3D2E] truncate">
                {project.ownerName}
              </div>
              <div className="text-[11px] text-stone-500 truncate">
                {project.ownerCollege} · {project.createdAt}
              </div>
            </div>
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#D9C3A5]/40 text-[#8B6F47] border border-[#D9C3A5]">
            {project.type}
          </span>
        </div>

        {/* Project Title & Tagline */}
        <Link href={`/projects/${project.id}`} className="block group-hover:text-[#2E7058] transition-colors cursor-pointer">
          <h3 className="text-xl font-bold text-[#0F3D2E] leading-snug mb-1.5 line-clamp-1">
            {project.title}
          </h3>
          <p className="text-xs font-medium text-[#8B6F47] mb-2 line-clamp-1">
            {project.tagline}
          </p>
          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
            {project.description}
          </p>
        </Link>

        {/* Looking For Skill Tags */}
        <div className="mb-4">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#2E7058]" />
            Looking For Roles / Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#2E7058]/10 text-[#0F3D2E] border border-[#2E7058]/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Team Capacity Progress Bar */}
        <div className="mb-4 p-3 rounded-2xl bg-[#F5F1E6] border border-[#E8E2D5]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-stone-600 font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#2E7058]" />
              Team Formation
            </span>
            <span className="font-bold text-[#0F3D2E]">
              {project.currentMembers} / {project.maxMembers} Members
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2E7058]"
              style={{
                width: `${(project.currentMembers / project.maxMembers) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer: Likes, Comments count, View Details action */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
        <div className="flex items-center gap-4 text-stone-500">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 font-medium transition-colors cursor-pointer ${
              hasLiked ? 'text-[#DC2626]' : 'hover:text-[#DC2626]'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                hasLiked ? 'fill-[#DC2626] text-[#DC2626]' : ''
              }`}
            />
            <span>{likes}</span>
          </button>

          <Link
            href={`/projects/${project.id}#comments`}
            className="flex items-center gap-1 font-medium hover:text-[#0F3D2E] transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-stone-400" />
            <span>{project.comments.length}</span>
          </Link>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1 font-bold text-[#2E7058] hover:text-[#0F3D2E] transition-colors group-hover:translate-x-0.5 transform duration-150 cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
