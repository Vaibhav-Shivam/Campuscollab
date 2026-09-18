'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import CollabRequestModal from '@/components/CollabRequestModal';
import { Student } from '@/types';
import {
  Wand2,
  CheckCircle2,
  AlertCircle,
  Send,
  Cpu,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function AIMatchingStudioPage() {
  const { runSmartMatch } = useApp();

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
    <div className="min-h-screen bg-[#FAF8F5] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#9B87F5] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-black" />
            <span>AI MATCHING ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight">
            AI Teammate Matcher
          </h1>
          <p className="text-sm font-semibold text-stone-700 leading-relaxed">
            Describe your project naturally. Our AI extracts available and needed skills, matches portfolio proofs, and scores the best campus collaborators.
          </p>
        </div>

        {/* AI Input Form Card (Neo-Brutalist White & Yellow block) */}
        <div className="bg-white border-[2.5px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="bg-[#FFDE59] border-b-2 border-black p-4 sm:p-5 flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <span>★</span> Describe Your Project & Roles Needed
            </label>
            <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#FFDE59] px-2 py-0.5 rounded-md hidden sm:inline">
              Bedrock NLP Extraction
            </span>
          </div>

          <form onSubmit={handleRunMatch} className="p-6 sm:p-8 space-y-4">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={3}
              placeholder="e.g. I'm building an AI expense tracker. I know Python and ML, but need a UI/UX designer and a React developer..."
              className="w-full bg-[#FAF8F5] border-2 border-black rounded-xl p-4 text-xs sm:text-sm text-black font-bold focus:outline-none shadow-[3px_3px_0px_0px_#000] placeholder:text-stone-400"
              required
            />

            {/* Starter Prompt Presets */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-black uppercase tracking-wider text-black">
                Try a sample requirement:
              </div>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="text-left text-xs bg-white hover:bg-[#FFDE59] text-black font-bold border-2 border-black px-3.5 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer max-w-full truncate"
                  >
                    &ldquo;{sample.slice(0, 65)}...&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-black hover:bg-[#FF70A6] hover:text-black text-white font-black text-xs sm:text-sm uppercase tracking-wider px-7 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                <span>Analyze & Find Matches ↗</span>
              </button>
            </div>
          </form>
        </div>

        {/* AI Extraction Decomposition Strip */}
        {hasRun && (
          <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-7 shadow-[5px_5px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-black" />
                <h3 className="text-base font-black uppercase text-black">
                  AI Requirement Analysis Breakdown
                </h3>
              </div>
              <span className="text-[11px] font-black uppercase bg-[#9B87F5] text-black px-2.5 py-0.5 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                Decomposed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              {/* Already Available Skills */}
              <div className="bg-[#FAF8F5] border-2 border-black rounded-xl p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                <div className="text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                  Skills You Have (Already Available)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchData.availableSkills.length > 0 ? (
                    matchData.availableSkills.map((sk) => (
                      <span
                        key={sk}
                        className="bg-[#38E54D] text-black border border-black font-black uppercase px-2.5 py-1 rounded-md shadow-[1px_1px_0px_0px_#000]"
                      >
                        ✓ {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-stone-500 font-medium italic">
                      None explicitly flagged as already built
                    </span>
                  )}
                </div>
              </div>

              {/* Needed Skills */}
              <div className="bg-[#FAF8F5] border-2 border-black rounded-xl p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                <div className="text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-black" />
                  Skills You Need (Teammates Targeted)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchData.neededSkills.map((sk) => (
                    <span
                      key={sk}
                      className="bg-[#FF6B6B] text-black border border-black font-black uppercase px-2.5 py-1 rounded-md shadow-[1px_1px_0px_0px_#000]"
                    >
                      ✗ {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Candidates Ranked List */}
        {hasRun && (
          <div className="space-y-5">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-black">
                  Recommended Collaborators
                </h3>
                <p className="text-xs font-semibold text-stone-600">
                  Ranked by required skill alignment, portfolio proof, and current availability status.
                </p>
              </div>
              <span className="text-xs font-black uppercase bg-[#FFDE59] text-black px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                {matchData.matches.length} Candidates Scored
              </span>
            </div>

            <div className="space-y-4">
              {matchData.matches.map((matchItem) => (
                <div
                  key={matchItem.student.id}
                  className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#000] transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  {/* Student Basic Info */}
                  <div className="flex items-start gap-4 sm:w-1/3 min-w-[280px]">
                    <img
                      src={matchItem.student.avatar}
                      alt={matchItem.student.name}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000]"
                    />
                    <div className="space-y-1">
                      <h4 className="font-black text-lg text-black uppercase tracking-tight">
                        {matchItem.student.name}
                      </h4>
                      <div className="text-xs font-black uppercase bg-[#FFDE59] text-black px-2 py-0.5 rounded-md border border-black inline-block">
                        {matchItem.student.primaryRole}
                      </div>
                      <div className="text-[11px] text-stone-600 font-bold truncate">
                        {matchItem.student.college}
                      </div>
                      <div className="pt-0.5">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#4FD1C5] text-black border border-black">
                          {matchItem.student.status === 'available'
                            ? '🟢 Available'
                            : '🟠 Looking'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Why Recommended Reason Box */}
                  <div className="flex-1 bg-[#FAF8F5] rounded-xl p-4 border-2 border-black space-y-1.5 text-xs font-bold w-full lg:w-auto shadow-[2px_2px_0px_0px_#000]">
                    <div className="text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1">
                      <span>★</span> WHY RECOMMENDED:
                    </div>
                    <ul className="space-y-1 text-stone-800">
                      {matchItem.reasons.map((reason, rIdx) => (
                        <li key={rIdx} className="flex items-center gap-2">
                          <span className="font-black text-black">✓</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Match Score & CTA */}
                  <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 w-full lg:w-44 border-t-2 lg:border-t-0 lg:border-l-2 border-black pt-4 lg:pt-0 lg:pl-6">
                    <div className="text-center">
                      <div className="text-3xl font-black text-black tracking-tight">
                        {matchItem.matchScore}%
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-stone-600">
                        Match Score
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedStudentForCollab(matchItem.student)}
                      className="inline-flex items-center justify-center gap-1 bg-[#FFDE59] hover:bg-[#FF70A6] text-black font-black text-xs uppercase px-4 py-2 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
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
