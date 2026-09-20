import { NextResponse } from 'next/server';
import { addProjectCommentToDB, getStudentById } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { ProjectComment } from '@/types';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`comment:${clientIp}`, 15, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many comments posted. Please wait a moment.' },
        { status: 429 }
      );
    }

    const resolvedParams = await params;
    const projectId = resolvedParams.id;
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const session = await getSessionFromRequest(request);
    const body = await request.json();
    const { content, offeringSkills } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment content cannot be empty' },
        { status: 400 }
      );
    }

    if (content.length > 1500) {
      return NextResponse.json(
        { success: false, error: 'Comment cannot exceed 1500 characters' },
        { status: 400 }
      );
    }

    // Determine author from authenticated session or provided author metadata
    let authorId = session?.userId || body.authorId || 'student-guest';
    let authorName = session?.name || body.authorName || 'Campus Collaborator';
    let authorAvatar = session?.avatar || body.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
    let authorRole = body.authorRole || 'Student';

    if (session?.userId && !body.authorName) {
      const student = await getStudentById(session.userId);
      if (student) {
        authorName = student.name;
        authorAvatar = student.avatar;
        authorRole = student.primaryRole;
      }
    }

    const newComment: ProjectComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorId,
      authorName,
      authorAvatar,
      authorRole,
      content: content.trim(),
      createdAt: 'Just now',
      offeringSkills: Array.isArray(offeringSkills) && offeringSkills.length > 0 ? offeringSkills : undefined
    };

    const saved = await addProjectCommentToDB(projectId, newComment);

    return NextResponse.json({
      success: true,
      persistedToDynamoDB: saved,
      comment: newComment
    }, { status: 201 });
  } catch (error: any) {
    console.error('[Comment API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to post comment' },
      { status: 500 }
    );
  }
}
