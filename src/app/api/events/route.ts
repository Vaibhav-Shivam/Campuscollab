import { NextResponse } from 'next/server';
import { fetchEventsFromDB, saveEventToDB } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { events, source } = await fetchEventsFromDB();
    return NextResponse.json({
      success: true,
      count: events.length,
      dataSource: source,
      events
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campus events' },
      { status: 500 }
    );
  }
}

import { CreateEventSchema, validateBody } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to create campus events' },
        { status: 401 }
      );
    }

    const rawBody = await request.json();
    const validation = validateBody(CreateEventSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.issues },
        { status: 400 }
      );
    }
    const body = validation.data;

    const newEvent = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      category: body.category,
      date: body.date,
      location: body.location,
      isOnline: body.isOnline,
      organizer: body.organizer || session.name || 'Campus Community',
      organizerId: session.userId,
      attendeesCount: 0,
      isRegistered: false,
      image: body.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
      skillsFocus: body.skillsFocus,
      createdAt: new Date().toISOString()
    };

    await saveEventToDB(newEvent as any);

    return NextResponse.json({
      success: true,
      message: 'Event published successfully!',
      event: newEvent
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}
