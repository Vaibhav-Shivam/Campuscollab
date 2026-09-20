import { NextResponse } from 'next/server';
import { saveReportToDB, getReportsFromDB, updateReportStatusInDB } from '@/lib/db';
import { getSessionFromRequest, isUserAdmin } from '@/lib/auth';
import { Report } from '@/types';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    const isAdmin = session?.role === 'admin' || (session?.email && isUserAdmin(session.email));

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const reports = await getReportsFromDB();
    return NextResponse.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`report:${clientIp}`, 5, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many reports submitted. Please wait.' },
        { status: 429 }
      );
    }

    const session = await getSessionFromRequest(request);
    const body = await request.json();
    const { targetType, targetId, reason, details } = body;

    if (!targetType || !targetId || !reason) {
      return NextResponse.json(
        { success: false, error: 'targetType, targetId, and reason are required' },
        { status: 400 }
      );
    }

    const newReport: Report = {
      id: `report-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      reporterId: session?.userId || 'anonymous-reporter',
      targetType,
      targetId,
      reason: String(reason).trim(),
      details: details ? String(details).trim() : undefined,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await saveReportToDB(newReport);

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully. Our safety team will review it.',
      reportId: newReport.id
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    const isAdmin = session?.role === 'admin' || (session?.email && isUserAdmin(session.email));

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { reportId, status } = body;

    if (!reportId || !['resolved', 'dismissed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid reportId and status (resolved | dismissed) are required' },
        { status: 400 }
      );
    }

    await updateReportStatusInDB(reportId, status);

    return NextResponse.json({
      success: true,
      message: `Report status updated to ${status}`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update report status' },
      { status: 500 }
    );
  }
}
