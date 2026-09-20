import { NextResponse } from 'next/server';
import { findStudentByEmail, getUserAuth, getStudentById, saveStudentToDB, updateUserPassword } from '@/lib/db';
import { Student } from '@/types';
import { verifyPassword, hashPassword, needsPasswordRehash, signJWT, SESSION_COOKIE_NAME, isUserAdmin } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const rateCheck = checkRateLimit(`login:${clientIp}:${normalizedEmail}`, 10, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: `Too many login attempts. Please wait ${rateCheck.resetSeconds}s before trying again.` },
        { status: 429 }
      );
    }

    // 1. Dual-check: Look up student profile AND auth record
    let student = await findStudentByEmail(normalizedEmail);
    const authRecord = await getUserAuth(normalizedEmail);

    if (!authRecord || !authRecord.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 2. Verify password with scrypt + legacy SHA-256 fallback (no password bypass)
    const isMatch = verifyPassword(password, authRecord.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Upgrade legacy SHA-256 to modern scrypt on successful login
    if (needsPasswordRehash(authRecord.passwordHash)) {
      try {
        const modernHash = hashPassword(password);
        await updateUserPassword(normalizedEmail, modernHash);
      } catch (rehashErr) {
        console.warn('[Auth] Failed to auto-upgrade password hash to scrypt:', rehashErr);
      }
    }

    // 3. If student profile is missing from disk/scan but auth record exists, restore it!
    if (!student && authRecord) {
      if (authRecord.student) {
        student = authRecord.student;
      } else if (authRecord.studentId) {
        student = await getStudentById(authRecord.studentId);
      }

      if (!student) {
        student = {
          id: authRecord.studentId || `student-${Date.now()}`,
          name: authRecord.name || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
          college: authRecord.college || 'Engineering College',
          year: '1st Year',
          major: 'Computer Science',
          primaryRole: 'Developer',
          bio: 'Campus collaborator ready to build.',
          status: 'available',
          skills: [{ name: 'Development', level: 4, category: 'Development' }],
          projectCount: 0,
          hackathonCount: 0,
          interests: ['Projects', 'Hackathons'],
          proofs: []
        };
      }
      await saveStudentToDB(student);
    }

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Could not load student profile. Please try logging in again.' },
        { status: 500 }
      );
    }

    const isAdmin = isUserAdmin(student.email);
    const role = isAdmin ? 'admin' : 'student';

    // 4. Generate cryptographically signed HMAC-SHA256 JWT
    const token = signJWT({
      userId: student.id,
      email: student.email,
      name: student.name,
      role,
      college: student.college
    });

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${student.name}!`,
      user: student,
      token,
      role,
      isAdmin
    });

    // 5. Set secure HttpOnly cookie
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
    console.error('[Auth Login Error]', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected login error occurred.' },
      { status: 500 }
    );
  }
}
