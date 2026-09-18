'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import HeroBotanical from '@/components/HeroBotanical';
import FeatureStrip from '@/components/FeatureStrip';
import StudentCard from '@/components/StudentCard';
import ProjectCard from '@/components/ProjectCard';
import CreateProjectModal from '@/components/CreateProjectModal';
import { ArrowRight, Sparkles, Users, Briefcase, Calendar, ShieldCheck, ChevronRight, Check } from 'lucide-react';

export default function HomePage() {
  const { allStudents, projects, events } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Top available talent for featured section
  const availableTalent = allStudents.filter((s) => s.status === 'available').slice(0, 3);
  const featuredProjects = projects.slice(0, 3);
  const upcomingEvents = events.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F5F1E6]">
      {/* 1. Hero Section (Visual Editorial Reference) */}
      <HeroBotanical />

      {/* 2. Feature Strip below Hero */}
      <FeatureStrip />

      {/* 3. The Core Campus Loop Explanation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8B6F47] mb-2">
            Why CampusCollab Works
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F3D2E] tracking-tight">
            The Purpose-Built Campus Loop
          </h2>
          <p className="text-sm text-stone-600 mt-3 leading-relaxed">
            Unlike broad social networks or scattered WhatsApp groups, every connection starts with an actual project and verifiable skill proof.
          </p>
        </div>

        {/* 5-step Flow diagram matching spec: Project → Skills → Match → Proof → Collaboration */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: '01',
              title: 'Project Idea',
              desc: 'Post your project & vision',
              icon: Briefcase
            },
            {
              step: '02',
              title: 'Required Skills',
              desc: 'Specify exact roles needed',
              icon: Sparkles
            },
            {
              step: '03',
              title: 'Smart Matching',
              desc: 'AI scores & ranks candidates',
              icon: Users
            },
            {
              step: '04',
              title: 'Portfolio Proof',
              desc: 'Inspect real GitHub/Figma demos',
              icon: ShieldCheck
            },
            {
              step: '05',
              title: 'Collaboration',
              desc: 'Send request & build together',
              icon: ArrowRight
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#8B6F47] tracking-wider uppercase">
                      {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#F5F1E6] flex items-center justify-center text-[#2E7058]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-[#0F3D2E] mb-1">{item.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Two-Way Network Status Showcase */}
      <section className="bg-[#EFE9DC] border-y border-[#E0D8C7] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Card: Project Needs People */}
            <div className="bg-[#0F3D2E] text-white rounded-3xl p-8 border border-[#2E7058] shadow-lg relative overflow-hidden">
              <div className="inline-flex items-center gap-2 bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 px-3.5 py-1 rounded-full text-xs font-bold mb-4">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                <span>🟠 Looking for Teammates</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Have a project idea but missing a skill?
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-6">
                Post your project requirements and let smart matching locate the designers, backend developers, or video editors ready on your campus.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#D9C3A5] hover:bg-[#CBB08E] text-[#17231D] font-semibold text-xs px-5 py-2.5 rounded-full transition-all cursor-pointer inline-flex items-center gap-2 shadow"
              >
                <span>Post Your Project</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Card: People Need Projects */}
            <div className="bg-white rounded-3xl p-8 border border-[#D9C3A5] shadow-lg relative overflow-hidden">
              <div className="inline-flex items-center gap-2 bg-[#10B981]/15 text-[#065F46] border border-[#10B981]/30 px-3.5 py-1 rounded-full text-xs font-bold mb-4">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span>🟢 Available for Projects</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0F3D2E] mb-2">
                Have skills but searching for a team?
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-6">
                Mark your profile as Available, attach your GitHub or Figma proof, and receive collaboration invitations from active campus project creators.
              </p>
              <Link
                href="/dashboard"
                className="bg-[#2E7058] hover:bg-[#245946] text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all cursor-pointer inline-flex items-center gap-2 shadow"
              >
                <span>Update My Availability</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#A3C9AB]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Student Talent */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#8B6F47] mb-1">
              Campus Talent Pool
            </div>
            <h2 className="text-3xl font-bold text-[#0F3D2E]">
              Students Available to Collaborate
            </h2>
          </div>
          <Link
            href="/students"
            className="text-xs font-bold text-[#2E7058] hover:text-[#0F3D2E] inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View All Students ({allStudents.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableTalent.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </section>

      {/* 6. Active Project Requirements */}
      <section className="bg-[#FAF7F0] border-t border-[#E8E2D5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#8B6F47] mb-1">
                Open Opportunities
              </div>
              <h2 className="text-3xl font-bold text-[#0F3D2E]">
                Projects Looking for Teammates
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-xs font-bold text-[#2E7058] hover:text-[#0F3D2E] inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Explore All Projects ({projects.length})</span>
              <ArrowRight className="w-4 h-4" />
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
            <div className="text-xs font-bold uppercase tracking-wider text-[#8B6F47] mb-1">
              Campus Events & Hackathons
            </div>
            <h2 className="text-3xl font-bold text-[#0F3D2E]">
              Where Teams Form & Build
            </h2>
          </div>
          <Link
            href="/events"
            className="text-xs font-bold text-[#2E7058] hover:text-[#0F3D2E] inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>All Campus Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white border border-[#E8E2D5] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 relative h-48 sm:h-auto">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#0F3D2E] text-[#A3C9AB] text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {evt.category}
                </span>
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-[#8B6F47] font-semibold mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {evt.date}
                  </div>
                  <h3 className="font-bold text-lg text-[#0F3D2E] leading-snug mb-2">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {evt.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <span className="text-xs text-stone-500">
                    <strong className="text-[#0F3D2E]">{evt.attendeesCount}</strong> students interested
                  </span>
                  <Link
                    href="/events"
                    className="text-xs font-bold text-[#2E7058] hover:text-[#0F3D2E] inline-flex items-center gap-1"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Bottom Editorial CTA Banner */}
      <section className="bg-[#0F3D2E] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-[#1F5341]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#2E7058] flex items-center justify-center text-[#A3C9AB] mx-auto">
            <Sparkles className="w-6 h-6 text-[#A3C9AB]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-sm sm:text-base text-stone-200 max-w-xl mx-auto leading-relaxed">
            Skip the guesswork. Describe what you want to build or show your proof of work, and start collaborating today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/match"
              className="bg-[#2E7058] hover:bg-[#245946] text-white font-semibold px-8 py-3.5 rounded-full shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 text-sm"
            >
              <span>Try AI Teammate Matcher</span>
              <ArrowRight className="w-4 h-4 text-[#A3C9AB]" />
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#D9C3A5] hover:bg-[#CBB08E] text-[#17231D] font-semibold px-7 py-3.5 rounded-full shadow transition-all cursor-pointer text-sm"
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
