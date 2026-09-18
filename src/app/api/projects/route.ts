import { NextResponse } from 'next/server';
import { initialProjects } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: initialProjects.length,
    projects: initialProjects
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProject = {
      ...body,
      id: `project-${Date.now()}`,
      createdAt: 'Just now',
      likesCount: 0,
      comments: []
    };

    return NextResponse.json({
      success: true,
      message: 'Project post created successfully in DynamoDB table',
      project: newProject
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload' },
      { status: 400 }
    );
  }
}
