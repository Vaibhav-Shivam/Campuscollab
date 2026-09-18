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
  ArrowUpRight,
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
    <div className="min-h-screen bg-[#FAF8F5] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#4FD1C5] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <span>★</span>
            <span>CAMPUS OPPORTUNITIES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight">
            Campus Hackathons & Events
          </h1>
          <p className="text-sm font-semibold text-stone-700 leading-relaxed">
            Discover hackathons, workshops, and project showcases where student teams form and build together.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-black mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Event Type:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-black hover:bg-[#FFDE59] shadow-[2px_2px_0px_0px_#000]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs font-black uppercase text-black">
            Showing <strong>{filteredEvents.length}</strong> event{filteredEvents.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white border-[2.5px] border-black rounded-2xl overflow-hidden shadow-[5px_5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#000] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Event Image */}
                <div className="relative h-48 w-full overflow-hidden border-b-2 border-black bg-stone-100">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-3 left-3 bg-[#FFDE59] text-black text-[10px] font-black uppercase px-3 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    {evt.category}
                  </div>
                  {evt.isOnline ? (
                    <div className="absolute top-3 right-3 bg-white text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Online
                    </div>
                  ) : null}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{evt.date}</span>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-black leading-snug">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-semibold text-stone-600 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 font-medium line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Skills Focus */}
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
                      Target Stack:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {evt.skillsFocus.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] font-bold bg-[#FAF8F5] text-black px-2 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_0px_#000]"
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
                <div className="flex items-center justify-between text-xs font-bold text-black border-t-2 border-black pt-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <strong>{evt.attendeesCount}</strong> students registered
                  </span>
                  <span className="text-[10px] font-black uppercase text-stone-500">{evt.organizer}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEventRegistration(evt.id)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 border-2 border-black ${
                      evt.isRegistered
                        ? 'bg-[#38E54D] text-black shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-[#FFDE59] hover:bg-[#FF70A6] text-black shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                    }`}
                  >
                    {evt.isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                        <span>Registered ✓</span>
                      </>
                    ) : (
                      <span>Register RSVP</span>
                    )}
                  </button>

                  <Link
                    href={`/match`}
                    className="p-2.5 bg-black hover:bg-[#FFDE59] text-white hover:text-black rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] transition-colors cursor-pointer"
                    title="Find teammates for this hackathon / event"
                  >
                    <Sparkles className="w-4 h-4" />
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
