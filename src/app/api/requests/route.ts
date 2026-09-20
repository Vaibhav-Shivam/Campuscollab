import { NextResponse } from 'next/server';
import {
  getCollaborationRequestsFromDB,
  saveCollaborationRequestToDB,
  updateCollaborationRequestStatusInDB
} from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { CollaborationRequest } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;

    const requests = await getCollaborationRequestsFromDB(userId);
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
    const body = await request.json();

    const {
      receiverId,
      receiverName,
      projectId,
      projectTitle,
      message,
      senderName,
      senderRole,
      senderAvatar,
      contactEmail
    } = body;

    if (!receiverId || !projectId || !message) {
      return NextResponse.json(
        { success: false, error: 'Receiver, project, and message are required.' },
        { status: 400 }
      );
    }

    // Determine sender from verified session if available, else body
    const senderId = session?.userId || body.senderId || `student-${Date.now()}`;

    const newReq: CollaborationRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      senderId,
      senderName: session?.name || senderName || 'Fellow Student',
      senderAvatar: senderAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(senderId)}`,
      senderRole: senderRole || 'Developer',
      receiverId,
      receiverName: receiverName || 'Project Lead',
      projectId,
      projectTitle: projectTitle || 'Campus Project',
      message: message.trim(),
      status: 'pending',
      createdAt: 'Just now',
      contactEmail: session?.email || contactEmail
    };

    await saveCollaborationRequestToDB(newReq);

    return NextResponse.json({
      success: true,
      message: 'Collaboration request persisted in DynamoDB!',
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
    const body = await request.json();
    const { requestId, status } = body;

    if (!requestId || (status !== 'accepted' && status !== 'declined')) {
      return NextResponse.json(
        { success: false, error: 'Valid requestId and status (accepted/declined) are required.' },
        { status: 400 }
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
