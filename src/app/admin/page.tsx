'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  LogOut,
  Users,
  FolderGit2,
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const {
    isAdmin,
    loginAsAdmin,
    logout,
    allStudents,
    currentUser,
    switchUser,
    projects,
    events,
    refreshStudents,
    isRefreshingStudents
  } = useApp();

  const [passkey, setPasskey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await loginAsAdmin(passkey);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid administrator passkey.');
      } else {
        setPasskey('');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error verifying administrator passkey.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md bg-[#FAF8F5] border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2.5 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              Admin Restricted
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-600">
              <Lock className="w-3.5 h-3.5 text-black" />
              Owner Access Only
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight mb-1">CampusCollab Admin</h1>
          <p className="text-xs font-medium text-neutral-600 mb-6">
            Enter the master passkey to unlock the persona switcher and administrative platform tools.
          </p>

          {errorMessage && (
            <div className="mb-4 p-3.5 bg-[#FFEBEE] border-2 border-[#C62828] text-[#B71C1C] rounded-xl text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C62828]" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Master Admin Passkey
              </label>
              <input
                type="password"
                required
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter passkey..."
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#FFDE59] hover:bg-[#ebcd4a] text-black font-black text-sm uppercase tracking-wider border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Access 👑</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-bold text-neutral-500">
            <Link href="/" className="hover:text-black underline">
              ← Return to Main Campus
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#FAF8F5] border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#38E54D] text-black px-2.5 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Session Active
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFDE59] text-black px-2.5 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              Vaibhav Shivam
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            Administrator Control Portal
          </h1>
          <p className="text-xs sm:text-sm font-medium text-stone-600 mt-1 max-w-xl">
            You have full authorization to manage platform state, inspect registered users, and switch between test demo personas.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => refreshStudents()}
            disabled={isRefreshingStudents}
            className="px-4 py-2.5 bg-white hover:bg-stone-100 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingStudents ? 'animate-spin' : ''}`} />
            <span>Sync Cloud Data</span>
          </button>

          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="px-4 py-2.5 bg-[#FF6B6B] hover:bg-[#fa5252] text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#4FD1C5] border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="text-2xl font-black text-black">{allStudents.length}</div>
            <div className="text-xs font-bold text-stone-600 uppercase tracking-wider">Total Active Creators</div>
          </div>
        </div>

        <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF70A6] border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
            <FolderGit2 className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="text-2xl font-black text-black">{projects.length}</div>
            <div className="text-xs font-bold text-stone-600 uppercase tracking-wider">Active Projects</div>
          </div>
        </div>

        <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFDE59] border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="text-2xl font-black text-black">{events.length}</div>
            <div className="text-xs font-bold text-stone-600 uppercase tracking-wider">Campus Events</div>
          </div>
        </div>
      </div>

      {/* Demo Persona Switcher (Exclusive to Admin) */}
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-2 border-black pb-4">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#9B87F5]" />
              <h2 className="text-xl font-black uppercase tracking-tight text-black">
                Demo Persona Switcher (Exclusive Feature)
              </h2>
            </div>
            <p className="text-xs font-medium text-stone-600 mt-0.5">
              Switch into any demo student persona below to test views, permissions, and collaboration flows.
            </p>
          </div>
          <span className="text-[10px] font-black uppercase bg-[#FAF8F5] border border-black px-2.5 py-1 rounded-lg self-start sm:self-auto">
            Current: <strong className="text-black">{currentUser.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allStudents.map((student) => {
            const isSelected = student.id === currentUser.id;
            return (
              <div
                key={student.id}
                className={`p-4 rounded-2xl border-2 border-black transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FFDE59] shadow-[4px_4px_0px_0px_#000]'
                    : 'bg-[#FAF8F5] hover:bg-white shadow-[2px_2px_0px_0px_#000]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-black shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-black truncate">{student.name}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-stone-600 truncate">{student.primaryRole}</div>
                    <div className="text-[10px] text-stone-500 truncate">{student.college}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/20 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-stone-500 truncate">{student.id}</span>
                  <button
                    onClick={() => switchUser(student.id)}
                    disabled={isSelected}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border border-black cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white cursor-default'
                        : 'bg-white hover:bg-[#38E54D] text-black shadow-[1.5px_1.5px_0px_0px_#000]'
                    }`}
                  >
                    {isSelected ? 'Active Now' : 'Switch To →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
