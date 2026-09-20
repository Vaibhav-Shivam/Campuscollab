import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { getStudentById, findStudentByEmail } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    let student = await getStudentById(session.userId);
    if (!student && session.email) {
      student = await findStudentByEmail(session.email);
    }

    return NextResponse.json({
      authenticated: true,
      user: student,
      role: session.role,
      isAdmin: session.role === 'admin'
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
