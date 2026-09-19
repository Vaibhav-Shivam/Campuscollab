'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { KeyRound, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useApp();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
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
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setErrorMessage(res.error || 'Password reset failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-md bg-[#FAF8F5] border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-6 sm:p-8">
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-6 text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000] bg-[#FF70A6] text-black">
            🔑 Password Recovery
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-600">
            <ShieldCheck className="w-3.5 h-3.5 text-[#38E54D]" />
            Encrypted & Secure
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight mb-1">
          Reset Password
        </h1>
        <p className="text-xs font-medium text-neutral-600 mb-6">
          Enter your registered email address and create a new password to restore your account access.
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
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="self-start mt-1 px-3 py-1.5 bg-[#38E54D] text-black border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-0.5 cursor-pointer"
            >
              Sign In with New Password →
            </button>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
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
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
            />
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

        <div className="mt-6 text-center text-xs font-bold text-neutral-600 space-y-2">
          <div>
            Remember your password?{' '}
            <Link href="/login" className="text-black underline font-black hover:text-[#FFDE59]">
              Back to Sign In
            </Link>
          </div>
          <div>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-black underline font-black hover:text-[#FF70A6]">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
