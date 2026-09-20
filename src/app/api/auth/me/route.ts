import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { getStudentById, findStudentByEmail } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({
        authenticated: false,
        session: null,
        user: null,
        student: null,
        role: null,
        isAdmin: false
      }, { status: 401 });
    }

    let student = await getStudentById(session.userId);
    if (!student && session.email) {
      student = await findStudentByEmail(session.email);
    }

    return NextResponse.json({
      authenticated: true,
      session: {
        userId: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
        college: session.college
      },
      user: student,
      student: student,
      role: session.role,
      isAdmin: session.role === 'admin'
    });
  } catch (err) {
    return NextResponse.json({
      authenticated: false,
      session: null,
      user: null,
      student: null,
      role: null,
      isAdmin: false
    }, { status: 500 });
  }
}
