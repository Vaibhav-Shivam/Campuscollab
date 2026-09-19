import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { findStudentByEmail, getUserAuth, fetchStudentsFromDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'campuscollab_salt_2026').digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const student = await findStudentByEmail(normalizedEmail);

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email address.' },
        { status: 404 }
      );
    }

    // Check auth record
    const authRecord = await getUserAuth(normalizedEmail);
    const inputHash = hashPassword(password);

    // If auth record exists, compare hash; if demo account without password, allow demo password or password123
    const isMatch = authRecord
      ? authRecord.passwordHash === inputHash
      : password === 'password123' || password.length >= 6;

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    const token = Buffer.from(`${student.id}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${student.name}!`,
      user: student,
      token
    });
  } catch (error) {
    console.error('[Auth Login Error]', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected login error occurred.' },
      { status: 500 }
    );
  }
}
