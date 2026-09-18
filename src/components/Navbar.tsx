'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Leaf, PlusCircle, Bell, ChevronDown, Menu, X, Sparkles, UserCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, allStudents, switchUser, requests } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Filter requests pending for the current user
  const pendingRequests = requests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'pending'
  );

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/students' },
    { name: 'Projects', href: '/projects' },
    { name: 'AI Matcher', href: '/match', highlight: true },
    { name: 'Events', href: '/events' },
    { name: 'Dashboard', href: '/dashboard' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F3D2E] text-white border-b border-[#1F5341] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#2E7058] flex items-center justify-center text-[#A3C9AB] shadow-inner group-hover:scale-105 transition-transform duration-200">
              <Leaf className="w-5 h-5 text-[#A3C9AB]" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                CampusCollab
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-[#2E7058] text-[#A3C9AB] px-1.5 py-0.5 rounded">
                  Campus
                </span>
              </div>
              <div className="text-[11px] text-[#A3C9AB] -mt-0.5 hidden sm:block">
                Find People · Build Projects
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#2E7058] text-white font-semibold shadow-inner'
                      : 'text-stone-300 hover:text-white hover:bg-[#1A4B3A]'
                  }`}
                >
                  {link.highlight && (
                    <Sparkles className="w-3.5 h-3.5 text-[#A3C9AB] animate-pulse" />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Quick Action: Post Project */}
            <Link
              href="/projects?new=true"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#D9C3A5] hover:bg-[#CBB08E] text-[#17231D] font-semibold text-xs md:text-sm px-4 py-2 rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#0F3D2E]" />
              <span>Post Project</span>
            </Link>

            {/* Requests Notification Badge */}
            <Link
              href="/dashboard#requests"
              className="relative p-2 rounded-full text-stone-300 hover:text-white hover:bg-[#1A4B3A] transition-colors cursor-pointer"
              title="Collaboration Requests"
            >
              <Bell className="w-5 h-5" />
              {pendingRequests.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EA580C] text-[10px] font-bold text-white shadow">
                  {pendingRequests.length}
                </span>
              )}
            </Link>

            {/* User Persona Switcher & Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-[#1A4B3A] hover:bg-[#245946] border border-[#2E7058] transition-all cursor-pointer"
                title="Switch active student persona"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#A3C9AB]"
                />
                <span className="text-xs font-medium text-white hidden lg:inline-block max-w-[90px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#A3C9AB]" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white text-[#17231D] rounded-2xl shadow-2xl border border-stone-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 pb-3 border-b border-stone-100">
                    <div className="text-xs text-stone-500 font-medium">Signed in as</div>
                    <div className="font-bold text-[#0F3D2E] text-sm mt-0.5">{currentUser.name}</div>
                    <div className="text-xs text-stone-600 truncate">{currentUser.primaryRole}</div>
                    <div className="mt-2">
                      <StatusBadge status={currentUser.status} size="sm" />
                    </div>
                  </div>

                  {/* Switch Persona section */}
                  <div className="px-4 pt-2.5 pb-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      Switch Demo Student
                    </div>
                  </div>

                  <div className="max-h-56 overflow-y-auto px-2 space-y-1">
                    {allStudents.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => {
                          switchUser(student.id);
                          setUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          student.id === currentUser.id
                            ? 'bg-[#F5F1E6] text-[#0F3D2E] font-semibold border border-[#D9C3A5]'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="flex-1 truncate">
                          <div className="truncate">{student.name}</div>
                          <div className="text-[10px] text-stone-500 truncate">
                            {student.primaryRole}
                          </div>
                        </div>
                        {student.id === currentUser.id && (
                          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-stone-100 mt-2 pt-2 px-3">
                    <Link
                      href={`/students/${currentUser.id}`}
                      onClick={() => setUserMenuOpen(false)}
                      className="block text-center text-xs text-[#0F3D2E] hover:text-[#2E7058] font-semibold py-1.5 rounded-lg hover:bg-stone-50 cursor-pointer"
                    >
                      View My Full Profile & Proofs →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-[#1A4B3A] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A2B20] border-b border-[#1F5341] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-base font-medium text-stone-200 hover:bg-[#1A4B3A] hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/projects?new=true"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex justify-center items-center gap-2 bg-[#D9C3A5] text-[#17231D] font-semibold py-2.5 rounded-full text-sm shadow"
            >
              <PlusCircle className="w-4 h-4 text-[#0F3D2E]" />
              Post a Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
