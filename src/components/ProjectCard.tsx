'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import { Users, Tag, Heart, MessageSquare, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

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

  const typeColors: Record<string, string> = {
    Hackathon: 'bg-[#FFDE59]',
    Startup: 'bg-[#FF70A6]',
    Academic: 'bg-[#4FD1C5]',
    Personal: 'bg-[#9B87F5]',
    'Open Source': 'bg-[#38E54D]'
  };

  const badgeColor = typeColors[project.type] || 'bg-[#FFDE59]';

  return (
    <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#000] transition-all duration-150 flex flex-col justify-between group">
      <div>
        {/* Top Meta: Owner info + Category tag */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={project.ownerAvatar}
              alt={project.ownerName}
              className="w-10 h-10 rounded-xl object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000]"
            />
            <div className="min-w-0">
              <div className="text-sm font-black text-black truncate uppercase">
                {project.ownerName}
              </div>
              <div className="text-[11px] text-stone-600 truncate font-medium">
                {project.ownerCollege} · {formatTimeAgo(project.createdAt)}
              </div>
            </div>
          </div>

          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${badgeColor} text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]`}>
            {project.type}
          </span>
        </div>

        {/* Project Title & Tagline */}
        <Link href={`/projects/${project.id}`} className="block group-hover:text-[#FF70A6] transition-colors cursor-pointer">
          <h3 className="text-xl font-black text-black leading-snug mb-1.5 line-clamp-1 uppercase tracking-tight">
            {project.title}
          </h3>
          <p className="text-xs font-bold text-stone-700 mb-2 line-clamp-1">
            {project.tagline}
          </p>
          <p className="text-xs text-stone-700 font-medium line-clamp-3 leading-relaxed mb-4">
            {project.description}
          </p>
        </Link>

        {/* Looking For Skill Tags */}
        <div className="mb-4">
          <div className="text-[10px] font-black text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>★</span> Looking For Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-black border border-black shadow-[1.5px_1.5px_0px_0px_#000]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Team Capacity Progress Bar */}
        <div className="mb-4 p-3 rounded-xl bg-[#FAF8F5] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <div className="flex items-center justify-between text-xs mb-1.5 font-black uppercase">
            <span className="text-black flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-black" />
              Team Roster
            </span>
            <span className="bg-black text-[#FFDE59] px-2 py-0.5 rounded text-[10px]">
              {project.currentMembers} / {project.maxMembers} Members
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-white border-2 border-black overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-[#38E54D] border-r border-black"
              style={{
                width: `${(project.currentMembers / project.maxMembers) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer: Likes, Comments, View Details Button */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-black text-xs">
        <div className="flex items-center gap-3 text-black">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 font-black px-2.5 py-1 rounded-lg border-2 border-black transition-all cursor-pointer ${
              hasLiked
                ? 'bg-[#FF6B6B] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white hover:bg-stone-100 shadow-[2px_2px_0px_0px_#000]'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                hasLiked ? 'fill-black text-black' : 'text-black'
              }`}
            />
            <span>{likes}</span>
          </button>

          <Link
            href={`/projects/${project.id}#comments`}
            className="flex items-center gap-1 font-black px-2.5 py-1 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFDE59] transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-black" />
            <span>{project.comments.length}</span>
          </Link>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1 font-black uppercase text-xs px-3.5 py-1.5 rounded-xl bg-[#FFDE59] hover:bg-[#FF70A6] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
