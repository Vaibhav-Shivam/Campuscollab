'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PlusCircle, Bell, ChevronDown, Menu, X, UserCheck, ArrowUpRight, LogIn, UserPlus, LogOut, Shield } from 'lucide-react';
import StatusBadge from './StatusBadge';

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
    <header className="sticky top-0 z-50 bg-[#FAF8F5] border-b-[2.5px] border-black shadow-[0_2px_0px_0px_#000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo (Neo-Brutalist Gumroad Style) */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#FFDE59] border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] flex items-center justify-center font-black text-black text-xl group-hover:rotate-6 transition-transform">
              ★
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-black flex items-center gap-1.5 uppercase">
                CampusCollab
                <span className="text-[10px] uppercase font-black tracking-wider bg-black text-[#FFDE59] px-2 py-0.5 rounded-md">
                  Pro
                </span>
              </div>
              <div className="text-[11px] font-bold text-stone-600 -mt-0.5 hidden sm:block">
                Find People · Build Projects
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  target={link.targetBlank ? '_blank' : undefined}
                  rel={link.targetBlank ? 'noopener noreferrer' : undefined}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-120 flex items-center gap-1 cursor-pointer ${
                    link.name === 'Deck ↗'
                      ? 'bg-[#9B87F5] text-black border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-[#8570e6]'
                      : isActive
                      ? 'bg-[#FFDE59] text-black border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000]'
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

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Action: Post Project */}
            <Link
              href="/projects?new=true"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#FF70A6] hover:bg-[#ff85b3] text-black font-black text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
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
                  className="relative p-2 rounded-xl bg-white border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-[#FFDE59] transition-all cursor-pointer"
                  title="Collaboration Requests"
                >
                  <Bell className="w-4 h-4 text-black" />
                  {pendingRequests.length > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B6B] border-1.5 border-black text-[10px] font-black text-black shadow-[1px_1px_0px_0px_#000]">
                      {pendingRequests.length}
                    </span>
                  )}
                </Link>

                {/* User Profile / Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-stone-50 transition-all cursor-pointer"
                    title="User account & profile"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-lg object-cover border border-black"
                    />
                    <span className="text-xs font-black text-black hidden lg:inline-block max-w-[90px] truncate">
                      {currentUser.name}
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
                        <Link
                          href={`/students/${currentUser.id}`}
                          onClick={() => setUserMenuOpen(false)}
                          className="block text-center text-xs text-black font-black py-1.5 rounded-lg bg-[#4FD1C5] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#38E54D] cursor-pointer"
                        >
                          View Full Profile & Proofs →
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="block text-center text-xs text-black font-black py-1.5 rounded-lg bg-[#FFDE59] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#ebcd4a] cursor-pointer"
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
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-stone-100 hover:bg-[#FF6B6B] text-black text-xs font-bold border border-black transition-colors cursor-pointer"
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
              /* Logged Out Actions */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFDE59] transition-all cursor-pointer flex items-center gap-1.5"
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
                  className="px-3.5 py-1.5 rounded-xl bg-[#38E54D] border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-[#2ed642] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] text-black cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-black px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-sm font-black uppercase text-black hover:bg-[#FFDE59] border-2 border-transparent hover:border-black"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-2 space-y-2 border-t border-stone-200">
            <Link
              href="/projects?new=true"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex justify-center items-center gap-2 bg-[#FF70A6] text-black font-black py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] text-xs uppercase"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span>Post New Project</span>
            </Link>

            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 text-center text-xs font-black uppercase tracking-wider bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000]"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 text-center text-xs font-black uppercase tracking-wider bg-[#38E54D] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000]"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-bold text-red-600 bg-red-50 border border-red-300 rounded-xl"
              >
                Sign Out ({currentUser.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
