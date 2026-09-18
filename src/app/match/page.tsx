'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import StudentCard from '@/components/StudentCard';
import CollabRequestModal from '@/components/CollabRequestModal';
import { Student, AIMatchResult } from '@/types';
import {
  Sparkles,
  Wand2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Send,
  Zap,
  Cpu,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function AIMatchingStudioPage() {
  const { runSmartMatch, allStudents } = useApp();

  const defaultPrompt =
    "I'm building an AI-based expense tracker. I know Python but need someone for UI/UX and React.";

  const [promptText, setPromptText] = useState(defaultPrompt);
  const [hasRun, setHasRun] = useState(true);
  const [matchData, setMatchData] = useState(() => runSmartMatch(defaultPrompt));
  const [selectedStudentForCollab, setSelectedStudentForCollab] = useState<Student | null>(null);

  const samplePrompts = [
    "I'm building an AI-based expense tracker. I know Python but need someone for UI/UX and React.",
    "Participating in the AWS Hackathon. We have backend Python/AWS but need a frontend Next.js builder and video editor for pitch demo.",
    "Designing a campus bicycle sharing app. Need someone proficient in React, interactive maps, and Figma prototyping."
  ];

  const handleRunMatch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;
    const result = runSmartMatch(promptText.trim());
    setMatchData(result);
    setHasRun(true);
  };

  const handleSelectSample = (sample: string) => {
    setPromptText(sample);
    const result = runSmartMatch(sample);
    setMatchData(result);
    setHasRun(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E6] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#0F3D2E] text-[#A3C9AB] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#A3C9AB]" />
            <span>AWS Bedrock / AI Matching Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#0F3D2E] tracking-tight">
            AI Teammate Matcher
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Describe your project naturally. Our AI extracts available and needed skills, matches portfolio proofs, and recommends the highest-fit student collaborators.
          </p>
        </div>

        {/* AI Input Form Card (Deep Green Editorial Styling) */}
        <div className="bg-[#0F3D2E] text-white rounded-3xl p-6 sm:p-8 md:p-10 border border-[#2E7058] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2E7058]/20 rounded-full blur-3xl pointer-events-none"></div>

          <form onSubmit={handleRunMatch} className="relative space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#A3C9AB] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A3C9AB]" />
                Describe Your Project & Who You Need
              </label>
              <span className="text-[11px] text-stone-300 hidden sm:inline">
                Powered by Natural Language Skill Extraction
              </span>
            </div>

            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={3}
              placeholder="e.g. I'm building an AI expense tracker. I know Python and Machine Learning, but need a UI/UX designer and a React frontend engineer..."
              className="w-full bg-[#1A4B3A] border border-[#2E7058] rounded-2xl p-4 text-sm text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#A3C9AB] leading-relaxed"
              required
            />

            {/* Starter Prompt Presets */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-[#D9C3A5]">
                Try a sample requirement:
              </div>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="text-left text-xs bg-[#174636] hover:bg-[#205744] text-stone-200 border border-[#2E7058] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer max-w-full truncate"
                  >
                    &ldquo;{sample.slice(0, 60)}...&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#D9C3A5] hover:bg-[#CBB08E] text-[#17231D] font-bold text-xs sm:text-sm px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Wand2 className="w-4 h-4 text-[#0F3D2E]" />
                <span>Analyze & Find Matches</span>
              </button>
            </div>
          </form>
        </div>

        {/* AI Extraction Decomposition Strip */}
        {hasRun && (
          <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#2E7058]" />
                <h3 className="text-base font-bold text-[#0F3D2E]">
                  AI Requirement Analysis Breakdown
                </h3>
              </div>
              <span className="text-xs font-semibold text-stone-500 bg-[#F5F1E6] px-3 py-1 rounded-full">
                Semantic Match
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Already Available Skills */}
              <div className="bg-[#FAF7F0] border border-[#D9C3A5] rounded-2xl p-4 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B6F47] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  Skills You Have (Already Available)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchData.availableSkills.length > 0 ? (
                    matchData.availableSkills.map((sk) => (
                      <span
                        key={sk}
                        className="bg-[#10B981]/15 text-[#065F46] border border-[#10B981]/30 font-semibold px-2.5 py-1 rounded-lg"
                      >
                        ✓ {sk.toUpperCase()}
                      </span>
                    ))
                  ) : (
                    <span className="text-stone-400 italic">
                      None explicitly flagged as already built
                    </span>
                  )}
                </div>
              </div>

              {/* Needed Skills */}
              <div className="bg-[#FAF7F0] border border-[#D9C3A5] rounded-2xl p-4 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B6F47] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#EA580C]" />
                  Skills You Need (Teammates Targeted)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchData.neededSkills.map((sk) => (
                    <span
                      key={sk}
                      className="bg-[#EA580C]/10 text-[#C2410C] border border-[#EA580C]/30 font-semibold px-2.5 py-1 rounded-lg"
                    >
                      ✗ {sk.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Candidates Ranked List */}
        {hasRun && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-2xl font-bold text-[#0F3D2E]">
                  Recommended Collaborators
                </h3>
                <p className="text-xs text-stone-500">
                  Ranked by required skill alignment, portfolio proof, and current availability status.
                </p>
              </div>
              <span className="text-xs font-bold text-[#2E7058]">
                {matchData.matches.length} Candidates Scored
              </span>
            </div>

            <div className="space-y-6">
              {matchData.matches.map((matchItem) => (
                <div
                  key={matchItem.student.id}
                  className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  {/* Student Basic Info */}
                  <div className="flex items-start gap-4 sm:w-1/3 min-w-[280px]">
                    <img
                      src={matchItem.student.avatar}
                      alt={matchItem.student.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#E8E2D5]"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg text-[#0F3D2E]">
                          {matchItem.student.name}
                        </h4>
                      </div>
                      <div className="text-xs font-semibold text-[#8B6F47]">
                        {matchItem.student.primaryRole}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {matchItem.student.college}
                      </div>
                      <div className="pt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#065F46] border border-[#10B981]/30">
                          {matchItem.student.status === 'available'
                            ? '🟢 Available for Projects'
                            : '🟠 Looking for Teammates'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Why Recommended Reason Box */}
                  <div className="flex-1 bg-[#F5F1E6] rounded-2xl p-4 border border-[#E8E2D5] space-y-2 text-xs w-full lg:w-auto">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#0F3D2E] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#2E7058]" />
                      Why Recommended:
                    </div>
                    <ul className="space-y-1 text-stone-700">
                      {matchItem.reasons.map((reason, rIdx) => (
                        <li key={rIdx} className="flex items-center gap-2">
                          <span className="text-[#2E7058] font-bold">✓</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Match Score Gauge & Connect CTA */}
                  <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 w-full lg:w-44 border-t lg:border-t-0 lg:border-l border-stone-100 pt-4 lg:pt-0 lg:pl-6">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#0F3D2E]">
                        {matchItem.matchScore}%
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8B6F47]">
                        Match Fit
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedStudentForCollab(matchItem.student)}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#2E7058] hover:bg-[#245946] text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Send className="w-3 h-3 text-[#A3C9AB]" />
                      <span>Send Request</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedStudentForCollab && (
        <CollabRequestModal
          targetStudent={selectedStudentForCollab}
          onClose={() => setSelectedStudentForCollab(null)}
        />
      )}
    </div>
  );
}
