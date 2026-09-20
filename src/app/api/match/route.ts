import { NextResponse } from 'next/server';
import { fetchStudentsFromDB } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { Student } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * Canonical Skill Aliases and Normalization Mapping
 * Translates various natural language mentions, abbreviations, and informal terms into canonical skill names.
 */
const SKILL_SYNONYMS: Record<string, string[]> = {
  'React': ['react', 'reactjs', 'react.js', 'react frontend'],
  'Next.js': ['next', 'nextjs', 'next.js', 'next 14', 'next 15', 'next 16'],
  'TypeScript': ['ts', 'typescript', 'type script'],
  'JavaScript': ['js', 'javascript', 'es6', 'vanilla js'],
  'Node.js': ['node', 'nodejs', 'node.js', 'express', 'express.js'],
  'Python': ['python', 'python3', 'py', 'django', 'flask', 'fastapi'],
  'Tailwind CSS': ['tailwind', 'tailwindcss', 'tailwind css', 'tailwind 4'],
  'UI/UX Design': ['ui/ux', 'ui', 'ux', 'figma', 'wireframe', 'prototyping', 'product design', 'user experience'],
  'Machine Learning / AI': ['machine learning', 'ml', 'ai', 'deep learning', 'pytorch', 'tensorflow', 'llm', 'nlp'],
  'PostgreSQL / SQL': ['postgres', 'postgresql', 'sql', 'mysql', 'prisma', 'relational database'],
  'MongoDB / NoSQL': ['mongodb', 'mongo', 'nosql', 'mongoose'],
  'Docker & DevOps': ['docker', 'kubernetes', 'k8s', 'ci/cd', 'devops', 'aws', 'cloud'],
  'Flutter / Mobile': ['flutter', 'dart', 'react native', 'rn', 'ios', 'android', 'swift', 'kotlin'],
  'Web3 / Solidity': ['web3', 'solidity', 'smart contracts', 'ethereum', 'crypto', 'blockchain'],
  'Rust / Systems': ['rust', 'c++', 'cplusplus', 'golang', 'go']
};

const ROLE_PATTERNS: Record<string, string[]> = {
  'Frontend Developer': ['frontend', 'front-end', 'ui developer', 'web design', 'client-side'],
  'Backend Developer': ['backend', 'back-end', 'api', 'server', 'database', 'microservices'],
  'Full Stack Developer': ['fullstack', 'full stack', 'full-stack', 'end-to-end', 'mern'],
  'UI/UX Designer': ['designer', 'ui/ux designer', 'product designer', 'figma designer'],
  'AI / ML Engineer': ['ai engineer', 'ml engineer', 'data scientist', 'machine learning engineer'],
  'Mobile Developer': ['mobile developer', 'app developer', 'flutter developer', 'ios developer', 'android developer']
};

/**
 * Normalizes input text and extracts canonical skills
 */
function extractSkills(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const extracted: string[] = [];

  for (const [canonical, keywords] of Object.entries(SKILL_SYNONYMS)) {
    if (keywords.some((k) => lower.includes(k))) {
      extracted.push(canonical);
    }
  }

  return extracted;
}

/**
 * Extracts target roles from project prompt
 */
function extractRoles(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const extracted: string[] = [];

  for (const [role, keywords] of Object.entries(ROLE_PATTERNS)) {
    if (keywords.some((k) => lower.includes(k))) {
      extracted.push(role);
    }
  }

  return extracted;
}

/**
 * Normalizes student skills to canonical forms for symmetric matching
 */
function normalizeStudentSkills(skills: any[]): string[] {
  const normalized: Set<string> = new Set();
  const rawSkillNames = skills.map((s) => (typeof s === 'string' ? s : s?.name || '').toLowerCase());

  for (const raw of rawSkillNames) {
    let matchedCanonical = false;
    for (const [canonical, aliases] of Object.entries(SKILL_SYNONYMS)) {
      if (aliases.some((alias) => raw.includes(alias) || alias.includes(raw))) {
        normalized.add(canonical);
        matchedCanonical = true;
        break;
      }
    }
    if (!matchedCanonical && raw.length > 0) {
      normalized.add(raw);
    }
  }

  return Array.from(normalized);
}

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
        { success: false, error: 'Project description or requirements prompt is required.' },
        { status: 400 }
      );
    }

    // 1. Semantic Skill & Role Extraction
    const detectedSkills = extractSkills(prompt);
    const targetSkills = detectedSkills.length > 0 ? detectedSkills : ['React', 'UI/UX Design', 'Node.js'];
    const detectedRoles = extractRoles(prompt);

    // 2. Candidate Retrieval from Live Database (Real Registered Students Only)
    const { students } = await fetchStudentsFromDB();

    // 3. Transparent Heuristic Scoring (Audit Item #21)
    const matches = students
      .map((student: Student) => {
        const studentCanonicalSkills = normalizeStudentSkills(student.skills || []);

        // Skill overlap
        const matchedSkills = targetSkills.filter((req) =>
          studentCanonicalSkills.some(
            (sk) => sk.toLowerCase() === req.toLowerCase() || sk.toLowerCase().includes(req.toLowerCase())
          )
        );
        const missingSkills = targetSkills.filter((req) => !matchedSkills.includes(req));

        // Role alignment
        const roleMatch = detectedRoles.some((r) =>
          (student.primaryRole || '').toLowerCase().includes(r.toLowerCase())
        );

        // Score Breakdown (0-100 total)
        // Skill Fit (0-50 pts): Proportional to matched required skills
        const skillRatio = targetSkills.length > 0 ? matchedSkills.length / targetSkills.length : 0.5;
        const skillFit = Math.round(skillRatio * 50);

        // Role Fit (0-20 pts): Direct target role match
        const roleFit = roleMatch ? 20 : (detectedRoles.length === 0 ? 10 : 0);

        // Availability Fit (0-15 pts): Actively available for collaboration
        const availabilityFit = student.status === 'available' ? 15 : 5;

        // Project Proofs Fit (0-15 pts): Demonstrable portfolio evidence
        const proofCount = student.proofs?.length || 0;
        const projectProofFit = Math.min(15, proofCount * 5);

        const totalScore = Math.min(99, skillFit + roleFit + availabilityFit + projectProofFit);

        // Categorize into honest confidence tiers (Audit Item #21)
        let confidenceTier: 'Strong Match' | 'Good Match' | 'Potential Fit' = 'Potential Fit';
        if (totalScore >= 75) {
          confidenceTier = 'Strong Match';
        } else if (totalScore >= 50) {
          confidenceTier = 'Good Match';
        }

        // Transparent explanation factors
        const reasons: string[] = [];
        if (matchedSkills.length > 0) {
          reasons.push(`✓ Skills: Matched ${matchedSkills.slice(0, 3).join(', ')}`);
        }
        if (roleMatch) {
          reasons.push(`✓ Role: Aligns with ${student.primaryRole}`);
        }
        if (student.status === 'available') {
          reasons.push('✓ Availability: Actively available for new collaborations');
        }
        if (proofCount > 0) {
          reasons.push(`✓ Portfolio: ${proofCount} verified project proof${proofCount > 1 ? 's' : ''}`);
        }

        return {
          student,
          matchScore: totalScore,
          confidenceTier,
          scoreBreakdown: {
            skillFit,
            roleFit,
            availabilityFit,
            projectProofFit
          },
          matchedSkills,
          missingSkills,
          reasons
        };
      })
      .filter((m) => m.matchScore >= 25)
      .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      service: 'CampusCollab Semantic Teammate Matcher',
      inputPrompt: prompt,
      extractedRequirements: {
        skills: targetSkills,
        targetRoles: detectedRoles
      },
      topMatches: matches
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process matching query' },
      { status: 500 }
    );
  }
}
