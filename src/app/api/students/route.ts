import { NextResponse } from 'next/server';
import { fetchStudentsFromDB, saveStudentToDB } from '@/lib/db';
import { Student } from '@/types';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill')?.toLowerCase();
    const status = searchParams.get('status');
    const search = searchParams.get('q')?.toLowerCase();

    const { students, source } = await fetchStudentsFromDB();
    let results = [...students];

    if (search) {
      results = results.filter((s) => {
        const safeSkills = (s.skills || []).map((sk) =>
          typeof sk === 'string' ? sk : sk?.name || ''
        );
        const safeProofs = s.proofs || [];
        return (
          (s.name || '').toLowerCase().includes(search) ||
          (s.primaryRole || '').toLowerCase().includes(search) ||
          (s.college || '').toLowerCase().includes(search) ||
          (s.major || '').toLowerCase().includes(search) ||
          (s.bio || '').toLowerCase().includes(search) ||
          safeSkills.some((sk) => sk.toLowerCase().includes(search)) ||
          safeProofs.some((p) => (p.title || '').toLowerCase().includes(search)) ||
          (s.interests || []).some((i) => i.toLowerCase().includes(search))
        );
      });
    }

    if (skill) {
      results = results.filter((s) => {
        const safeSkills = (s.skills || []).map((sk) =>
          typeof sk === 'string' ? sk : sk?.name || ''
        );
        return safeSkills.some((sk) => sk.toLowerCase().includes(skill));
      });
    }

    if (status && status !== 'all') {
      results = results.filter((s) => (s.status || 'available').toLowerCase() === status.toLowerCase());
    }

    // PRIVACY ENFORCEMENT: Redact student email on public endpoints
    // Only disclose email to the student themselves or a platform admin
    const sanitizedResults = results.map((s) => {
      const isOwner =
        session &&
        (session.userId === s.id ||
          (session.email && (s.email || '').toLowerCase() === session.email.toLowerCase()));
      const isAdmin = session?.role === 'admin';

      if (isOwner || isAdmin) {
        return s;
      }

      // Redact private email address
      return {
        ...s,
        email: undefined
      };
    });

    return NextResponse.json({
      success: true,
      count: sanitizedResults.length,
      dataSource: source,
      students: sanitizedResults
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch students'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    const body = await request.json();
    
    if (!body.name || !body.college || !body.primaryRole) {
      return NextResponse.json({
        success: false,
        error: 'Missing required student fields (name, college, primaryRole)'
      }, { status: 400 });
    }

    const studentId = session?.userId || body.id || `student-${Date.now()}`;
    const studentEmail = session?.email || body.email || 'student@campuscollab.edu';

    const newStudent: Student = {
      id: studentId,
      name: body.name,
      avatar: body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      college: body.college,
      year: body.year || '1st Year',
      major: body.major || 'Computer Science',
      primaryRole: body.primaryRole,
      bio: body.bio || '',
      status: body.status || 'available',
      lookingForRole: body.lookingForRole,
      skills: Array.isArray(body.skills) ? body.skills : [],
      projectCount: body.projectCount || 0,
      hackathonCount: body.hackathonCount || 0,
      email: studentEmail,
      interests: Array.isArray(body.interests) ? body.interests : ['Tech'],
      proofs: Array.isArray(body.proofs) ? body.proofs : []
    };

    const saved = await saveStudentToDB(newStudent);

    return NextResponse.json({
      success: true,
      persistedToDynamoDB: saved,
      student: newStudent
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid request body'
    }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required to update profile' },
        { status: 400 }
      );
    }

    const { students } = await fetchStudentsFromDB();
    const existing = students.find((s) => s.id === id);

    // MUTATION AUTHORIZATION: Check session identity against target student
    if (session) {
      const isOwner =
        session.userId === id ||
        (session.email && existing?.email && session.email.toLowerCase() === existing.email.toLowerCase());
      const isAdmin = session.role === 'admin';

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: You can only modify your own profile' },
          { status: 403 }
        );
      }
    }

    const updatedStudent: Student = {
      ...(existing || {}),
      ...updates,
      id
    } as Student;

    const saved = await saveStudentToDB(updatedStudent);

    return NextResponse.json({
      success: true,
      message: 'Student profile updated successfully',
      persistedToDynamoDB: saved,
      student: updatedStudent
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update student profile' },
      { status: 500 }
    );
  }
}
