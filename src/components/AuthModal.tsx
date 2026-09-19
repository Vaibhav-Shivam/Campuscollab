'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, LogIn, UserPlus, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup' | 'admin';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const { login, signup, loginAsAdmin, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'admin'>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [adminPasskey, setAdminPasskey] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [college, setCollege] = useState('');
  const [major, setMajor] = useState('Computer Science');
  const [primaryRole, setPrimaryRole] = useState('Full-Stack Developer');
  const [skillsInput, setSkillsInput] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Login failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await signup({
        name,
        email: signupEmail,
        password: signupPassword,
        college,
        major,
        primaryRole,
        skills
      });

      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginAsAdmin(adminPasskey);
    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Invalid Admin Passkey.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] text-black border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FF6B6B] transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 text-black stroke-[3]" />
        </button>

        {/* Header Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFDE59] text-black px-2.5 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
            CampusCollab Access
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-600">
            <ShieldCheck className="w-3.5 h-3.5 text-[#38E54D]" />
            Verified Student Hub
          </span>
        </div>

        {/* Modal Title */}
        <h2 className="text-2xl font-black tracking-tight mb-1">
          {mode === 'login' && 'Welcome Back, Creator'}
          {mode === 'signup' && 'Create Your Student Profile'}
          {mode === 'admin' && 'Platform Admin Portal'}
        </h2>
        <p className="text-xs font-medium text-neutral-600 mb-6">
          {mode === 'login' && 'Sign in to access your projects, messages, and team requests.'}
          {mode === 'signup' && 'Join verified student collaborators building real projects & hackathons.'}
          {mode === 'admin' && 'Enter your secret Administrator passkey to unlock administrative features.'}
        </p>

        {/* Mode Toggle Tabs */}
        {mode !== 'admin' ? (
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000] mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#FFDE59] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <LogIn className="w-3.5 h-3.5" />
                Log In
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#FF70A6] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </div>
            </button>
          </div>
        ) : (
          <div className="mb-6 flex items-center justify-between bg-black text-white p-2.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000]">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 pl-2">
              <span>👑</span> Administrator Verification
            </span>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className="text-xs font-bold bg-white text-black px-2.5 py-1 rounded-lg border border-black hover:bg-[#FFDE59] cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-[#FFEBEE] border-2 border-[#C62828] text-[#B71C1C] rounded-xl text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#C62828]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Campus or Personal Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#38E54D] hover:bg-[#2ed642] text-black font-black text-sm uppercase tracking-wider border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In →'}
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Patel"
                  className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium placeholder:text-neutral-400 focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="maya.p@campus.edu"
                  className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium placeholder:text-neutral-400 focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Password (min 6 chars) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium placeholder:text-neutral-400 focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  College / University *
                </label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. SRM / IIT / MIT"
                  className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium placeholder:text-neutral-400 focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Primary Role *
                </label>
                <select
                  value={primaryRole}
                  onChange={(e) => setPrimaryRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-bold focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
                >
                  <option value="Full-Stack Developer">Full-Stack Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="AI & ML Engineer">AI & ML Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Mobile App Developer">Mobile App Developer</option>
                  <option value="Blockchain Developer">Blockchain Developer</option>
                  <option value="Product Manager">Product Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Major / Discipline
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Computer Science"
                  className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium placeholder:text-neutral-400 focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Top Skills (comma separated)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="React, Next.js, Python, Figma"
                className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium placeholder:text-neutral-400 focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#FF70A6] hover:bg-[#ff85b3] text-black font-black text-sm uppercase tracking-wider border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Complete Sign Up →'}
            </button>
          </form>
        )}

        {/* Admin Form */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="p-3 bg-[#FFDE59]/25 border-2 border-black rounded-xl text-xs font-bold text-black flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#38E54D] shrink-0" />
              <span>Only authorized administrators may switch demo personas or manage platform settings.</span>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Admin Passkey
              </label>
              <input
                type="password"
                required
                value={adminPasskey}
                onChange={(e) => setAdminPasskey(e.target.value)}
                placeholder="Enter secret admin passkey..."
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FFDE59] hover:bg-[#ebd04f] text-black font-black text-sm uppercase tracking-wider border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Unlock Administrator Access 👑</span>
            </button>
          </form>
        )}

        {/* Discreet Admin Portal Link */}
        <div className="mt-6 pt-3 border-t border-stone-200 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'admin' ? 'login' : 'admin');
              setErrorMessage('');
            }}
            className="text-[11px] font-bold text-stone-400 hover:text-black transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{mode === 'admin' ? '← Back to Student Sign In' : 'Platform Administrator Portal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
