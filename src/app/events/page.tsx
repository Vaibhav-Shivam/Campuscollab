'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  Globe
} from 'lucide-react';

export default function CampusEventsPage() {
  const { events, toggleEventRegistration } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Hackathon', 'Workshop', 'Club Meetup', 'Competition'];

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.organizer.toLowerCase().includes(q) ||
        evt.skillsFocus.some((s) => s.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'All' || evt.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesQuery && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F5F1E6] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#2E7058]/10 text-[#0F3D2E] border border-[#2E7058]/20 px-3.5 py-1 rounded-full text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#2E7058]" />
            <span>Campus Gatherings & Opportunities</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#0F3D2E] tracking-tight">
            Upcoming Campus Events
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Discover hackathons, workshops, and project showcases where student teams form and build.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Event Type:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0F3D2E] text-white shadow-sm'
                    : 'bg-[#F5F1E6] text-stone-700 hover:bg-[#E8E2D5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Showing <strong className="text-[#0F3D2E]">{filteredEvents.length}</strong> event{filteredEvents.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white border border-[#E8E2D5] rounded-3xl overflow-hidden shadow-[0_8px_24px_rgba(15,61,46,0.06)] hover:shadow-[0_14px_36px_rgba(15,61,46,0.12)] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Event Image */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#0F3D2E]/90 text-white text-xs font-bold px-3 py-1 rounded-full border border-[#2E7058]">
                    {evt.category}
                  </div>
                  {evt.isOnline ? (
                    <div className="absolute top-3 right-3 bg-white/90 text-[#0F3D2E] text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                      <Globe className="w-3 h-3 text-[#2E7058]" />
                      Online
                    </div>
                  ) : null}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B6F47] mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{evt.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0F3D2E] leading-snug">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Skills Focus */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                      Relevant Skills
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {evt.skillsFocus.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] bg-[#F5F1E6] text-[#0F3D2E] px-2 py-0.5 rounded-md border border-[#E8E2D5]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#2E7058]" />
                    <strong className="text-[#0F3D2E]">{evt.attendeesCount}</strong> students registered
                  </span>
                  <span className="text-[11px] text-stone-400">By {evt.organizer}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEventRegistration(evt.id)}
                    className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      evt.isRegistered
                        ? 'bg-[#10B981]/15 text-[#065F46] border border-[#10B981]/30'
                        : 'bg-[#2E7058] hover:bg-[#245946] text-white shadow-sm hover:shadow'
                    }`}
                  >
                    {evt.isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <span>Register Interest</span>
                    )}
                  </button>

                  <Link
                    href={`/match`}
                    className="p-2.5 bg-[#D9C3A5] hover:bg-[#CBB08E] text-[#17231D] rounded-full transition-colors cursor-pointer"
                    title="Find teammates for this hackathon / event"
                  >
                    <Sparkles className="w-4 h-4 text-[#0F3D2E]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
