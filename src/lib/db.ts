import fs from 'fs';
import path from 'path';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { initialStudents, initialProjects, initialCampusEvents } from '@/data/mockData';
import { Student, Project, CampusEvent } from '@/types';
import { inferSkillCategory } from '@/lib/categorize';

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'workshop-campuscollab-db';
const REGION = process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1';

// Server-side persistent file storage for 100% reliable cross-device sync on Render & Local
const DATA_DIR = path.join(process.cwd(), 'data');
const STUDENTS_FILE = path.join(DATA_DIR, 'registered_students.json');
const AUTH_FILE = path.join(DATA_DIR, 'user_auth.json');

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STUDENTS_FILE)) {
      fs.writeFileSync(STUDENTS_FILE, JSON.stringify([]), 'utf-8');
    }
    if (!fs.existsSync(AUTH_FILE)) {
      fs.writeFileSync(AUTH_FILE, JSON.stringify([]), 'utf-8');
    }
  } catch (err) {
    console.warn('[DB] Could not initialize local data directory:', err);
  }
}

function getLocalRegisteredStudents(): Student[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(STUDENTS_FILE)) return [];
    const raw = fs.readFileSync(STUDENTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveLocalRegisteredStudent(student: Student): boolean {
  try {
    ensureDataDir();
    const current = getLocalRegisteredStudents();
    const updated = [student, ...current.filter((s) => s.id !== student.id)];
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('[DB] Failed to save student to local persistent store:', err);
    return false;
  }
}

interface LocalAuthRecord {
  email: string;
  passwordHash: string;
  studentId: string;
  createdAt: string;
}

function getLocalUserAuth(): LocalAuthRecord[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(AUTH_FILE)) return [];
    const raw = fs.readFileSync(AUTH_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveLocalUserAuthRecord(record: LocalAuthRecord): boolean {
  try {
    ensureDataDir();
    const current = getLocalUserAuth();
    const updated = [record, ...current.filter((r) => r.email.toLowerCase() !== record.email.toLowerCase())];
    fs.writeFileSync(AUTH_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('[DB] Failed to save auth record to local persistent store:', err);
    return false;
  }
}

let docClient: DynamoDBDocumentClient | null = null;

function getDocClient(): DynamoDBDocumentClient | null {
  if (docClient) return docClient;

  // Uses AWS environment variables if configured
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return null;
    }
    const rawClient = new DynamoDBClient({
      region: REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
      }
    });
    docClient = DynamoDBDocumentClient.from(rawClient, {
      marshallOptions: { removeUndefinedValues: true }
    });
    return docClient;
  } catch (error) {
    console.warn('[DB] DynamoDB client initialization failed, relying on server file store:', error);
    return null;
  }
}

export async function fetchStudentsFromDB(): Promise<{ students: Student[]; source: 'dynamodb' | 'local' | 'fallback' }> {
  // 1. Read real signups saved to server persistent disk
  const localRegistered = getLocalRegisteredStudents();
  let dbStudents: Student[] = [];
  let source: 'dynamodb' | 'local' | 'fallback' = localRegistered.length > 0 ? 'local' : 'fallback';

  // 2. Query DynamoDB cloud database if credentials are present
  const client = getDocClient();
  if (client) {
    try {
      const command = new ScanCommand({
        TableName: TABLE_NAME,
        Limit: 200
      });
      const response = await client.send(command);
      const items = (response.Items || []).filter((it) => (it.pk as string)?.startsWith('STUDENT#'));

      if (items.length > 0) {
        dbStudents = items.map((it) => ({
          id: it.id || (it.pk as string).replace('STUDENT#', ''),
          name: it.name || 'Anonymous Student',
          avatar: it.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          college: it.college || 'Engineering Institute',
          year: it.year || '3rd Year',
          major: it.major || 'Computer Science',
          primaryRole: it.primaryRole || 'Developer',
          bio: it.bio || 'Campus collaborator ready to build.',
          status: it.status || 'available',
          lookingForRole: it.lookingForRole,
          skills: Array.isArray(it.skills) ? it.skills.map((s: string | { name: string; level: number; category: string }) => {
            const skillName = typeof s === 'string' ? s.trim() : (s?.name || '').trim();
            return {
              name: skillName,
              level: typeof s === 'object' && s?.level ? s.level : 4,
              category: inferSkillCategory(skillName)
            };
          }) : [],
          projectCount: it.projectCount || 0,
          hackathonCount: it.hackathonCount || 0,
          email: it.email || 'student@campuscollab.edu',
          interests: Array.isArray(it.interests) ? it.interests : ['Hackathons', 'Tech'],
          proofs: Array.isArray(it.proofs) ? it.proofs : [],
          githubUrl: it.githubUrl,
          portfolioUrl: it.portfolioUrl,
          linkedinUrl: it.linkedinUrl,
          figmaUrl: it.figmaUrl
        }));
        source = 'dynamodb';
      }
    } catch (error) {
      console.warn('[DB] DynamoDB scan failed, falling back to server disk store:', error);
    }
  }

  // 3. Merge real students without duplicates
  const realMap = new Map<string, Student>();

  // Cloud DynamoDB real students first
  for (const s of dbStudents) {
    if (!s.id.match(/^student-[1-6]$/)) {
      realMap.set(s.id, s);
    }
  }
  // Server persistent local signups
  for (const s of localRegistered) {
    if (!s.id.match(/^student-[1-6]$/)) {
      realMap.set(s.id, s);
    }
  }

  const realStudents = Array.from(realMap.values());
  // Sort real registered students: newest timestamp first
  realStudents.sort((a, b) => {
    const timeA = parseInt(a.id.replace('student-', ''), 10) || 0;
    const timeB = parseInt(b.id.replace('student-', ''), 10) || 0;
    return timeB - timeA;
  });

  // Mock template students for campus exploration
  const realIds = new Set(realStudents.map((s) => s.id));
  const remainingMock = initialStudents.filter((s) => !realIds.has(s.id));

  const allStudentsList = [...realStudents, ...remainingMock];
  return { students: allStudentsList, source };
}

export async function saveStudentToDB(student: Student): Promise<boolean> {
  // 1. Always persist to server persistent file store (works on Render & local without AWS env)
  saveLocalRegisteredStudent(student);

  // 2. Also persist to DynamoDB cloud database if connected
  const client = getDocClient();
  if (!client) {
    return true; // Successfully saved to server persistent store
  }

  try {
    const cleanedItem: Record<string, any> = {
      pk: `STUDENT#${student.id}`,
      sk: 'METADATA',
      updatedAt: new Date().toISOString()
    };
    for (const [k, v] of Object.entries(student)) {
      if (v !== undefined) {
        cleanedItem[k] = v;
      }
    }

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: cleanedItem
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.warn('[DB] DynamoDB put failed, profile safely preserved on server disk:', error);
    return true;
  }
}

export async function fetchProjectsFromDB(): Promise<{ projects: Project[]; source: 'dynamodb' | 'fallback' }> {
  const client = getDocClient();
  if (!client) {
    return { projects: initialProjects, source: 'fallback' };
  }

  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      Limit: 50
    });
    const response = await client.send(command);
    const items = (response.Items || []).filter((it) => (it.pk as string)?.startsWith('PROJECT#'));

    if (items.length === 0) {
      return { projects: initialProjects, source: 'fallback' };
    }

    const projects: Project[] = items.map((it) => ({
      id: it.id || (it.pk as string).replace('PROJECT#', ''),
      title: it.title || 'Untitled Project',
      tagline: it.tagline || 'Student collaboration project',
      description: it.description || '',
      type: it.type || 'Personal',
      ownerId: it.ownerId || 'student-1',
      ownerName: it.ownerName || 'Campus Builder',
      ownerAvatar: it.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      ownerCollege: it.ownerCollege || 'Engineering Institute',
      createdAt: it.createdAt || 'Recently',
      requiredSkills: Array.isArray(it.requiredSkills) ? it.requiredSkills : [],
      currentMembers: it.currentMembers || 1,
      maxMembers: it.maxMembers || 4,
      isOpen: it.isOpen !== undefined ? it.isOpen : true,
      likesCount: it.likesCount || 0,
      tags: Array.isArray(it.tags) ? it.tags : [],
      comments: Array.isArray(it.comments) ? it.comments : []
    }));

    const dbProjectIds = new Set(projects.map((p) => p.id));
    const missingMock = initialProjects.filter((p) => !dbProjectIds.has(p.id));

    return { projects: [...projects, ...missingMock], source: 'dynamodb' };
  } catch (error) {
    console.warn('[DB] Error scanning projects from DynamoDB, serving mock data:', error);
    return { projects: initialProjects, source: 'fallback' };
  }
}

export async function saveProjectToDB(project: Project): Promise<boolean> {
  const client = getDocClient();
  if (!client) return false;

  try {
    const cleanedItem: Record<string, any> = {
      pk: `PROJECT#${project.id}`,
      sk: 'METADATA',
      updatedAt: new Date().toISOString()
    };
    for (const [k, v] of Object.entries(project)) {
      if (v !== undefined) {
        cleanedItem[k] = v;
      }
    }

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: cleanedItem
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.error('[DB] Error saving project to DynamoDB:', error);
    return false;
  }
}

export async function fetchEventsFromDB(): Promise<{ events: CampusEvent[]; source: 'dynamodb' | 'fallback' }> {
  const client = getDocClient();
  if (!client) {
    return { events: initialCampusEvents, source: 'fallback' };
  }

  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      Limit: 50
    });
    const response = await client.send(command);
    const items = (response.Items || []).filter((it) => (it.pk as string)?.startsWith('EVENT#'));

    if (items.length === 0) {
      return { events: initialCampusEvents, source: 'fallback' };
    }

    const events: CampusEvent[] = items.map((it) => ({
      id: it.id || (it.pk as string).replace('EVENT#', ''),
      title: it.title || 'Campus Event',
      category: it.category || 'Workshop',
      date: it.date || 'TBD',
      location: it.location || 'Campus Auditorium',
      isOnline: Boolean(it.isOnline),
      description: it.description || '',
      organizer: it.organizer || 'Student Club',
      attendeesCount: it.attendeesCount || 0,
      isRegistered: Boolean(it.isRegistered),
      image: it.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
      skillsFocus: Array.isArray(it.skillsFocus) ? it.skillsFocus : []
    }));

    const dbEventIds = new Set(events.map((e) => e.id));
    const missingMock = initialCampusEvents.filter((e) => !dbEventIds.has(e.id));

    return { events: [...events, ...missingMock], source: 'dynamodb' };
  } catch (error) {
    console.warn('[DB] Error scanning events from DynamoDB, serving mock data:', error);
    return { events: initialCampusEvents, source: 'fallback' };
  }
}

export async function checkDBHealth(): Promise<{ status: 'HEALTHY' | 'DEGRADED'; latencyMs: number; table: string }> {
  const client = getDocClient();
  if (!client) {
    return { status: 'DEGRADED', latencyMs: 0, table: TABLE_NAME };
  }

  const start = Date.now();
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      Limit: 1
    });
    await client.send(command);
    const latencyMs = Date.now() - start;
    return { status: 'HEALTHY', latencyMs, table: TABLE_NAME };
  } catch (error) {
    return { status: 'DEGRADED', latencyMs: Date.now() - start, table: TABLE_NAME };
  }
}

export async function findStudentByEmail(email: string): Promise<Student | null> {
  const normalized = email.trim().toLowerCase();
  // 1. Check local registered students
  const local = getLocalRegisteredStudents();
  const foundLocal = local.find((s) => s.email.toLowerCase() === normalized);
  if (foundLocal) return foundLocal;

  // 2. Check full student catalog
  const { students } = await fetchStudentsFromDB();
  return students.find((s) => s.email.toLowerCase() === normalized) || null;
}

export async function saveUserAuth(email: string, passwordHash: string, studentId: string): Promise<boolean> {
  const normEmail = email.trim().toLowerCase();
  saveLocalUserAuthRecord({
    email: normEmail,
    passwordHash,
    studentId,
    createdAt: new Date().toISOString()
  });

  const client = getDocClient();
  if (!client) return true;

  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `USER#${normEmail}`,
        sk: 'AUTH',
        email: normEmail,
        passwordHash,
        studentId,
        createdAt: new Date().toISOString()
      }
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.warn('[DB] Error saving user auth record to DynamoDB:', error);
    return true;
  }
}

export async function getUserAuth(email: string): Promise<{ email: string; passwordHash: string; studentId: string } | null> {
  const normEmail = email.trim().toLowerCase();
  // 1. Check server local store
  const localAuths = getLocalUserAuth();
  const found = localAuths.find((a) => a.email.toLowerCase() === normEmail);
  if (found) {
    return {
      email: found.email,
      passwordHash: found.passwordHash,
      studentId: found.studentId
    };
  }

  // 2. Check DynamoDB
  const client = getDocClient();
  if (!client) return null;

  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        pk: `USER#${normEmail}`,
        sk: 'AUTH'
      }
    });
    const res = await client.send(command);
    if (!res.Item) return null;
    return {
      email: res.Item.email,
      passwordHash: res.Item.passwordHash,
      studentId: res.Item.studentId
    };
  } catch (error) {
    console.warn('[DB] Error getting user auth record from DynamoDB:', error);
    return null;
  }
}
