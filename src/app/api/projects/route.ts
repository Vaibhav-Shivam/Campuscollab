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

import { CreateProjectSchema, validateBody } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !session.userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required to post a project.'
      }, { status: 401 });
    }

    const rawBody = await request.json();
    const validation = validateBody(CreateProjectSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.issues },
        { status: 400 }
      );
    }
    const body = validation.data;

    // Server-verified identity: use authenticated session strictly
    const ownerId = session.userId;
    const ownerName = session.name || 'Project Lead';
    const ownerCollege = session.college || 'Campus';
    const ownerAvatar = body.ownerAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(ownerId)}`;
    const nowIso = new Date().toISOString();

    const newProject: Project = {
      id: body.id || crypto.randomUUID(),
      title: body.title,
      tagline: body.tagline || body.title,
      description: body.description,
      type: body.type || 'Hackathon',
      ownerId,
      ownerName,
      ownerAvatar,
      ownerCollege,
      createdAt: nowIso,
      requiredSkills: body.requiredSkills,
      currentMembers: 1,
      maxMembers: body.maxMembers ?? 4,
      isOpen: body.isOpen !== false,
      status: body.isOpen !== false ? 'open' : 'closed',
      likesCount: 0,
      comments: [],
      tags: body.tags || [],
      rolesNeeded: body.rolesNeeded || [],
      members: [
        {
          userId: ownerId,
          name: ownerName,
          avatar: ownerAvatar,
          role: 'Owner / Lead',
          joinedAt: nowIso
        }
      ]
    };

    const saved = await saveProjectToDB(newProject);

    return NextResponse.json({
      success: true,
      persistedToDynamoDB: saved,
      project: newProject
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Invalid payload' },
      { status: 400 }
    );
  }
}
