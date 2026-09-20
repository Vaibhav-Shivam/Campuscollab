import { NextResponse } from 'next/server';
import { fetchStudentsFromDB } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const CANONICAL_SKILLS = [
  'python', 'react', 'next.js', 'typescript', 'javascript', 'ui/ux', 'figma',
  'machine learning', 'ai', 'deep learning', 'pytorch', 'tensorflow',
  'fastapi', 'tailwind css', 'node.js', 'express', 'aws', 'docker', 'kubernetes',
  'postgresql', 'mongodb', 'graphql', 'flutter', 'react native', 'solidity',
  'web3', 'cybersecurity', 'video editing', 'motion design', 'rust', 'go', 'c++'
];

const ROLE_KEYWORDS: Record<string, string[]> = {
  'Frontend Developer': ['frontend', 'react', 'next.js', 'ui', 'css', 'tailwind', 'vue', 'web design'],
  'Backend Developer': ['backend', 'api', 'server', 'database', 'node', 'fastapi', 'python', 'sql', 'microservices'],
  'Full Stack Developer': ['fullstack', 'full stack', 'mern', 'next.js', 'end-to-end', 'full-stack'],
  'UI/UX Designer': ['design', 'figma', 'ui/ux', 'prototype', 'user experience', 'wireframe'],
  'AI / ML Engineer': ['machine learning', 'ai', 'data science', 'deep learning', 'model', 'llm', 'nlp', 'pytorch'],
  'Mobile App Developer': ['mobile', 'flutter', 'react native', 'android', 'ios', 'swift', 'kotlin']
};

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`match:${clientIp}`, 20, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many matching queries. Please wait a moment.' },
        { status: 429 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project description prompt is required' },
        { status: 400 }
      );
    }

    const lower = prompt.toLowerCase();

    // 1. Skill Extraction
    const detectedNeeded = CANONICAL_SKILLS.filter((s) => lower.includes(s));
    const targetSkills = detectedNeeded.length > 0 ? detectedNeeded : ['react', 'ui/ux', 'figma'];

    // 2. Role Extraction
    const detectedRoles: string[] = [];
    for (const [role, keywords] of Object.entries(ROLE_KEYWORDS)) {
      if (keywords.some((k) => lower.includes(k))) {
        detectedRoles.push(role);
      }
    }

    // 3. Candidate Retrieval from Live Database
    const { students } = await fetchStudentsFromDB();

    // 4. Semantic Ranking & Explanation Generation
    const ranked = students
      .map((student) => {
        const studentSkillNames = (student.skills || []).map((sk) =>
          (typeof sk === 'string' ? sk : sk?.name || '').toLowerCase()
        );

        const matched = targetSkills.filter((req) =>
          studentSkillNames.some((sk) => sk.includes(req) || req.includes(sk))
        );

        const missing = targetSkills.filter((req) => !matched.includes(req));

        const roleMatch = detectedRoles.some((r) =>
          (student.primaryRole || '').toLowerCase().includes(r.toLowerCase())
        );

        // Scoring signals
        const skillRatio = targetSkills.length > 0 ? (matched.length / targetSkills.length) * 55 : 20;
        const roleBonus = roleMatch ? 15 : 0;
        const availBonus = student.status === 'available' ? 20 : 5;
        const proofBonus = Math.min((student.proofs?.length || 0) * 5, 10);
        const totalScore = Math.min(99, Math.round(skillRatio + roleBonus + availBonus + proofBonus));

        // Generate explainable match insights
        const reasons: string[] = [];
        if (matched.length > 0) {
          reasons.push(`✓ Skilled in ${matched.slice(0, 3).join(', ')}`);
        }
        if (roleMatch) {
          reasons.push(`✓ Matches target role (${student.primaryRole})`);
        }
        if (student.status === 'available') {
          reasons.push('✓ Available for new projects');
        }
        if ((student.proofs?.length || 0) > 0) {
          reasons.push(`✓ Has ${student.proofs.length} verified project proof${student.proofs.length > 1 ? 's' : ''}`);
        }

        return {
          studentId: student.id,
          name: student.name,
          role: student.primaryRole,
          college: student.college,
          avatar: student.avatar,
          matchScore: totalScore,
          matchedSkills: matched,
          missingSkills: missing,
          availability: student.status,
          proofCount: student.proofs?.length || 0,
          reasons
        };
      })
      .filter((m) => m.matchScore >= 25)
      .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      service: 'CampusCollab Semantic Teammate Matcher v2',
      inputPrompt: prompt,
      extractedRequirements: {
        skills: targetSkills,
        targetRoles: detectedRoles
      },
      topMatches: ranked
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process matching request' },
      { status: 500 }
    );
  }
}
