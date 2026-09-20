import { NextResponse } from 'next/server';
import { getStudentById } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await context.params;
    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const student = await getStudentById(studentId);
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student profile not found' },
        { status: 404 }
      );
    }

    const session = await getSessionFromRequest(request);
    const isOwner =
      session &&
      (session.userId === student.id ||
        (session.email && (student.email || '').toLowerCase() === session.email.toLowerCase()));
    const isAdmin = session?.role === 'admin';

    // Redact email if not owner or admin
    const sanitizedStudent = isOwner || isAdmin
      ? student
      : { ...student, email: undefined };

    return NextResponse.json({
      success: true,
      student: sanitizedStudent
    });
  } catch (error: any) {
    console.error('[API /api/students/[id]] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student profile' },
      { status: 500 }
    );
  }
}
