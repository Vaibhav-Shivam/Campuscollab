import { NextResponse } from 'next/server';
import { initialCampusEvents } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: initialCampusEvents.length,
    events: initialCampusEvents
  });
}
