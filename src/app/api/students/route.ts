import { NextResponse } from 'next/server';
import { fetchStudentsFromDB, saveStudentToDB } from '@/lib/db';
import { Student } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill')?.toLowerCase();
    const status = searchParams.get('status');
    const search = searchParams.get('q')?.toLowerCase();

    const { students, source } = await fetchStudentsFromDB();
    let results = [...students];

    if (search) {
      results = results.filter((s) =>
        s.name.toLowerCase().includes(search) ||
        s.primaryRole.toLowerCase().includes(search) ||
        s.college.toLowerCase().includes(search) ||
        s.skills.some((sk) => sk.name.toLowerCase().includes(search))
      );
    }

    if (skill) {
      results = results.filter((s) =>
        s.skills.some((sk) => sk.name.toLowerCase().includes(skill))
      );
    }

    if (status && status !== 'all') {
      results = results.filter((s) => s.status === status);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      dataSource: source,
      students: results
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
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
    const body = await request.json();
    
    if (!body.name || !body.college || !body.primaryRole) {
      return NextResponse.json({
        success: false,
        error: 'Missing required student fields (name, college, primaryRole)'
      }, { status: 400 });
    }

    const newStudent: Student = {
      id: body.id || `student-${Date.now()}`,
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
      email: body.email || 'student@campuscollab.edu',
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

