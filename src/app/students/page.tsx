'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import StudentCard from '@/components/StudentCard';
import { Search, Filter, Sparkles, Users, CheckCircle2 } from 'lucide-react';

export default function ExploreStudentsPage() {
  const { allStudents } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'available' | 'looking'>('all');

  const categories = [
    'All',
    'Development',
    'Design',
    'AI/ML',
    'Video',
    'Content'
  ];

  // Filter students based on query, category, and status
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      // Query filter: matches name, role, college, bio, or skills
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.primaryRole.toLowerCase().includes(q) ||
        student.college.toLowerCase().includes(q) ||
        student.bio.toLowerCase().includes(q) ||
        student.skills.some((sk) => sk.name.toLowerCase().includes(q)) ||
        student.proofs.some((p) => p.title.toLowerCase().includes(q));

      // Category filter: student must have at least one skill in this category
      const matchesCategory =
        selectedCategory === 'All' ||
        student.skills.some((sk) => sk.category.toLowerCase() === selectedCategory.toLowerCase());

      // Status filter
      const matchesStatus =
        selectedStatus === 'all' || student.status === selectedStatus;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [allStudents, searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="min-h-screen bg-[#F5F1E6] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#2E7058]/10 text-[#0F3D2E] border border-[#2E7058]/20 px-3.5 py-1 rounded-full text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-[#2E7058]" />
            <span>Campus Talent Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#0F3D2E] tracking-tight">
            Find Talented Students
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Discover peer collaborators on your campus based on real skills, verified portfolio proofs, and availability.
          </p>
        </div>

        {/* Search Bar & Filter Controls Card */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-sm space-y-5">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill (e.g. React, Figma, Python), role, project proof, or name..."
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

          {/* Filter Pills & Status Toggles */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-stone-100">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mr-1.5 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Field:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0F3D2E] text-white shadow-sm'
                      : 'bg-[#F5F1E6] text-stone-700 hover:bg-[#E8E2D5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Availability Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mr-1">
                Status:
              </span>
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  selectedStatus === 'all'
                    ? 'bg-[#2E7058] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedStatus('available')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  selectedStatus === 'available'
                    ? 'bg-[#10B981] text-white shadow-xs'
                    : 'bg-[#10B981]/15 text-[#065F46] hover:bg-[#10B981]/25'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                Available
              </button>
              <button
                onClick={() => setSelectedStatus('looking')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  selectedStatus === 'looking'
                    ? 'bg-[#F59E0B] text-white shadow-xs'
                    : 'bg-[#F59E0B]/15 text-[#92400E] hover:bg-[#F59E0B]/25'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                Looking
              </button>
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between text-xs text-stone-600 px-1">
          <div>
            Showing <strong className="text-[#0F3D2E]">{filteredStudents.length}</strong> student{filteredStudents.length === 1 ? '' : 's'} on campus
          </div>
          {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStatus('all');
              }}
              className="text-[#2E7058] hover:underline font-semibold cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Students Cards Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[#E8E2D5] rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F1E6] flex items-center justify-center text-stone-400 mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F3D2E]">No Students Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No students matched your search criteria. Try a different skill keyword or clear the category filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
