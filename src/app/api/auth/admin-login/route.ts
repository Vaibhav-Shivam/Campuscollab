import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { signJWT, SESSION_COOKIE_NAME } from '@/lib/auth';
import { findStudentByEmail, getStudentById } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`admin-login:${clientIp}`, 5, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: `Too many attempts. Please wait ${rateCheck.resetSeconds}s.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { passkey } = body;

    if (!passkey || typeof passkey !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Administrator passkey is required.' },
        { status: 400 }
      );
    }

    const configuredPasskey = process.env.ADMIN_PASSKEY;
    if (!configuredPasskey || configuredPasskey.trim().length === 0) {
      console.error('[Admin Auth] ADMIN_PASSKEY is not configured in server environment.');
      return NextResponse.json(
        { success: false, error: 'Administrator authentication is not configured on this server.' },
        { status: 503 }
      );
    }

    const trimmedInput = passkey.trim();
    const targetPasskey = configuredPasskey.trim();

    // Constant-time comparison to prevent timing attacks
    let isValid = false;
    if (trimmedInput.length === targetPasskey.length) {
      isValid = crypto.timingSafeEqual(Buffer.from(trimmedInput), Buffer.from(targetPasskey));
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid Administrator Passkey.' },
        { status: 401 }
      );
    }

    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    if (!adminEmail) {
      return NextResponse.json(
        { success: false, error: 'Administrator email is not configured on this server.' },
        { status: 503 }
      );
    }

    // Look up or construct the Admin user
    let adminUser = await findStudentByEmail(adminEmail);

    const studentId = adminUser?.id || 'student-1789820112921';
    const name = adminUser?.name || 'Vaibhav Shivam';

    if (!adminUser) {
      adminUser = {
        id: studentId,
        name,
        email: adminEmail,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        college: 'National Institute of Technology',
        year: 'Lead Administrator',
        major: 'Computer Science & Engineering',
        primaryRole: 'Platform Administrator',
        bio: 'Founder and Platform Administrator of CampusCollab.',
        status: 'available',
        skills: [
          { name: 'Full-Stack Engineering', level: 5, category: 'Development' },
          { name: 'System Architecture', level: 5, category: 'Development' },
          { name: 'AWS Cloud', level: 5, category: 'Development' }
        ],
        projectCount: 2,
        hackathonCount: 4,
        interests: ['System Design', 'AI Applications', 'Campus Community'],
        proofs: []
      };
    }

    // Sign a real cryptographic JWT with role: 'admin'
    const token = signJWT({
      userId: studentId,
      email: adminEmail,
      name,
      role: 'admin',
      college: adminUser?.college || 'Platform Administration'
    });

    const response = NextResponse.json({
      success: true,
      message: 'Admin access verified successfully 👑',
      token,
      user: adminUser,
      isAdmin: true
    });

    // Set secure HttpOnly session cookie
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
  } catch (error: any) {
    console.error('[Admin Auth Error]', error);
    return NextResponse.json(
      { success: false, error: 'Server authentication error.' },
      { status: 500 }
    );
  }
}
