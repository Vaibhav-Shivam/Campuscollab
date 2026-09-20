'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LogIn, ArrowLeft, ShieldCheck, Sparkles, AlertCircle, KeyRound, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsAdmin, resetPassword } = useApp();
  const [view, setView] = useState<'login' | 'forgot' | 'admin'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [adminPasskey, setAdminPasskey] = useState('');
  const [showAdminPasskey, setShowAdminPasskey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.error || 'Login failed.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    const res = await resetPassword(email, newPassword);
    setLoading(false);

    if (res.success) {
      setSuccessMessage('Password has been successfully updated! You can now sign in.');
      setPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setErrorMessage(res.error || 'Password reset failed.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const res = loginAsAdmin(adminPasskey);
    setLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.error || 'Invalid Administrator Passkey.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-md bg-[#FAF8F5] border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-6 sm:p-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-6 text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campus
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000] ${
            view === 'admin'
              ? 'bg-black text-white'
              : view === 'forgot'
              ? 'bg-[#FF70A6] text-black'
              : 'bg-[#FFDE59] text-black'
          }`}>
            {view === 'admin' && '👑 Administrator Portal'}
            {view === 'forgot' && '🔑 Password Recovery'}
            {view === 'login' && 'Student Sign In'}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-600">
            <ShieldCheck className="w-3.5 h-3.5 text-[#38E54D]" />
            {view === 'admin' ? 'Passkey Verified' : 'Encrypted & Secure'}
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight mb-1">
          {view === 'admin' && 'Admin Portal'}
          {view === 'forgot' && 'Reset Password'}
          {view === 'login' && 'Welcome Back'}
        </h1>
        <p className="text-xs font-medium text-neutral-600 mb-6">
          {view === 'admin' && 'Enter your administrator passkey to unlock persona switching and site controls.'}
          {view === 'forgot' && 'Enter your registered email and choose a new password to restore access.'}
          {view === 'login' && 'Access your teams, hackathon applications, and student network.'}
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-[#FFEBEE] border-2 border-[#C62828] text-[#B71C1C] rounded-xl text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 bg-[#E8F8F0] border-2 border-[#166534] text-[#166534] rounded-xl text-xs font-bold flex flex-col gap-2 shadow-[2px_2px_0px_0px_#000]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#166534]" />
              <span>{successMessage}</span>
            </div>
            {view === 'forgot' && (
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setSuccessMessage('');
                  setErrorMessage('');
                }}
                className="self-start mt-1 px-3 py-1.5 bg-[#38E54D] text-black border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-0.5 cursor-pointer"
              >
                Proceed to Sign In →
              </button>
            )}
          </div>
        )}

        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-black uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setView('forgot');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-[11px] font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#38E54D] hover:bg-[#2ed642] text-black font-black text-sm uppercase tracking-wider border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                New Password (min 6 characters)
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FFDE59] hover:bg-[#ebd04f] text-black font-black text-sm uppercase tracking-wider border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              {loading ? 'Updating Password...' : 'Reset Password 🔑'}
            </button>
          </form>
        )}

        {view === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="p-3 bg-[#FFDE59]/25 border-2 border-black rounded-xl text-xs font-bold text-black flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#38E54D] shrink-0" />
              <span>Restricted to Platform Administrator (Vaibhav Shivam).</span>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Administrator Passkey
              </label>
              <div className="relative">
                <input
                  type={showAdminPasskey ? 'text' : 'password'}
                  required
                  value={adminPasskey}
                  onChange={(e) => setAdminPasskey(e.target.value)}
                  placeholder="Enter secret admin passkey..."
                  className="w-full pl-4 pr-11 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPasskey(!showAdminPasskey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                  aria-label={showAdminPasskey ? 'Hide passkey' : 'Show passkey'}
                >
                  {showAdminPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FFDE59] hover:bg-[#ebd04f] text-black font-black text-sm uppercase tracking-wider border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Access 👑</span>
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs font-bold text-neutral-600">
          {view === 'login' && (
            <>
              Don&apos;t have a campus account?{' '}
              <Link href="/signup" className="text-black underline font-black hover:text-[#FF70A6]">
                Sign up here
              </Link>
            </>
          )}
          {view === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setView('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-black underline font-black hover:text-[#FFDE59] cursor-pointer"
            >
              ← Back to Student Sign In
            </button>
          )}
          {view === 'admin' && (
            <button
              type="button"
              onClick={() => {
                setView('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-black underline font-black hover:text-[#FF70A6] cursor-pointer"
            >
              ← Back to Regular Student Sign In
            </button>
          )}
        </div>

        {/* Discreet Admin Portal Toggle */}
        {view !== 'admin' && (
          <div className="mt-6 pt-4 border-t border-stone-200 text-center">
            <button
              type="button"
              onClick={() => {
                setView('admin');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-[11px] font-bold text-stone-400 hover:text-black transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrator Portal Login</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
