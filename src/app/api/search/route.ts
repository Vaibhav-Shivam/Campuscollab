import { NextResponse } from 'next/server';
import { fetchStudentsFromDB, fetchProjectsFromDB } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * DynamoDB Production Access Patterns Documentation (Audit Item #13 & #20):
 *
 * Secondary Indexes (GSIs):
 * 1. GSI_College:
 *    - GSI1PK: `COLLEGE#<collegeName>`
 *    - GSI1SK: `STUDENT#<studentId>` or `PROJECT#<projectId>`
 *    - Query operation: `QueryCommand({ IndexName: 'GSI_College', KeyConditionExpression: 'GSI1PK = :col' })`
 *
 * 2. GSI_Status:
 *    - GSI2PK: `STATUS#<available|looking|open|closed>`
 *    - GSI2SK: `TIMESTAMP#<isoString>`
 *    - Query operation: `QueryCommand({ IndexName: 'GSI_Status', KeyConditionExpression: 'GSI2PK = :st' })`
 *
 * 3. GSI_CollaborationRequests:
 *    - GSI1PK: `RECEIVER#<userId>` / GSI1SK: `CREATED#<timestamp>`
 *    - GSI2PK: `SENDER#<userId>`   / GSI2SK: `CREATED#<timestamp>`
 */

export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`search:${clientIp}`, 40, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many search requests. Please slow down.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const type = (searchParams.get('type') || 'all').toLowerCase();
    const skillsParam = searchParams.get('skills');
    const targetSkills = skillsParam
      ? skillsParam
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : [];
    const college = (searchParams.get('college') || '').trim().toLowerCase();
    const role = (searchParams.get('role') || '').trim().toLowerCase();
    const availability = (searchParams.get('availability') || '').trim().toLowerCase();

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    let filteredStudents: any[] = [];
    let filteredProjects: any[] = [];

    // Search Students
    if (type === 'all' || type === 'students') {
      const { students } = await fetchStudentsFromDB();
      filteredStudents = students.filter((student) => {
        // Query text match
        if (q) {
          const matchName = (student.name || '').toLowerCase().includes(q);
          const matchBio = (student.bio || '').toLowerCase().includes(q);
          const matchRole = (student.primaryRole || '').toLowerCase().includes(q);
          const matchCollege = (student.college || '').toLowerCase().includes(q);
          const matchMajor = (student.major || '').toLowerCase().includes(q);
          const matchSkills = (student.skills || []).some((s) => {
            const name = typeof s === 'string' ? s : s?.name || '';
            return name.toLowerCase().includes(q);
          });
          if (!matchName && !matchBio && !matchRole && !matchCollege && !matchMajor && !matchSkills) {
            return false;
          }
        }

        // Skills filter
        if (targetSkills.length > 0) {
          const studentSkillNames = (student.skills || []).map((s) =>
            (typeof s === 'string' ? s : s?.name || '').toLowerCase()
          );
          const hasSkill = targetSkills.some((ts) =>
            studentSkillNames.some((sk) => sk.includes(ts) || ts.includes(sk))
          );
          if (!hasSkill) return false;
        }

        // College filter
        if (college && !(student.college || '').toLowerCase().includes(college)) {
          return false;
        }

        // Role filter
        if (role && !(student.primaryRole || '').toLowerCase().includes(role)) {
          return false;
        }

        // Availability filter
        if (availability && student.status !== availability) {
          return false;
        }

        return true;
      });
    }

    // Search Projects
    if (type === 'all' || type === 'projects') {
      const { projects } = await fetchProjectsFromDB();
      filteredProjects = projects.filter((project) => {
        // Query text match
        if (q) {
          const matchTitle = (project.title || '').toLowerCase().includes(q);
          const matchTagline = (project.tagline || '').toLowerCase().includes(q);
          const matchDesc = (project.description || '').toLowerCase().includes(q);
          const matchSkills = (project.requiredSkills || []).some((s) =>
            s.toLowerCase().includes(q)
          );
          const matchTags = (project.tags || []).some((t) =>
            t.toLowerCase().includes(q)
          );
          if (!matchTitle && !matchTagline && !matchDesc && !matchSkills && !matchTags) {
            return false;
          }
        }

        // Skills filter
        if (targetSkills.length > 0) {
          const projectSkillNames = (project.requiredSkills || []).map((s) => s.toLowerCase());
          const hasSkill = targetSkills.some((ts) =>
            projectSkillNames.some((sk) => sk.includes(ts) || ts.includes(sk))
          );
          if (!hasSkill) return false;
        }

        // College filter
        if (college && !(project.ownerCollege || '').toLowerCase().includes(college)) {
          return false;
        }

        return true;
      });
    }

    // Pagination
    const totalStudents = filteredStudents.length;
    const totalProjects = filteredProjects.length;
    const startIndex = (page - 1) * limit;
    const paginatedStudents = filteredStudents.slice(startIndex, startIndex + limit);
    const paginatedProjects = filteredProjects.slice(startIndex, startIndex + limit);

    const totalCount = type === 'students' ? totalStudents : type === 'projects' ? totalProjects : totalStudents + totalProjects;
    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json({
      success: true,
      query: {
        q,
        type,
        skills: targetSkills,
        college,
        role,
        availability,
        page,
        limit
      },
      counts: {
        totalStudents,
        totalProjects,
        totalResults: totalCount
      },
      pagination: {
        page,
        limit,
        totalPages,
        hasMore: page < totalPages
      },
      students: paginatedStudents,
      projects: paginatedProjects
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Search failed' },
      { status: 500 }
    );
  }
}
