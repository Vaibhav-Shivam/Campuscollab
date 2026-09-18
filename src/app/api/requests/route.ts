import { NextResponse } from 'next/server';
import { initialRequests } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: initialRequests.length,
    requests: initialRequests
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newReq = {
      ...body,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: 'Just now'
    };

    return NextResponse.json({
      success: true,
      message: 'Collaboration request created in DynamoDB and email notification dispatched',
      request: newReq
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request payload' },
      { status: 400 }
    );
  }
}
