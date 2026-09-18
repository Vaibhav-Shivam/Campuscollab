'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ProjectType } from '@/types';
import { X, Plus, Sparkles, Wand2 } from 'lucide-react';

interface CreateProjectModalProps {
  onClose: () => void;
  onCreated?: (projectId: string) => void;
}

export default function CreateProjectModal({ onClose, onCreated }: CreateProjectModalProps) {
  const { createProject } = useApp();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProjectType>('Hackathon');
  const [skillInput, setSkillInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['React', 'UI/UX']);
  const [currentMembers, setCurrentMembers] = useState(1);
  const [maxMembers, setMaxMembers] = useState(4);
  const [isAiParsing, setIsAiParsing] = useState(false);

  const handleAddSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skillToRemove));
  };

  // AI-Assisted Skill Extraction from Description
  const handleAiExtractSkills = () => {
    if (!description.trim()) {
      alert('Please enter a description first for AI skill extraction.');
      return;
    }
    setIsAiParsing(true);
    setTimeout(() => {
      const lower = description.toLowerCase();
      const detected: string[] = [...requiredSkills];
      const skillsMap: Record<string, string> = {
        react: 'React',
        next: 'Next.js',
        python: 'Python',
        'machine learning': 'Machine Learning',
        ai: 'AI/ML',
        'ui/ux': 'UI/UX',
        figma: 'Figma',
        node: 'Node.js',
        fastapi: 'FastAPI',
        tailwind: 'Tailwind CSS',
        video: 'Video Editing',
        aws: 'AWS'
      };

      Object.entries(skillsMap).forEach(([key, val]) => {
        if (lower.includes(key) && !detected.includes(val)) {
          detected.push(val);
        }
      });

      setRequiredSkills(detected);
      setIsAiParsing(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const newProj = createProject({
      title,
      tagline: tagline.trim() || title,
      description,
      type,
      requiredSkills,
      currentMembers: Number(currentMembers),
      maxMembers: Number(maxMembers),
      isOpen: true,
      tags: [type, ...requiredSkills.slice(0, 2)]
    });

    if (onCreated) {
      onCreated(newProj.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-[#F5F1E6] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#D9C3A5] shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8B6F47]">
            Build Together
          </div>
          <h2 className="text-2xl font-bold text-[#0F3D2E] mt-0.5">Post a Project</h2>
          <p className="text-xs text-stone-600 mt-1">
            Share your idea and find skilled students from your campus community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold text-[#0F3D2E] uppercase tracking-wider mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Based Expense Tracker"
              className="w-full bg-white border border-[#D9C3A5] rounded-xl px-4 py-2.5 text-sm text-[#17231D] focus:outline-none focus:ring-2 focus:ring-[#2E7058]"
              required
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-bold text-[#0F3D2E] uppercase tracking-wider mb-1.5">
              One-line Pitch / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Smart receipt scanner and budget companion for students"
              className="w-full bg-white border border-[#D9C3A5] rounded-xl px-4 py-2.5 text-sm text-[#17231D] focus:outline-none focus:ring-2 focus:ring-[#2E7058]"
            />
          </div>

          {/* Project Description + AI Extraction Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#0F3D2E] uppercase tracking-wider">
                Description & Vision *
              </label>
              <button
                type="button"
                onClick={handleAiExtractSkills}
                disabled={isAiParsing}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2E7058] hover:text-[#0F3D2E] bg-white px-2.5 py-1 rounded-full border border-[#D9C3A5] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <Wand2 className={`w-3 h-3 ${isAiParsing ? 'animate-spin' : ''}`} />
                <span>{isAiParsing ? 'Analyzing...' : 'AI Auto-Detect Skills'}</span>
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Explain what problem you're solving, what is currently built, and what roles you need to fill..."
              className="w-full bg-white border border-[#D9C3A5] rounded-xl p-3.5 text-sm text-[#17231D] focus:outline-none focus:ring-2 focus:ring-[#2E7058]"
              required
            />
          </div>

          {/* Required Skills Badges & Input */}
          <div>
            <label className="block text-xs font-bold text-[#0F3D2E] uppercase tracking-wider mb-1.5">
              Required Skills & Roles
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-[#2E7058] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-200 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a skill (e.g. Figma, React, Python) and press Enter"
                className="flex-1 bg-white border border-[#D9C3A5] rounded-xl px-4 py-2 text-xs text-[#17231D] focus:outline-none focus:ring-2 focus:ring-[#2E7058]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-[#2E7058] hover:bg-[#245946] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Project Type & Team Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F3D2E] uppercase tracking-wider mb-1.5">
                Project Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
                className="w-full bg-white border border-[#D9C3A5] rounded-xl px-3.5 py-2.5 text-xs text-[#0F3D2E] font-medium focus:outline-none focus:ring-2 focus:ring-[#2E7058]"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Startup">Startup</option>
                <option value="Academic">Academic</option>
                <option value="Personal">Personal</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F3D2E] uppercase tracking-wider mb-1.5">
                Team Size (Current / Max)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={currentMembers}
                  onChange={(e) => setCurrentMembers(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 bg-white border border-[#D9C3A5] rounded-xl px-3 py-2 text-xs text-center text-[#17231D]"
                />
                <span className="text-stone-500 font-bold">/</span>
                <input
                  type="number"
                  min={currentMembers}
                  max="12"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(Math.max(currentMembers, parseInt(e.target.value) || currentMembers))}
                  className="w-20 bg-white border border-[#D9C3A5] rounded-xl px-3 py-2 text-xs text-center text-[#17231D]"
                />
                <span className="text-xs text-stone-500">Members</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#D9C3A5]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-semibold text-stone-700 bg-stone-200/80 hover:bg-stone-300 rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-xs font-semibold text-white bg-[#0F3D2E] hover:bg-[#1A4B3A] rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#A3C9AB]" />
              <span>Post Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
