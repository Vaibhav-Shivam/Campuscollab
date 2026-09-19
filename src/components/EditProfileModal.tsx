'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Student, ProjectProof } from '@/types';
import {
  X,
  Link as LinkIcon,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  Sparkles,
  Save,
  CheckCircle2,
  FolderGit2
} from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function FigmaIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 38 57" fill="currentColor">
      <path fill="#EA580C" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
      <path fill="#000000" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
      <path fill="#2E7058" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
      <path fill="#8B6F47" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
      <path fill="#A3C9AB" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student;
}

export default function EditProfileModal({ isOpen, onClose, student }: EditProfileModalProps) {
  const { currentUser, updateUserProfile, showToast } = useApp();
  const targetStudent = student || currentUser;

  const [activeTab, setActiveTab] = useState<'links' | 'proofs' | 'info'>('links');
  const [loading, setLoading] = useState(false);

  // Link fields
  const [githubUrl, setGithubUrl] = useState(targetStudent.githubUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(targetStudent.portfolioUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(targetStudent.linkedinUrl || '');
  const [figmaUrl, setFigmaUrl] = useState(targetStudent.figmaUrl || '');

  // Info fields
  const [bio, setBio] = useState(targetStudent.bio || '');
  const [primaryRole, setPrimaryRole] = useState(targetStudent.primaryRole || '');
  const [lookingForRole, setLookingForRole] = useState(targetStudent.lookingForRole || '');
  const [college, setCollege] = useState(targetStudent.college || '');
  const [major, setMajor] = useState(targetStudent.major || '');
  const [year, setYear] = useState(targetStudent.year || '');
  const [skillsText, setSkillsText] = useState(
    targetStudent.skills.map((s) => s.name).join(', ')
  );

  // Proofs
  const [proofs, setProofs] = useState<ProjectProof[]>(targetStudent.proofs || []);
  const [showAddProof, setShowAddProof] = useState(false);
  const [newProofTitle, setNewProofTitle] = useState('');
  const [newProofDesc, setNewProofDesc] = useState('');
  const [newProofRole, setNewProofRole] = useState('');
  const [newProofTech, setNewProofTech] = useState('');
  const [newProofDemo, setNewProofDemo] = useState('');
  const [newProofGithub, setNewProofGithub] = useState('');
  const [newProofFigma, setNewProofFigma] = useState('');

  // Sync state when student prop changes
  useEffect(() => {
    if (targetStudent) {
      setGithubUrl(targetStudent.githubUrl || '');
      setPortfolioUrl(targetStudent.portfolioUrl || '');
      setLinkedinUrl(targetStudent.linkedinUrl || '');
      setFigmaUrl(targetStudent.figmaUrl || '');
      setBio(targetStudent.bio || '');
      setPrimaryRole(targetStudent.primaryRole || '');
      setLookingForRole(targetStudent.lookingForRole || '');
      setCollege(targetStudent.college || '');
      setMajor(targetStudent.major || '');
      setYear(targetStudent.year || '');
      setSkillsText(targetStudent.skills.map((s) => s.name).join(', '));
      setProofs(targetStudent.proofs || []);
    }
  }, [targetStudent]);

  if (!isOpen) return null;

  const handleAddProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProofTitle.trim()) return;

    const techList = newProofTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProof: ProjectProof = {
      title: newProofTitle.trim(),
      description: newProofDesc.trim() || 'Verified project proof on CampusCollab.',
      role: newProofRole.trim() || 'Contributor',
      technologies: techList.length > 0 ? techList : ['TypeScript', 'React'],
      githubUrl: newProofGithub.trim() || undefined,
      liveDemoUrl: newProofDemo.trim() || undefined,
      figmaUrl: newProofFigma.trim() || undefined
    };

    setProofs((prev) => [newProof, ...prev]);
    setNewProofTitle('');
    setNewProofDesc('');
    setNewProofRole('');
    setNewProofTech('');
    setNewProofDemo('');
    setNewProofGithub('');
    setNewProofFigma('');
    setShowAddProof(false);
    showToast('Project proof attached!', 'success');
  };

  const handleRemoveProof = (index: number) => {
    setProofs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    setLoading(true);

    const parsedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => {
        const existing = targetStudent.skills.find(
          (sk) => sk.name.toLowerCase() === name.toLowerCase()
        );
        return existing || { name, level: 4, category: 'General' };
      });

    const updatedData: Partial<Student> = {
      githubUrl: githubUrl.trim() || undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      figmaUrl: figmaUrl.trim() || undefined,
      bio: bio.trim(),
      primaryRole: primaryRole.trim(),
      lookingForRole: lookingForRole.trim() || undefined,
      college: college.trim(),
      major: major.trim(),
      year: year.trim(),
      skills: parsedSkills,
      proofs: proofs,
      projectCount: Math.max(proofs.length, targetStudent.projectCount)
    };

    try {
      await updateUserProfile(updatedData);
      onClose();
    } catch (err: any) {
      showToast('Error saving profile', 'error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] text-black border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
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

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFDE59] text-black px-2.5 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
            Profile Studio
          </span>
          <span className="text-[10px] font-bold text-neutral-600">
            Portfolio & Social Presence
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
          Edit Profile & Proofs
        </h2>
        <p className="text-xs font-medium text-neutral-600 mb-6">
          Add your GitHub, live portfolio, Figma canvas, and verified project proofs to attract top campus teammates.
        </p>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('links')}
            className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === 'links'
                ? 'bg-[#FFDE59] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Portfolio & Links
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('proofs')}
            className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === 'proofs'
                ? 'bg-[#4FD1C5] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Project Proofs ({proofs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-[#FF70A6] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Bio & Role
          </button>
        </div>

        {/* TAB 1: Links & Portfolio */}
        {activeTab === 'links' && (
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-1.5">
                <GithubIcon className="w-4 h-4 text-black" />
                <span>GitHub Profile URL</span>
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/your-username"
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
              />
              <p className="text-[10px] text-neutral-500 font-bold mt-1">
                Displays a direct verified GitHub badge on your profile.
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-1.5">
                <Code2 className="w-4 h-4 text-black" />
                <span>Personal Portfolio Website</span>
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
              />
              <p className="text-[10px] text-neutral-500 font-bold mt-1">
                Your personal website, blog, or resume site.
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-1.5">
                <LinkedinIcon className="w-4 h-4 text-[#0A66C2]" />
                <span>LinkedIn Profile URL</span>
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/your-profile"
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
              />
              <p className="text-[10px] text-neutral-500 font-bold mt-1">
                Allows students and hackathon recruiters to connect with you professionally.
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-1.5">
                <FigmaIcon className="w-4 h-4 text-black" />
                <span>Figma / Design Profile URL</span>
              </label>
              <input
                type="url"
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                placeholder="https://figma.com/@your-handle"
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#FFDE59] shadow-[2.5px_2.5px_0px_0px_#000]"
              />
              <p className="text-[10px] text-neutral-500 font-bold mt-1">
                Ideal for UI/UX designers and creative technologists.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: Project Proofs */}
        {activeTab === 'proofs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider">
                  Verified Proof of Work
                </h4>
                <p className="text-[11px] text-neutral-600 font-medium">
                  Attach real projects with live demos or GitHub code to back up your skills.
                </p>
              </div>

              {!showAddProof && (
                <button
                  type="button"
                  onClick={() => setShowAddProof(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#38E54D] text-black font-black text-xs uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Proof</span>
                </button>
              )}
            </div>

            {/* Add New Proof Form Box */}
            {showAddProof && (
              <div className="p-4 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] space-y-3">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <span className="text-xs font-black uppercase text-black flex items-center gap-1">
                    <FolderGit2 className="w-4 h-4 text-[#FF70A6]" />
                    New Project Proof
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddProof(false)}
                    className="text-xs font-bold text-neutral-500 hover:text-black cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProofTitle}
                      onChange={(e) => setNewProofTitle(e.target.value)}
                      placeholder="e.g. AI Financial Forecaster"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase mb-1">
                      Your Role
                    </label>
                    <input
                      type="text"
                      value={newProofRole}
                      onChange={(e) => setNewProofRole(e.target.value)}
                      placeholder="e.g. Lead ML Engineer / Designer"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase mb-1">
                    Description & Outcome
                  </label>
                  <textarea
                    rows={2}
                    value={newProofDesc}
                    onChange={(e) => setNewProofDesc(e.target.value)}
                    placeholder="What did you build? What was the impact or technical challenge solved?"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase mb-1">
                      GitHub Repo URL
                    </label>
                    <input
                      type="url"
                      value={newProofGithub}
                      onChange={(e) => setNewProofGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase mb-1">
                      Live Demo / Website
                    </label>
                    <input
                      type="url"
                      value={newProofDemo}
                      onChange={(e) => setNewProofDemo(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase mb-1">
                      Figma / Design URL
                    </label>
                    <input
                      type="url"
                      value={newProofFigma}
                      onChange={(e) => setNewProofFigma(e.target.value)}
                      placeholder="https://figma.com/..."
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase mb-1">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newProofTech}
                    onChange={(e) => setNewProofTech(e.target.value)}
                    placeholder="Python, FastAPI, Docker, PyTorch"
                    className="w-full px-3 py-1.5 bg-[#FAF8F5] border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddProof}
                  className="w-full py-2 bg-[#FFDE59] text-black font-black text-xs uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] hover:bg-[#ffd633] transition-all cursor-pointer"
                >
                  Confirm & Attach Proof
                </button>
              </div>
            )}

            {/* List of Current Proofs */}
            <div className="space-y-2.5">
              {proofs.length === 0 ? (
                <div className="p-6 bg-white border-2 border-black border-dashed rounded-2xl text-center">
                  <FolderGit2 className="w-8 h-8 mx-auto text-neutral-400 mb-1" />
                  <div className="text-xs font-black uppercase text-neutral-600">
                    No project proofs attached yet
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Click &quot;Add Proof&quot; to link your hackathon submissions or open source projects.
                  </p>
                </div>
              ) : (
                proofs.map((pf, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white border-2 border-black rounded-xl shadow-[2.5px_2.5px_0px_0px_#000] flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-black">{pf.title}</span>
                        {pf.role && (
                          <span className="text-[9px] font-black uppercase bg-[#FAF8F5] border border-black px-1.5 py-0.5 rounded">
                            {pf.role}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-600 font-medium line-clamp-2">
                        {pf.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-bold">
                        {pf.technologies.map((tech) => (
                          <span key={tech} className="bg-stone-100 px-1.5 py-0.5 rounded text-neutral-700">
                            {tech}
                          </span>
                        ))}
                        {pf.githubUrl && (
                          <span className="text-blue-600 underline flex items-center gap-0.5">
                            GitHub <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                        {pf.liveDemoUrl && (
                          <span className="text-emerald-600 underline flex items-center gap-0.5">
                            Live Demo <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveProof(idx)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-[#FF6B6B] text-black border border-black transition-colors cursor-pointer"
                      title="Remove proof"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Bio & Role */}
        {activeTab === 'info' && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Primary Role
                </label>
                <input
                  type="text"
                  value={primaryRole}
                  onChange={(e) => setPrimaryRole(e.target.value)}
                  placeholder="e.g. AI & Python Developer"
                  className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  College / Campus
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. SRM / IIT / MIT"
                  className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Major
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Computer Science"
                  className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="3rd Year"
                  className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Bio & Background
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your passions, engineering focus, or design goals..."
                className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Looking for Role / What kind of teammate do you need?
              </label>
              <input
                type="text"
                value={lookingForRole}
                onChange={(e) => setLookingForRole(e.target.value)}
                placeholder="e.g. UI/UX Designer and React Developer for Hackathon"
                className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="Python, React, FastAPI, Machine Learning"
                className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs font-medium focus:outline-hidden shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t-2 border-black">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white border-2 border-black text-black font-bold text-xs uppercase rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={loading}
            className="px-6 py-2.5 bg-[#38E54D] hover:bg-[#2ed642] text-black font-black text-xs uppercase tracking-wider border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
