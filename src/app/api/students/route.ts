import { NextResponse } from 'next/server';
import { initialStudents } from '@/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skill = searchParams.get('skill')?.toLowerCase();
  const status = searchParams.get('status');

  let results = [...initialStudents];

  if (skill) {
    results = results.filter((s) =>
      s.skills.some((sk) => sk.name.toLowerCase().includes(skill))
    );
  }

  if (status && status !== 'all') {
    results = results.filter((s) => s.status === status);
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    students: results
  });
}
