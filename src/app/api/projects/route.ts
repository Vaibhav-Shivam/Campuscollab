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
    const session = getSessionFromRequest(request);
    if (!session || !session.userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required to post a project.'
      }, { status: 401 });
    }

    const body = await request.json();

    if (!body.title || !body.description || typeof body.title !== 'string' || typeof body.description !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Valid title and description are required'
      }, { status: 400 });
    }

    // Server-verified identity: use authenticated session strictly
    const ownerId = session.userId;
    const ownerName = session.name || 'Project Lead';
    const ownerCollege = session.college || 'Campus';
    const ownerAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(ownerId)}`;

    const newProject: Project = {
      id: body.id || `project-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: body.title.trim(),
      tagline: (body.tagline || body.title).trim(),
      description: body.description.trim(),
      type: body.type || 'Hackathon',
      ownerId,
      ownerName,
      ownerAvatar: body.ownerAvatar || ownerAvatar,
      ownerCollege,
      createdAt: new Date().toISOString(),
      requiredSkills: Array.isArray(body.requiredSkills) ? body.requiredSkills : [],
      currentMembers: Math.max(1, Number(body.currentMembers) || 1),
      maxMembers: Math.max(1, Number(body.maxMembers) || 4),
      isOpen: body.isOpen !== undefined ? Boolean(body.isOpen) : true,
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
