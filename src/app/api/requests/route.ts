import { NextResponse } from 'next/server';
import {
  getCollaborationRequestsFromDB,
  saveCollaborationRequestToDB,
  getCollaborationRequestByIdFromDB,
  updateCollaborationRequestStatusInDB,
  getStudentById,
  getProjectById,
  saveProjectToDB
} from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { CollaborationRequest, ProjectMember } from '@/types';
import { CollaborationRequestSchema, RespondRequestSchema, validateBody } from '@/lib/schemas';

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

    const rawBody = await request.json();
    const validation = validateBody(CollaborationRequestSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.issues },
        { status: 400 }
      );
    }
    const body = validation.data;

    // Prevent self-collaboration requests
    if (body.receiverId === session.userId) {
      return NextResponse.json(
        { success: false, error: 'You cannot send a collaboration request to yourself.' },
        { status: 400 }
      );
    }

    // Verify target project exists
    const project = await getProjectById(body.projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found.' },
        { status: 404 }
      );
    }

    // Check if project owner is attempting to apply
    if (project.ownerId === session.userId) {
      return NextResponse.json(
        { success: false, error: 'You are the owner of this project and already lead the team.' },
        { status: 400 }
      );
    }

    // Check if project is closed for applications (Audit Item #19)
    if (!project.isOpen || project.status === 'closed') {
      return NextResponse.json(
        { success: false, error: 'This project is currently closed to new applications.' },
        { status: 400 }
      );
    }

    // Check if project team is at maximum capacity (Audit Item #18 & #19)
    const currentMembers = project.currentMembers || project.members?.length || 1;
    if (currentMembers >= project.maxMembers) {
      return NextResponse.json(
        { success: false, error: 'This project team has reached its maximum capacity.' },
        { status: 400 }
      );
    }

    // Check if the user is already a project member (Audit Item #18 & #19)
    if (project.members?.some((m) => m.userId === session.userId)) {
      return NextResponse.json(
        { success: false, error: 'You are already an active team member of this project.' },
        { status: 400 }
      );
    }

    // Prevent duplicate pending or accepted applications (Audit Item #19)
    const userRequests = await getCollaborationRequestsFromDB(session.userId);
    const existingActiveRequest = userRequests.find(
      (r) =>
        r.senderId === session.userId &&
        r.projectId === body.projectId &&
        (r.status === 'pending' || r.status === 'accepted')
    );
    if (existingActiveRequest) {
      const msg =
        existingActiveRequest.status === 'pending'
          ? 'You already have a pending collaboration request for this project.'
          : 'You have already been accepted to this project team.';
      return NextResponse.json({ success: false, error: msg }, { status: 409 });
    }

    // Determine sender identity strictly from verified session and student record
    const senderStudent = await getStudentById(session.userId);
    const senderId = session.userId;
    const senderName = senderStudent?.name || session.name || 'Campus Student';
    const senderAvatar = senderStudent?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(senderId)}`;
    const senderRole = body.requestedRole || senderStudent?.primaryRole || 'Developer';

    const newReq: CollaborationRequest = {
      id: crypto.randomUUID(),
      senderId,
      senderName,
      senderAvatar,
      senderRole,
      receiverId: body.receiverId,
      receiverName: body.receiverName || project.ownerName || 'Project Lead',
      projectId: body.projectId,
      projectTitle: body.projectTitle || project.title || 'Campus Project',
      message: body.message,
      requestedRole: body.requestedRole || senderRole,
      status: 'pending',
      createdAt: new Date().toISOString(),
      contactEmail: session.email || body.contactEmail
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

    const rawBody = await request.json();
    const validation = validateBody(RespondRequestSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.issues },
        { status: 400 }
      );
    }
    const { requestId, status } = validation.data;

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

    // Lifecycle enforcement on acceptance: Auto-add to team roster and verify team capacity (Audit Items #18 & #19)
    if (status === 'accepted') {
      const project = await getProjectById(existingReq.projectId);
      if (project) {
        const members = project.members || [
          {
            userId: project.ownerId,
            name: project.ownerName,
            avatar: project.ownerAvatar,
            role: 'Owner / Lead',
            joinedAt: project.createdAt || new Date().toISOString()
          }
        ];

        // Check if team is full
        if (members.length >= project.maxMembers) {
          return NextResponse.json(
            { success: false, error: 'Cannot accept request: Project team has reached maximum capacity.' },
            { status: 400 }
          );
        }

        // Add member if not already present
        const alreadyMember = members.some((m) => m.userId === existingReq.senderId);
        if (!alreadyMember) {
          const newMember: ProjectMember = {
            userId: existingReq.senderId,
            name: existingReq.senderName,
            avatar: existingReq.senderAvatar,
            role: existingReq.requestedRole || existingReq.senderRole || 'Collaborator',
            joinedAt: new Date().toISOString()
          };
          project.members = [...members, newMember];
          project.currentMembers = project.members.length;

          // If capacity reached, auto-close project applications
          if (project.currentMembers >= project.maxMembers) {
            project.isOpen = false;
            project.status = 'closed';
          }
          await saveProjectToDB(project);
        }
      }
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
      message: `Collaboration request marked as ${status}.${status === 'accepted' ? ' Applicant added to project team.' : ''}`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update request' },
      { status: 500 }
    );
  }
}
