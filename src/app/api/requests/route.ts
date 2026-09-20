import { NextResponse } from 'next/server';
import {
  getCollaborationRequestsFromDB,
  saveCollaborationRequestToDB,
  getCollaborationRequestByIdFromDB,
  updateCollaborationRequestStatusInDB,
  getStudentById
} from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { CollaborationRequest } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to view requests.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');

    // Admin can view any user's requests; standard students can only view their own
    let targetUserId = session.userId;
    if (session.role === 'admin' && queryUserId) {
      targetUserId = queryUserId;
    }

    const requests = await getCollaborationRequestsFromDB(targetUserId);
    return NextResponse.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch requests.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to send collaboration requests.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      receiverId,
      receiverName,
      projectId,
      projectTitle,
      message,
      contactEmail
    } = body;

    if (!receiverId || !projectId || !message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Receiver ID, project ID, and message content are required.' },
        { status: 400 }
      );
    }

    // Prevent self-collaboration requests
    if (receiverId === session.userId) {
      return NextResponse.json(
        { success: false, error: 'You cannot send a collaboration request to yourself.' },
        { status: 400 }
      );
    }

    // Determine sender identity strictly from verified session and student record
    const senderStudent = await getStudentById(session.userId);
    const senderId = session.userId;
    const senderName = senderStudent?.name || session.name || 'Campus Student';
    const senderAvatar = senderStudent?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(senderId)}`;
    const senderRole = senderStudent?.primaryRole || 'Developer';

    const newReq: CollaborationRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderId,
      senderName,
      senderAvatar,
      senderRole,
      receiverId,
      receiverName: receiverName || 'Project Lead',
      projectId,
      projectTitle: projectTitle || 'Campus Project',
      message: message.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      contactEmail: session.email || contactEmail
    };

    await saveCollaborationRequestToDB(newReq);

    return NextResponse.json({
      success: true,
      message: 'Collaboration request sent successfully!',
      request: newReq
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Invalid request payload' },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { requestId, status } = body;

    if (!requestId || (status !== 'accepted' && status !== 'declined')) {
      return NextResponse.json(
        { success: false, error: 'Valid requestId and status (accepted/declined) are required.' },
        { status: 400 }
      );
    }

    // Strict ownership verification: only the recipient (or admin) can accept/decline
    const existingReq = await getCollaborationRequestByIdFromDB(requestId);
    if (!existingReq) {
      return NextResponse.json(
        { success: false, error: 'Collaboration request not found.' },
        { status: 404 }
      );
    }

    if (existingReq.receiverId !== session.userId && session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'You are not authorized to respond to this collaboration request.' },
        { status: 403 }
      );
    }

    const updated = await updateCollaborationRequestStatusInDB(requestId, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Could not update request status.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Collaboration request marked as ${status}.`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update request' },
      { status: 500 }
    );
  }
}
