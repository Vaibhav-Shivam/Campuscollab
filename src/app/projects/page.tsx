'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import ProjectCard from '@/components/ProjectCard';
import CreateProjectModal from '@/components/CreateProjectModal';
import { Search, PlusCircle, Filter, Sparkles, FolderKanban, ArrowUpRight } from 'lucide-react';
import { ProjectType } from '@/types';

function ProjectsFeedContent() {
  const { projects } = useApp();
  const searchParams = useSearchParams();
  const shouldOpenNew = searchParams?.get('new') === 'true';

  const [showCreateModal, setShowCreateModal] = useState(shouldOpenNew);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');

  const projectTypes = ['All', 'Hackathon', 'Startup', 'Academic', 'Personal'];
  const popularSkills = ['All', 'React', 'UI/UX', 'Python', 'Figma', 'Next.js', 'AI/ML'];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.ownerName.toLowerCase().includes(q) ||
        project.requiredSkills.some((s) => s.toLowerCase().includes(q));

      const matchesType =
        selectedType === 'All' ||
        project.type.toLowerCase() === selectedType.toLowerCase();

      const matchesSkill =
        selectedSkill === 'All' ||
        project.requiredSkills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());

      return matchesQuery && matchesType && matchesSkill;
    });
  }, [projects, searchQuery, selectedType, selectedSkill]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#FFDE59] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <span>★</span>
              <span>COMMUNITY PROJECT BOARD</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight">
              Project Requirements
            </h1>
            <p className="text-sm font-semibold text-stone-700 max-w-xl leading-relaxed">
              Explore open project posts from fellow campus builders looking for teammates, or post your own concept.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#FF70A6] hover:bg-black hover:text-white text-black font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a New Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter & Search Controls */}
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] space-y-5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-black absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, description, required skill, or creator..."
              className="w-full bg-[#FAF8F5] border-2 border-black rounded-xl pl-12 pr-4 py-3 text-xs sm:text-sm text-black font-bold focus:outline-none shadow-[3px_3px_0px_0px_#000] placeholder:text-stone-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-black bg-[#FF6B6B] border border-black px-2 py-0.5 rounded-md cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Project Type Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t-2 border-black">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-black mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {projectTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
                    selectedType === type
                      ? 'bg-black text-white shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFDE59]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Required Skill Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-black mr-1 flex items-center gap-1">
                <span>★</span> Skill:
              </span>
              {popularSkills.map((sk) => (
                <button
                  key={sk}
                  onClick={() => setSelectedSkill(sk)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer border-2 border-black ${
                    selectedSkill === sk
                      ? 'bg-[#FFDE59] text-black shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-black hover:bg-stone-100 shadow-[1.5px_1.5px_0px_0px_#000]'
                  }`}
                >
                  {sk}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs font-black text-black px-1 uppercase">
          <div>
            Showing <strong>{filteredProjects.length}</strong> project{filteredProjects.length === 1 ? '' : 's'} seeking teammates
          </div>
          {(searchQuery || selectedType !== 'All' || selectedSkill !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSelectedSkill('All');
              }}
              className="underline text-black font-black cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border-[2.5px] border-black rounded-2xl p-8 shadow-[5px_5px_0px_0px_#000] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFDE59] border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-black text-xl mx-auto">
              ★
            </div>
            <h3 className="text-lg font-black uppercase text-black">No Projects Found</h3>
            <p className="text-xs font-medium text-stone-600 max-w-sm mx-auto">
              No open project posts matched your search filters. Be the first to post a new project!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 text-xs font-black uppercase text-black bg-[#FFDE59] px-5 py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Your Project</span>
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

export default function ProjectsFeedPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-sm font-black uppercase text-black">
          Loading campus projects...
        </div>
      }
    >
      <ProjectsFeedContent />
    </React.Suspense>
  );
}
