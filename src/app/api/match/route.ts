import { NextResponse } from 'next/server';
import { initialStudents } from '@/data/mockData';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt string is required' },
        { status: 400 }
      );
    }

    const lower = prompt.toLowerCase();
    const knownSkills = [
      'python', 'react', 'ui/ux', 'figma', 'machine learning', 'fastapi',
      'next.js', 'typescript', 'tailwind css', 'node.js', 'aws', 'video editing'
    ];

    const detectedNeeded = knownSkills.filter((s) => lower.includes(s));
    const targetSkills = detectedNeeded.length > 0 ? detectedNeeded : ['react', 'ui/ux', 'figma'];

    const ranked = initialStudents.map((student) => {
      const studentSkillNames = student.skills.map((sk) => sk.name.toLowerCase());
      const matched = targetSkills.filter((req) =>
        studentSkillNames.some((sk) => sk.includes(req) || req.includes(sk))
      );

      const skillRatio = targetSkills.length > 0 ? (matched.length / targetSkills.length) * 60 : 30;
      const availBonus = student.status === 'available' ? 25 : 10;
      const proofBonus = Math.min(student.proofs.length * 5, 15);
      const totalScore = Math.min(98, Math.round(skillRatio + availBonus + proofBonus));

      return {
        studentId: student.id,
        name: student.name,
        role: student.primaryRole,
        matchScore: totalScore,
        matchedSkills: matched,
        availability: student.status,
        proofCount: student.proofs.length
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      service: 'AWS Bedrock / Titan AI Simulation',
      inputPrompt: prompt,
      extractedRequirements: targetSkills,
      topMatches: ranked
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process matching request' },
      { status: 500 }
    );
  }
}
