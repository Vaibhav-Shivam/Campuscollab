'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import StudentCard from '@/components/StudentCard';
import { Search, Filter, Sparkles, Users, RotateCw } from 'lucide-react';
import { matchesStudentCategory } from '@/lib/categorize';

export default function ExploreStudentsPage() {
  const { allStudents, refreshStudents } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'available' | 'looking'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync latest profiles from cloud on mount
  useEffect(() => {
    refreshStudents();
  }, [refreshStudents]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await refreshStudents();
    setTimeout(() => setIsSyncing(false), 600);
  };

  const categories = [
    'All',
    'Development',
    'Design',
    'AI/ML',
    'Video',
    'Content'
  ];

  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const q = searchQuery.toLowerCase().trim();

      // Safe normalization of skills and proofs
      const safeSkills = (student.skills || []).map((sk) =>
        typeof sk === 'string' ? sk : sk?.name || ''
      );
      const safeProofs = Array.isArray(student.proofs) ? student.proofs : [];
      const safeInterests = Array.isArray(student.interests) ? student.interests : [];

      const matchesQuery =
        !q ||
        (student.name || '').toLowerCase().includes(q) ||
        (student.primaryRole || '').toLowerCase().includes(q) ||
        (student.college || '').toLowerCase().includes(q) ||
        (student.major || '').toLowerCase().includes(q) ||
        (student.bio || '').toLowerCase().includes(q) ||
        (student.lookingForRole || '').toLowerCase().includes(q) ||
        safeSkills.some((skName) => skName.toLowerCase().includes(q)) ||
        safeProofs.some((p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.role || '').toLowerCase().includes(q) ||
          (p.technologies || []).some((t) => t.toLowerCase().includes(q))
        ) ||
        safeInterests.some((i) => i.toLowerCase().includes(q));

      const matchesCategory = matchesStudentCategory(student, selectedCategory);

      const matchesStatus =
        selectedStatus === 'all' ||
        (student.status || 'available').toLowerCase() === selectedStatus.toLowerCase();

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [allStudents, searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#FFDE59] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <span>★</span>
            <span>CAMPUS TALENT NETWORK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight">
            Find Talented Students
          </h1>
          <p className="text-sm font-semibold text-stone-700 leading-relaxed">
            Discover peer collaborators on your campus based on real skills, verified portfolio proofs, and availability.
          </p>
        </div>

        {/* Neo-Brutalist Search & Filter Controls */}
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] space-y-5">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-black absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill (e.g. React, Figma, Python), role, project proof, or name..."
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

          {/* Filter Pills & Status Toggles */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t-2 border-black">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-black mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Field:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFDE59]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Availability Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-black mr-1">
                Status:
              </span>
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border-2 border-black ${
                  selectedStatus === 'all'
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-black hover:bg-stone-100 shadow-[2px_2px_0px_0px_#000]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedStatus('available')}
                className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border-2 border-black ${
                  selectedStatus === 'available'
                    ? 'bg-[#4FD1C5] text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-black hover:bg-[#4FD1C5]/30 shadow-[2px_2px_0px_0px_#000]'
                }`}
              >
                🟢 Available
              </button>
              <button
                onClick={() => setSelectedStatus('looking')}
                className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border-2 border-black ${
                  selectedStatus === 'looking'
                    ? 'bg-[#FF6B6B] text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-black hover:bg-[#FF6B6B]/30 shadow-[2px_2px_0px_0px_#000]'
                }`}
              >
                🟠 Looking
              </button>
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex flex-wrap items-center justify-between text-xs font-black text-black px-1 uppercase gap-3">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong>{filteredStudents.length}</strong> student{filteredStudents.length === 1 ? '' : 's'} on campus
            </span>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase bg-white hover:bg-[#FFDE59] px-2.5 py-1 rounded-lg border border-black shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              title="Sync latest students from database"
            >
              <RotateCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>
          {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStatus('all');
              }}
              className="underline text-black font-black cursor-pointer"
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
          <div className="text-center py-16 bg-white border-[2.5px] border-black rounded-2xl p-8 shadow-[5px_5px_0px_0px_#000] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFDE59] border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-black text-xl mx-auto">
              ?
            </div>
            <h3 className="text-lg font-black uppercase text-black">No Students Found</h3>
            <p className="text-xs font-medium text-stone-600 max-w-sm mx-auto">
              No students matched your search criteria. Try a different skill keyword or reset the category filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
