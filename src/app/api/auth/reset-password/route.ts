import { NextResponse } from 'next/server';
import { findStudentByEmail, getUserAuth, updateUserPassword } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { ResetPasswordSchema, validateBody } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`reset-pwd:${clientIp}`, 5, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: `Too many password reset attempts. Please wait ${rateCheck.resetSeconds}s.` },
        { status: 429 }
      );
    }

    const rawBody = await request.json();
    const validation = validateBody(ResetPasswordSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.issues },
        { status: 400 }
      );
    }
    const { email, newPassword } = validation.data;
    const normalizedEmail = email.toLowerCase();

    // Check if account exists
    const [student, auth] = await Promise.all([
      findStudentByEmail(normalizedEmail),
      getUserAuth(normalizedEmail)
    ]);

    if (!student && !auth) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email address.' },
        { status: 404 }
      );
    }

    const newHash = hashPassword(newPassword);
    const updated = await updateUserPassword(normalizedEmail, newHash);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Could not reset password. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.'
    });
  } catch (error: any) {
    console.error('[Reset Password Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred during password reset.' },
      { status: 500 }
    );
  }
}
