import { NextResponse } from 'next/server';
import { fetchEventsFromDB } from '@/lib/db';

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
