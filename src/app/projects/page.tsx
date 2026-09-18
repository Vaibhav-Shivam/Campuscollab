'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import ProjectCard from '@/components/ProjectCard';
import CreateProjectModal from '@/components/CreateProjectModal';
import { Search, PlusCircle, Filter, Sparkles, FolderKanban } from 'lucide-react';
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

  // Filter projects
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
    <div className="min-h-screen bg-[#F5F1E6] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#2E7058]/10 text-[#0F3D2E] border border-[#2E7058]/20 px-3.5 py-1 rounded-full text-xs font-bold">
              <FolderKanban className="w-3.5 h-3.5 text-[#2E7058]" />
              <span>Community Project Feed</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#0F3D2E] tracking-tight">
              Project Requirements
            </h1>
            <p className="text-sm text-stone-600 max-w-xl leading-relaxed">
              Explore open project posts from fellow campus builders seeking specific skills, or post your own idea.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#0F3D2E] hover:bg-[#1A4B3A] text-white font-semibold text-sm px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-[#A3C9AB]" />
            <span>Post a New Project</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-sm space-y-5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, description, required skill, or creator..."
              className="w-full bg-[#F5F1E6]/60 border border-[#D9C3A5] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-[#17231D] focus:outline-none focus:ring-2 focus:ring-[#2E7058] placeholder:text-stone-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-700 bg-stone-200/60 px-2 py-0.5 rounded-full cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Project Type Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-stone-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mr-1.5 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {projectTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-[#0F3D2E] text-white shadow-sm'
                      : 'bg-[#F5F1E6] text-stone-700 hover:bg-[#E8E2D5]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Required Skill Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mr-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#2E7058]" /> Skill Needed:
              </span>
              {popularSkills.map((sk) => (
                <button
                  key={sk}
                  onClick={() => setSelectedSkill(sk)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedSkill === sk
                      ? 'bg-[#2E7058] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {sk}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between text-xs text-stone-600 px-1">
          <div>
            Showing <strong className="text-[#0F3D2E]">{filteredProjects.length}</strong> project{filteredProjects.length === 1 ? '' : 's'} seeking collaborators
          </div>
          {(searchQuery || selectedType !== 'All' || selectedSkill !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSelectedSkill('All');
              }}
              className="text-[#2E7058] hover:underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[#E8E2D5] rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F1E6] flex items-center justify-center text-stone-400 mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F3D2E]">No Projects Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No open project posts matched your search filters. Try clearing your filters or create a new project post!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-[#0F3D2E] px-5 py-2.5 rounded-full cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#A3C9AB]" />
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
        <div className="min-h-screen bg-[#F5F1E6] flex items-center justify-center text-sm font-medium text-[#0F3D2E]">
          Loading campus projects...
        </div>
      }
    >
      <ProjectsFeedContent />
    </React.Suspense>
  );
}
