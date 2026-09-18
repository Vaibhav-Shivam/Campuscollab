'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import HeroBotanical from '@/components/HeroBotanical';
import FeatureStrip from '@/components/FeatureStrip';
import StudentCard from '@/components/StudentCard';
import ProjectCard from '@/components/ProjectCard';
import CreateProjectModal from '@/components/CreateProjectModal';
import { ArrowRight, Sparkles, Users, Briefcase, Calendar, ShieldCheck, ChevronRight, ArrowUpRight } from 'lucide-react';

export default function HomePage() {
  const { allStudents, projects, events } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const availableTalent = allStudents.filter((s) => s.status === 'available').slice(0, 3);
  const featuredProjects = projects.slice(0, 3);
  const upcomingEvents = events.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* 1. Neo-Brutalist High Impact Hero */}
      <HeroBotanical />

      {/* 2. 4-Color Bento Feature Strip */}
      <FeatureStrip />

      {/* 3. The 5-Step Campus Loop (Neo-Brutalist Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#FFDE59] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            ★ HOW IT WORKS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight">
            The Campus Collaboration Loop
          </h2>
          <p className="text-sm font-semibold text-stone-700 leading-relaxed">
            Every partnership is grounded in real project requirements and verifiable code/design proofs.
          </p>
        </div>

        {/* 5-step Flow Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Project Idea',
              desc: 'Post requirements and target roles',
              color: 'bg-white',
              badge: 'bg-[#FFDE59]'
            },
            {
              step: '02',
              title: 'Skill Tags',
              desc: 'Select precise tech stack & design skills',
              color: 'bg-white',
              badge: 'bg-[#FF70A6]'
            },
            {
              step: '03',
              title: 'Smart Match',
              desc: 'AI scores & ranks campus peers',
              color: 'bg-white',
              badge: 'bg-[#4FD1C5]'
            },
            {
              step: '04',
              title: 'Real Proof',
              desc: 'Inspect GitHub repos & Figma prototypes',
              color: 'bg-white',
              badge: 'bg-[#9B87F5]'
            },
            {
              step: '05',
              title: 'Build Team',
              desc: 'Send private request & ship together',
              color: 'bg-white',
              badge: 'bg-[#38E54D]'
            }
          ].map((item) => (
            <div
              key={item.step}
              className={`${item.color} border-[2.5px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between hover:-translate-y-1 transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-8 h-8 rounded-lg ${item.badge} border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-center font-black text-xs text-black`}>
                    {item.step}
                  </span>
                  <span className="font-black text-xs text-black">★</span>
                </div>
                <h3 className="font-black text-base uppercase text-black mb-1">{item.title}</h3>
                <p className="text-xs font-semibold text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Two-Way Network Status Showcase */}
      <section className="bg-white border-y-[2.5px] border-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Card: Looking for Teammates */}
            <div className="bg-[#FF6B6B] border-[2.5px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_#000] space-y-4">
              <div className="inline-flex items-center gap-2 bg-black text-white px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#FFF]">
                <span>🟠</span>
                <span>I Am Looking for Teammates</span>
              </div>
              <h3 className="text-3xl font-black uppercase text-black tracking-tight leading-tight">
                Have a project idea but missing key skills?
              </h3>
              <p className="text-xs font-bold text-stone-900 leading-relaxed">
                Post your project scope and find designers, backend engineers, and video creators right on your campus.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white hover:bg-black hover:text-white text-black font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Post Your Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Card: Available for Projects */}
            <div className="bg-[#4FD1C5] border-[2.5px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_#000] space-y-4">
              <div className="inline-flex items-center gap-2 bg-black text-white px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#FFF]">
                <span>🟢</span>
                <span>I Am Available for Projects</span>
              </div>
              <h3 className="text-3xl font-black uppercase text-black tracking-tight leading-tight">
                Have skills but looking for a team?
              </h3>
              <p className="text-xs font-bold text-stone-900 leading-relaxed">
                Mark your profile as Available, showcase your GitHub or Figma proofs, and get invited to exciting projects.
              </p>
              <Link
                href="/dashboard"
                className="bg-white hover:bg-black hover:text-white text-black font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Update My Status</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Student Talent */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-stone-500 mb-1">
              ★ CAMPUS TALENT DIRECTORY
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tight">
              Students Ready to Build
            </h2>
          </div>
          <Link
            href="/students"
            className="text-xs font-black uppercase text-black bg-[#FFDE59] px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FF70A6] transition-all cursor-pointer inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All Students ({allStudents.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableTalent.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </section>

      {/* 6. Active Project Requirements */}
      <section className="bg-white border-t-[2.5px] border-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-stone-500 mb-1">
                ★ OPEN ROLES
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tight">
                Projects Seeking Teammates
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-xs font-black uppercase text-black bg-[#FFDE59] px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FF70A6] transition-all cursor-pointer inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>All Projects ({projects.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Upcoming Campus Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-stone-500 mb-1">
              ★ CAMPUS CALENDAR
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tight">
              Upcoming Hackathons & Meetups
            </h2>
          </div>
          <Link
            href="/events"
            className="text-xs font-black uppercase text-black bg-[#4FD1C5] px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#38E54D] transition-all cursor-pointer inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All Events</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white border-[2.5px] border-black rounded-2xl overflow-hidden shadow-[5px_5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#000] transition-all flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 relative h-48 sm:h-auto border-b-2 sm:border-b-0 sm:border-r-2 border-black">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#FFDE59] text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                  {evt.category}
                </span>
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-black font-black uppercase mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {evt.date}
                  </div>
                  <h3 className="font-black text-lg text-black uppercase leading-snug mb-2">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-stone-700 font-medium line-clamp-2 leading-relaxed mb-4">
                    {evt.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t-2 border-black">
                  <span className="text-xs font-bold text-black">
                    <strong>{evt.attendeesCount}</strong> students registered
                  </span>
                  <Link
                    href="/events"
                    className="text-xs font-black uppercase text-black bg-[#FFDE59] px-3 py-1 rounded-lg border border-black shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-[#FF70A6] transition-colors"
                  >
                    Details ↗
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Bottom High-Impact CTA Strip */}
      <section className="bg-[#FFDE59] border-t-[2.5px] border-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-white border-[2.5px] border-black shadow-[3.5px_3.5px_0px_0px_#000] flex items-center justify-center font-black text-2xl mx-auto">
            ★
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            Ready to build something real?
          </h2>
          <p className="text-sm sm:text-base font-bold text-stone-900 max-w-lg mx-auto leading-relaxed">
            Stop searching WhatsApp groups. Describe what you need or showcase your portfolio proof, and assemble your team in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/match"
              className="bg-black hover:bg-white hover:text-black text-white font-black px-8 py-3.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
            >
              <span>Try AI Teammate Matcher</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white hover:bg-[#FF70A6] text-black font-black px-7 py-3.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer text-xs sm:text-sm uppercase tracking-wider"
            >
              Post a Project
            </button>
          </div>
        </div>
      </section>

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
