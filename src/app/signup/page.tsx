'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserPlus, ArrowLeft, ShieldCheck, AlertCircle, Eye, EyeOff, Camera } from 'lucide-react';
import AvatarPicker from '@/components/AvatarPicker';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useApp();
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/bottts/svg?seed=Builder&backgroundColor=b6e3f4');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [college, setCollege] = useState('');
  const [major, setMajor] = useState('Computer Science');
  const [year, setYear] = useState('1st Year');
  const [primaryRole, setPrimaryRole] = useState('Full-Stack Developer');
  const [skillsInput, setSkillsInput] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await signup({
      name,
      email,
      password,
      college,
      major,
      year,
      primaryRole,
      skills,
      bio,
      avatar
    });

    setLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-xl bg-[#FAF8F5] border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-6 sm:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-6 text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campus
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF70A6] text-black px-2.5 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
            Student Registration
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-600">
            <ShieldCheck className="w-3.5 h-3.5 text-[#38E54D]" />
            Free for All Students
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight mb-1">Create Student Profile</h1>
        <p className="text-xs font-medium text-neutral-600 mb-6">
          Set up your verified campus persona to find teammates and join real-world projects.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-[#FFEBEE] border-2 border-[#C62828] text-[#B71C1C] rounded-xl text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Profile Picture Selector */}
          <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={avatar}
                  alt="Profile Avatar"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000] bg-stone-100"
                />
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute -bottom-1 -right-1 p-1 bg-[#FFDE59] hover:bg-[#FF70A6] border border-black rounded-lg text-black shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                  title="Change avatar"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                  Profile Picture
                </div>
                <div className="text-xs font-black uppercase text-black">
                  {avatar.startsWith('data:') ? 'Custom Photo' : 'Graphic Avatar'}
                </div>
                <p className="text-[11px] font-semibold text-stone-600">
                  Choose from graphics or upload photo
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="bg-[#FFDE59] hover:bg-[#FF70A6] text-black font-black text-xs uppercase px-3.5 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
            >
              Change Pic 🎭
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vaibhav Shivam"
                className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Password (min 6 chars) *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-11 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
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
                className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Primary Role *
              </label>
              <select
                value={primaryRole}
                onChange={(e) => setPrimaryRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl text-xs font-bold focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
              >
                <option value="Full-Stack Developer">Full-Stack Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="AI & ML Engineer">AI & ML Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Mobile App Developer">Mobile App Developer</option>
                <option value="Product Manager">Product Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Major
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="Computer Science"
                className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl text-xs font-bold focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Master's / PhD">Master&apos;s / PhD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Python, React, Machine Learning, Tailwind CSS"
              className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              Short Bio / What you want to build
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other students what you're interested in building..."
              className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FF70A6] hover:bg-[#ff85b3] text-black font-black text-sm uppercase tracking-wider border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating Profile...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-bold text-neutral-600">
          Already registered?{' '}
          <Link href="/login" className="text-black underline font-black hover:text-[#38E54D]">
            Log in to your account
          </Link>
        </div>
      </div>

      {showAvatarModal && (
        <AvatarPicker
          currentAvatar={avatar}
          onSelectAvatar={(url) => {
            setAvatar(url);
          }}
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          mode="modal"
        />
      )}
    </div>
  );
}
