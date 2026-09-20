import { NextResponse } from 'next/server';
import { getNotificationsFromDB, markNotificationReadInDB } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to view notifications' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');

    // Only admin can view other users' notifications
    const targetUserId = (session.role === 'admin' && queryUserId) ? queryUserId : session.userId;

    const notifications = await getNotificationsFromDB(targetUserId);

    return NextResponse.json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const userId = session.userId;
    await markNotificationReadInDB(notificationId, userId);

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
