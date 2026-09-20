import { NextResponse } from 'next/server';
import { fetchProjectsFromDB, saveProjectToDB } from '@/lib/db';
import { Project } from '@/types';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('q')?.toLowerCase();

    const { projects, source } = await fetchProjectsFromDB();
    let results = [...projects];

    if (search) {
      results = results.filter((p) =>
        p.title.toLowerCase().includes(search) ||
        p.tagline.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.requiredSkills.some((s) => s.toLowerCase().includes(search))
      );
    }

    if (type && type !== 'all') {
      results = results.filter((p) => p.type.toLowerCase() === type.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      dataSource: source,
      projects: results
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch projects'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    const body = await request.json();

    if (!body.title || !body.description) {
      return NextResponse.json({
        success: false,
        error: 'Title and description are required'
      }, { status: 400 });
    }

    // Server-verified identity: use authenticated session when available
    const ownerId = session?.userId || body.ownerId || 'student-1789820112921';
    const ownerName = session?.name || body.ownerName || 'Project Lead';
    const ownerCollege = session?.college || body.ownerCollege || 'College Campus';

    const newProject: Project = {
      id: body.id || `project-${Date.now()}`,
      title: body.title,
      tagline: body.tagline || body.title,
      description: body.description,
      type: body.type || 'Hackathon',
      ownerId,
      ownerName,
      ownerAvatar: body.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      ownerCollege,
      createdAt: 'Just now',
      requiredSkills: Array.isArray(body.requiredSkills) ? body.requiredSkills : [],
      currentMembers: body.currentMembers || 1,
      maxMembers: body.maxMembers || 4,
      isOpen: body.isOpen !== undefined ? body.isOpen : true,
      likesCount: 0,
      comments: [],
      tags: Array.isArray(body.tags) ? body.tags : []
    };

    const saved = await saveProjectToDB(newProject);

    return NextResponse.json({
      success: true,
      persistedToDynamoDB: saved,
      project: newProject
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload' },
      { status: 400 }
    );
  }
}
