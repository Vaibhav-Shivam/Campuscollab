import { NextResponse } from 'next/server';
import { findStudentByEmail, saveStudentToDB, saveUserAuth } from '@/lib/db';
import { Student } from '@/types';
import { inferSkillCategory } from '@/lib/categorize';
import { hashPassword, signJWT, SESSION_COOKIE_NAME, isUserAdmin } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { SignupSchema, validateBody } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`signup:${clientIp}`, 8, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: `Too many registration attempts. Please wait ${rateCheck.resetSeconds}s.` },
        { status: 429 }
      );
    }

    const rawBody = await request.json();
    const validation = validateBody(SignupSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.issues },
        { status: 400 }
      );
    }
    const body = validation.data;
    const { name, email, password, college, major, year, primaryRole, skills } = body;

    const normalizedEmail = email.toLowerCase();

    // Check if email already registered
    const existing = await findStudentByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    const studentId = crypto.randomUUID();
    // Modern scrypt salted password hash
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
      email: normalizedEmail,
      avatar: (body.avatar && typeof body.avatar === 'string' && body.avatar.trim()) 
        ? body.avatar.trim() 
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
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
    await saveUserAuth(newStudent.email, passwordHash, studentId, newStudent);

    const isAdmin = isUserAdmin(newStudent.email);
    const role = isAdmin ? 'admin' : 'student';

    // Sign cryptographic HMAC-SHA256 JWT
    const token = signJWT({
      userId: studentId,
      email: newStudent.email,
      name: newStudent.name,
      role,
      college: newStudent.college
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: newStudent,
      token,
      role,
      isAdmin
    }, { status: 201 });

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60
    });

    return response;
  } catch (error) {
    console.error('[Auth Signup Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
