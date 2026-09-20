import { NextResponse } from 'next/server';
import { addProjectCommentToDB, getStudentById } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { ProjectComment } from '@/types';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { CreateCommentSchema, validateBody } from '@/lib/schemas';

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

    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to post comments.' },
        { status: 401 }
      );
    }

    const rawBody = await request.json();
    const validation = validateBody(CreateCommentSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.issues },
        { status: 400 }
      );
    }
    const { content, offeringSkills } = validation.data;

    // Determine author strictly from verified session and student database profile
    const student = await getStudentById(session.userId);
    const authorId = session.userId;
    const authorName = student?.name || session.name || 'Campus Student';
    const authorAvatar = student?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(session.userId)}`;
    const authorRole = student?.primaryRole || 'Developer';

    const newComment: ProjectComment = {
      id: crypto.randomUUID(),
      authorId,
      authorName,
      authorAvatar,
      authorRole,
      content,
      createdAt: new Date().toISOString(),
      offeringSkills: offeringSkills && offeringSkills.length > 0 ? offeringSkills : undefined
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
