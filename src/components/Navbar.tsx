'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PlusCircle, Bell, ChevronDown, Menu, X, ArrowUpRight, LogIn, UserPlus, LogOut, Shield, Edit3 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import EditProfileModal from './EditProfileModal';

export default function Navbar() {
  const pathname = usePathname();
  const {
    currentUser,
    requests,
    isAuthenticated,
    isAdmin,
    logout,
    setAuthModalOpen,
    setAuthMode
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const pendingRequests = requests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'pending'
  );

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/students' },
    { name: 'Projects', href: '/projects' },
    { name: 'AI Matcher', href: '/match', highlight: true },
    { name: 'Events', href: '/events' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Deck ↗', href: '/presentation.html', targetBlank: true }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FAF8F5] border-b-[2.5px] border-black shadow-[0_2px_0px_0px_#000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo (Neo-Brutalist Gumroad Style) */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFDE59] border-2 border-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[2.5px_2.5px_0px_0px_#000] flex items-center justify-center font-black text-black text-lg sm:text-xl group-hover:rotate-6 transition-transform">
              ★
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black tracking-tight text-black flex items-center gap-1.5 uppercase">
                CampusCollab
                <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider bg-black text-[#FFDE59] px-1.5 sm:px-2 py-0.5 rounded-md">
                  Pro
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-stone-600 -mt-0.5 hidden sm:block">
                Find People · Build Projects
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links (Cleanly spaced on lg+) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 mx-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  target={link.targetBlank ? '_blank' : undefined}
                  rel={link.targetBlank ? 'noopener noreferrer' : undefined}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-120 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    link.name === 'Deck ↗'
                      ? 'bg-[#9B87F5] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#8570e6]'
                      : isActive
                      ? 'bg-[#FFDE59] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                      : 'text-black hover:bg-white hover:border-2 hover:border-black hover:shadow-[2px_2px_0px_0px_#000]'
                  }`}
                >
                  {link.highlight && (
                    <span className="text-[#9B87F5] font-black">✦</span>
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area - Cleanly spaced on all viewports */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-3.5 shrink-0">
            {/* Quick Action: Post Project (hidden on small phones to keep header uncluttered) */}
            <Link
              href="/projects?new=true"
              className="hidden md:inline-flex items-center gap-1.5 bg-[#FF70A6] hover:bg-[#ff85b3] text-black font-black text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3.5px_3.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span>Post Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {isAuthenticated ? (
              <>
                {/* Requests Notification Badge */}
                <Link
                  href="/dashboard#requests"
                  className="relative p-2 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFDE59] transition-all cursor-pointer flex items-center justify-center"
                  title="Collaboration Requests"
                >
                  <Bell className="w-4 h-4 text-black" />
                  {pendingRequests.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#FF6B6B] border-1.5 border-black text-[9px] font-black text-black shadow-[1px_1px_0px_0px_#000]">
                      {pendingRequests.length}
                    </span>
                  )}
                </Link>

                {/* User Profile / Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:pr-2.5 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-stone-50 transition-all cursor-pointer"
                    title="User account & profile"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-black bg-stone-100"
                    />
                    <span className="text-xs font-black text-black hidden xl:inline-block max-w-[90px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    {isAdmin && (
                      <span className="hidden sm:inline-flex text-[9px] font-black uppercase tracking-wider bg-[#FFDE59] text-black px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                        Admin 👑
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-black" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-72 bg-white text-black rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_#000] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-120"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <div className="px-4 pb-3 border-b-2 border-black bg-[#FAF8F5]">
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Signed in as</div>
                          {isAdmin && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-[#FFDE59] border border-black rounded px-1.5 py-0.5 shadow-[1px_1px_0px_0px_#000]">
                              Admin 👑
                            </span>
                          )}
                        </div>
                        <div className="font-black text-black text-sm mt-0.5">{currentUser.name}</div>
                        <div className="text-xs font-medium text-stone-600 truncate">{currentUser.primaryRole}</div>
                        <div className="mt-2">
                          <StatusBadge status={currentUser.status} size="sm" />
                        </div>
                      </div>

                      <div className="border-t-2 border-black mt-2 pt-2 px-3 space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            setEditProfileOpen(true);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 text-center text-xs text-black font-black py-2 rounded-xl bg-[#FFDE59] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#ffe373] cursor-pointer transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit Profile & Links
                        </button>

                        <Link
                          href={`/students/${currentUser.id}`}
                          onClick={() => setUserMenuOpen(false)}
                          className="block text-center text-xs text-black font-black py-2 rounded-xl bg-[#4FD1C5] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#38E54D] cursor-pointer"
                        >
                          View Full Profile & Proofs →
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="block text-center text-xs text-black font-black py-2 rounded-xl bg-[#FFDE59] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#ebcd4a] cursor-pointer"
                          >
                            👑 Admin Control Portal →
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-stone-100 hover:bg-[#FF6B6B] text-black text-xs font-black border-2 border-black transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Logged Out Actions - Spacious on mobile */
              <div className="flex items-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl bg-white border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFDE59] transition-all cursor-pointer items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#38E54D] border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:bg-[#2ed642] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] text-black hover:bg-[#FFDE59] transition-all cursor-pointer ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Responsive, beautiful Neo-Brutalist design) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b-[2.5px] border-black px-4 pt-4 pb-6 space-y-4 shadow-[0_4px_0px_0px_#000] animate-in slide-in-from-top-3 duration-150">
          {/* If authenticated, show compact profile badge in drawer */}
          {isAuthenticated && (
            <div className="p-3.5 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-xl object-cover border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] bg-stone-100"
                />
                <div>
                  <div className="text-xs font-black uppercase text-black">{currentUser.name}</div>
                  <div className="text-[11px] font-bold text-stone-500 truncate max-w-[170px]">{currentUser.college}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setEditProfileOpen(true);
                  }}
                  className="text-[11px] font-black uppercase bg-[#4FD1C5] hover:bg-[#38E54D] text-black px-2.5 py-1 rounded-lg border border-black shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                >
                  Edit ✏️
                </button>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[11px] font-black uppercase bg-[#FFDE59] px-2.5 py-1 rounded-lg border border-black shadow-[1px_1px_0px_0px_#000]"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Links in Mobile Drawer */}
          <div className="space-y-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  target={link.targetBlank ? '_blank' : undefined}
                  rel={link.targetBlank ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 ${
                    isActive
                      ? 'bg-[#FFDE59] text-black border-black shadow-[2.5px_2.5px_0px_0px_#000]'
                      : 'bg-white text-black border-black/80 hover:bg-[#FF70A6]/20 shadow-[1.5px_1.5px_0px_0px_#000]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.highlight && <span className="text-[#9B87F5]">✦</span>}
                    <span>{link.name}</span>
                  </span>
                  <span className="text-xs text-stone-400 font-bold">→</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Action Buttons */}
          <div className="pt-2 space-y-2 border-t-2 border-black">
            <Link
              href="/projects?new=true"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex justify-center items-center gap-2 bg-[#FF70A6] text-black font-black py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] text-xs uppercase tracking-wider cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span>Post New Project</span>
            </Link>

            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 text-center text-xs font-black uppercase tracking-wider bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 text-center text-xs font-black uppercase tracking-wider bg-[#38E54D] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex justify-center items-center gap-2 bg-[#FFDE59] text-black font-black py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs uppercase"
                  >
                    <span>👑 Admin Control Portal</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-black uppercase text-red-700 bg-red-100 hover:bg-red-200 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  Log Out ({currentUser.name})
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>

      {isAuthenticated && (
        <EditProfileModal
          isOpen={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
          student={currentUser}
        />
      )}
    </>
  );
}
