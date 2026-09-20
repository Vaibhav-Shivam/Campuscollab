import { NextResponse } from 'next/server';
import { toggleEventRegistrationInDB } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`rsvp:${clientIp}`, 20, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many RSVP requests. Please slow down.' },
        { status: 429 }
      );
    }

    const resolvedParams = await params;
    const eventId = resolvedParams.id;
    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const session = await getSessionFromRequest(request);
    let userId = session?.userId;

    if (!userId) {
      try {
        const body = await request.json();
        userId = body.userId;
      } catch {}
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication or user identity required to RSVP' },
        { status: 401 }
      );
    }

    const result = await toggleEventRegistrationInDB(eventId, userId);

    return NextResponse.json({
      success: true,
      eventId,
      userId,
      isRegistered: result.isRegistered,
      message: result.isRegistered ? 'Successfully registered for event! 🎟️' : 'RSVP cancelled'
    });
  } catch (error: any) {
    console.error('[RSVP API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event registration' },
      { status: 500 }
    );
  }
}
