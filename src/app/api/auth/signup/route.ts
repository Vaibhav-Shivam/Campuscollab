import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { findStudentByEmail, saveStudentToDB, saveUserAuth } from '@/lib/db';
import { Student } from '@/types';
import { inferSkillCategory } from '@/lib/categorize';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'campuscollab_salt_2026').digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, college, major, year, primaryRole, skills } = body;

    if (!name || !email || !password || !college) {
      return NextResponse.json(
        { success: false, error: 'Name, email, password, and college are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Check if email already registered
    const existing = await findStudentByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    const studentId = `student-${Date.now()}`;
    const passwordHash = hashPassword(password);

    // Format and intelligently categorize skills
    const parsedSkills = Array.isArray(skills) && skills.length > 0
      ? skills.map((s: string | { name: string; level: number; category: string }) => {
          const skillName = typeof s === 'string' ? s.trim() : (s?.name || '').trim();
          const skillCat = inferSkillCategory(skillName);
          return {
            name: skillName,
            level: typeof s === 'object' && s?.level ? s.level : 4,
            category: skillCat
          };
        })
      : [{ name: primaryRole ? primaryRole.trim() : 'Software Engineering', level: 4, category: inferSkillCategory(primaryRole || 'Development') }];

    const newStudent: Student = {
      id: studentId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
      college: college.trim(),
      year: year || '1st Year',
      major: major || 'Computer Science',
      primaryRole: primaryRole || 'Developer',
      bio: body.bio || 'New student on CampusCollab ready to build and collaborate.',
      status: 'available',
      skills: parsedSkills,
      projectCount: 0,
      hackathonCount: 0,
      interests: ['Projects', 'Hackathons'],
      proofs: []
    };

    // Save student profile and auth record
    await saveStudentToDB(newStudent);
    await saveUserAuth(newStudent.email, passwordHash, studentId);

    const token = Buffer.from(`${studentId}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: newStudent,
      token
    }, { status: 201 });
  } catch (error) {
    console.error('[Auth Signup Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
