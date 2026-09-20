'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ProjectType } from '@/types';
import { X, Plus, Sparkles, Wand2, ArrowUpRight } from 'lucide-react';

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
    }, 500);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newProj = await createProject({
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

      if (newProj) {
        if (onCreated) {
          onCreated(newProj.id);
        }
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-100 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border-[3px] border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden relative my-8">
        {/* Pink Header Block (Matching Gumroad style) */}
        <div className="bg-[#FF70A6] border-b-2 border-black p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-black">
              ★ CAMPUS PROJECT BOARD
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-black mt-0.5">
              Post a Project Requirement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-black hover:bg-[#FF6B6B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Based Expense Tracker"
              className="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
              required
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
              Tagline / One-Line Pitch
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Smart receipt scanner and budget companion for students"
              className="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-xs font-medium text-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          {/* Description + AI Assistant Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black text-black uppercase tracking-wider">
                Description & Vision *
              </label>
              <button
                type="button"
                onClick={handleAiExtractSkills}
                disabled={isAiParsing}
                className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-black bg-[#FFDE59] px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <Wand2 className={`w-3 h-3 ${isAiParsing ? 'animate-spin' : ''}`} />
                <span>{isAiParsing ? 'Analyzing...' : 'AI Auto-Detect'}</span>
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Explain what problem you're solving, what is currently built, and what roles you need to fill..."
              className="w-full bg-white border-2 border-black rounded-xl p-3.5 text-xs font-medium text-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
              required
            />
          </div>

          {/* Required Skills Badges */}
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
              Required Skills & Roles
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-[#FFDE59] text-black text-xs font-black px-3 py-1 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-700 cursor-pointer font-black"
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
                placeholder="Type a skill and press Enter"
                className="flex-1 bg-white border-2 border-black rounded-xl px-4 py-2 text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-black text-white hover:bg-[#FFDE59] hover:text-black px-4 py-2 rounded-xl text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Project Type & Team Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
                className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2 text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Startup">Startup</option>
                <option value="Academic">Academic</option>
                <option value="Personal">Personal</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
                Team Size (Current / Max)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={currentMembers}
                  onChange={(e) => setCurrentMembers(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-white border-2 border-black rounded-xl px-2 py-1.5 text-xs font-black text-center text-black shadow-[1.5px_1.5px_0px_0px_#000]"
                />
                <span className="text-black font-black">/</span>
                <input
                  type="number"
                  min={currentMembers}
                  max="12"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(Math.max(currentMembers, parseInt(e.target.value) || currentMembers))}
                  className="w-16 bg-white border-2 border-black rounded-xl px-2 py-1.5 text-xs font-black text-center text-black shadow-[1.5px_1.5px_0px_0px_#000]"
                />
                <span className="text-xs font-bold text-stone-600 uppercase">Members</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-black uppercase text-black bg-white hover:bg-stone-100 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-xs font-black uppercase text-white bg-black hover:bg-[#FFDE59] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Post Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
