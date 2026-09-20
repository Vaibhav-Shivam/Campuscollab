import fs from 'fs';
import path from 'path';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { initialStudents, initialProjects, initialCampusEvents, initialRequests } from '@/data/mockData';
import { Student, Project, CampusEvent, CollaborationRequest, ProjectComment, AppNotification, Report } from '@/types';
import { inferSkillCategory } from '@/lib/categorize';

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'workshop-campuscollab-db';
const REGION = process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1';

// Server-side multi-tier persistent storage: Primary cwd/data, Backup /tmp, and Global in-memory
const PRIMARY_DATA_DIR = path.join(process.cwd(), 'data');
const BACKUP_DATA_DIR = '/tmp/campuscollab_data';

const PRIMARY_STUDENTS_FILE = path.join(PRIMARY_DATA_DIR, 'registered_students.json');
const BACKUP_STUDENTS_FILE = path.join(BACKUP_DATA_DIR, 'registered_students.json');

const PRIMARY_AUTH_FILE = path.join(PRIMARY_DATA_DIR, 'user_auth.json');
const BACKUP_AUTH_FILE = path.join(BACKUP_DATA_DIR, 'user_auth.json');

const PRIMARY_PROJECTS_FILE = path.join(PRIMARY_DATA_DIR, 'projects.json');
const BACKUP_PROJECTS_FILE = path.join(BACKUP_DATA_DIR, 'projects.json');

const PRIMARY_EVENTS_FILE = path.join(PRIMARY_DATA_DIR, 'events.json');
const BACKUP_EVENTS_FILE = path.join(BACKUP_DATA_DIR, 'events.json');

const PRIMARY_RSVP_FILE = path.join(PRIMARY_DATA_DIR, 'rsvps.json');
const BACKUP_RSVP_FILE = path.join(BACKUP_DATA_DIR, 'rsvps.json');

const PRIMARY_REQUESTS_FILE = path.join(PRIMARY_DATA_DIR, 'collaboration_requests.json');
const BACKUP_REQUESTS_FILE = path.join(BACKUP_DATA_DIR, 'collaboration_requests.json');

export interface LocalAuthRecord {
  email: string;
  passwordHash: string;
  studentId: string;
  name?: string;
  college?: string;
  student?: Student;
  createdAt: string;
}

// Global in-memory cache to preserve state across requests within server runtime
const globalStore = global as unknown as {
  __cc_students?: Map<string, Student>;
  __cc_auth?: Map<string, LocalAuthRecord>;
  __cc_projects?: Map<string, Project>;
  __cc_requests?: Map<string, CollaborationRequest>;
  __cc_notifications?: Map<string, AppNotification>;
  __cc_reports?: Map<string, Report>;
};
if (!globalStore.__cc_students) globalStore.__cc_students = new Map();
if (!globalStore.__cc_auth) globalStore.__cc_auth = new Map();
if (!globalStore.__cc_projects) globalStore.__cc_projects = new Map();
if (!globalStore.__cc_requests) globalStore.__cc_requests = new Map();
if (!globalStore.__cc_notifications) globalStore.__cc_notifications = new Map();
if (!globalStore.__cc_reports) globalStore.__cc_reports = new Map();

function safeReadFile(filePath: string): string | null {
  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      return fs.readFileSync(/*turbopackIgnore: true*/ filePath, 'utf-8');
    }
  } catch (e) {}
  return null;
}

function safeWriteFile(filePath: string, content: string): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
    }
    fs.writeFileSync(/*turbopackIgnore: true*/ filePath, content, 'utf-8');
    return true;
  } catch (e) {
    return false;
  }
}

function getLocalRegisteredStudents(): Student[] {
  const map = new Map<string, Student>();

  // 1. Multi-tier file stores (Backup first, Primary takes precedence)
  const files = [BACKUP_STUDENTS_FILE, PRIMARY_STUDENTS_FILE];
  for (const f of files) {
    const raw = safeReadFile(f);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const s of parsed) {
            if (s && s.id) {
              map.set(s.id, s);
              if (globalStore.__cc_students) {
                globalStore.__cc_students.set(s.id, s);
              }
            }
          }
        }
      } catch (e) {}
    }
  }

  // 2. In-memory cache for unsaved entries
  if (globalStore.__cc_students) {
    for (const [id, s] of globalStore.__cc_students.entries()) {
      if (!map.has(id)) {
        map.set(id, s);
      }
    }
  }

  return Array.from(map.values());
}

function saveLocalRegisteredStudent(student: Student): boolean {
  try {
    // 1. Update in-memory
    if (globalStore.__cc_students) {
      globalStore.__cc_students.set(student.id, student);
    }

    // 2. Merge with existing
    const current = getLocalRegisteredStudents();
    const studentEmail = (student.email || '').toLowerCase();
    const updated = [
      student,
      ...current.filter((s) => s.id !== student.id && (!studentEmail || (s.email || '').toLowerCase() !== studentEmail))
    ];

    // 3. Write to all available file tiers
    const jsonStr = JSON.stringify(updated, null, 2);
    safeWriteFile(PRIMARY_STUDENTS_FILE, jsonStr);
    safeWriteFile(BACKUP_STUDENTS_FILE, jsonStr);
    return true;
  } catch (err) {
    console.warn('[DB] Failed to save student to local persistent store:', err);
    return false;
  }
}

function getLocalUserAuth(): LocalAuthRecord[] {
  const map = new Map<string, LocalAuthRecord>();

  // 1. In-memory cache
  if (globalStore.__cc_auth) {
    for (const a of globalStore.__cc_auth.values()) {
      map.set(a.email.toLowerCase(), a);
    }
  }

  // 2. Primary and Backup files
  const files = [PRIMARY_AUTH_FILE, BACKUP_AUTH_FILE];
  for (const f of files) {
    const raw = safeReadFile(f);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const a of parsed) {
            if (a && a.email) {
              const norm = a.email.toLowerCase();
              map.set(norm, a);
              if (globalStore.__cc_auth) {
                globalStore.__cc_auth.set(norm, a);
              }
            }
          }
        }
      } catch (e) {}
    }
  }

  return Array.from(map.values());
}

function saveLocalUserAuthRecord(record: LocalAuthRecord): boolean {
  try {
    const norm = record.email.toLowerCase();
    // 1. Update in-memory
    if (globalStore.__cc_auth) {
      globalStore.__cc_auth.set(norm, record);
    }

    // 2. Merge with existing
    const current = getLocalUserAuth();
    const updated = [record, ...current.filter((r) => r.email.toLowerCase() !== norm)];

    // 3. Write to all available file tiers
    const jsonStr = JSON.stringify(updated, null, 2);
    safeWriteFile(PRIMARY_AUTH_FILE, jsonStr);
    safeWriteFile(BACKUP_AUTH_FILE, jsonStr);
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

  // REAL REGISTERED STUDENTS ONLY: Zero demo personas or mock profiles
  return { students: realStudents, source };
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

function getLocalProjects(): Project[] {
  const map = new Map<string, Project>();
  if (globalStore.__cc_projects) {
    for (const p of globalStore.__cc_projects.values()) {
      map.set(p.id, p);
    }
  }

  const files = [BACKUP_PROJECTS_FILE, PRIMARY_PROJECTS_FILE];
  for (const f of files) {
    const raw = safeReadFile(f);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const p of parsed) {
            if (p && p.id) {
              map.set(p.id, p);
              if (globalStore.__cc_projects) {
                globalStore.__cc_projects.set(p.id, p);
              }
            }
          }
        }
      } catch {}
    }
  }

  return Array.from(map.values());
}

function saveLocalProject(project: Project): boolean {
  try {
    if (globalStore.__cc_projects) {
      globalStore.__cc_projects.set(project.id, project);
    }
    const current = getLocalProjects();
    const updated = [project, ...current.filter((p) => p.id !== project.id)];
    const jsonStr = JSON.stringify(updated, null, 2);
    safeWriteFile(PRIMARY_PROJECTS_FILE, jsonStr);
    safeWriteFile(BACKUP_PROJECTS_FILE, jsonStr);
    return true;
  } catch (err) {
    console.warn('[DB] Failed to save project to local persistent store:', err);
    return false;
  }
}

function getLocalEvents(): CampusEvent[] {
  const map = new Map<string, CampusEvent>();
  const files = [BACKUP_EVENTS_FILE, PRIMARY_EVENTS_FILE];
  for (const f of files) {
    const raw = safeReadFile(f);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const e of parsed) {
            if (e && e.id) map.set(e.id, e);
          }
        }
      } catch {}
    }
  }
  return Array.from(map.values());
}

export function saveLocalEvent(event: CampusEvent): boolean {
  try {
    const current = getLocalEvents();
    const updated = [event, ...current.filter((e) => e.id !== event.id)];
    const jsonStr = JSON.stringify(updated, null, 2);
    safeWriteFile(PRIMARY_EVENTS_FILE, jsonStr);
    safeWriteFile(BACKUP_EVENTS_FILE, jsonStr);
    return true;
  } catch (err) {
    console.warn('[DB] Failed to save event to local persistent store:', err);
    return false;
  }
}

interface LocalRSVP {
  eventId: string;
  userId: string;
  registeredAt: string;
}

function getLocalRSVPs(): LocalRSVP[] {
  const map = new Map<string, LocalRSVP>();
  const files = [BACKUP_RSVP_FILE, PRIMARY_RSVP_FILE];
  for (const f of files) {
    const raw = safeReadFile(f);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const r of parsed) {
            if (r && r.eventId && r.userId) {
              map.set(`${r.eventId}:${r.userId}`, r);
            }
          }
        }
      } catch {}
    }
  }
  return Array.from(map.values());
}

function toggleLocalRSVP(eventId: string, userId: string): { isRegistered: boolean; attendeesCount: number } {
  const all = getLocalRSVPs();
  const key = `${eventId}:${userId}`;
  const existingIndex = all.findIndex((r) => `${r.eventId}:${r.userId}` === key);
  let isNowRegistered = false;

  if (existingIndex >= 0) {
    all.splice(existingIndex, 1);
    isNowRegistered = false;
  } else {
    all.push({
      eventId,
      userId,
      registeredAt: new Date().toISOString()
    });
    isNowRegistered = true;
  }

  const jsonStr = JSON.stringify(all, null, 2);
  safeWriteFile(PRIMARY_RSVP_FILE, jsonStr);
  safeWriteFile(BACKUP_RSVP_FILE, jsonStr);

  const attendeesCount = all.filter((r) => r.eventId === eventId).length;
  return { isRegistered: isNowRegistered, attendeesCount };
}

export async function fetchProjectsFromDB(): Promise<{ projects: Project[]; source: 'dynamodb' | 'disk' | 'fallback' }> {
  const localProjects = getLocalProjects();
  const client = getDocClient();
  let dbProjects: Project[] = [];

  if (client) {
    try {
      const command = new ScanCommand({
        TableName: TABLE_NAME,
        Limit: 50
      });
      const response = await client.send(command);
      const items = (response.Items || []).filter((it) => (it.pk as string)?.startsWith('PROJECT#'));

      dbProjects = items.map((it) => {
        const ownerId = it.ownerId || 'student-admin';
        const ownerName = it.ownerName || 'Campus Builder';
        const ownerAvatar = it.ownerAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(ownerId)}`;
        const createdAt = it.createdAt || new Date().toISOString();
        const members = Array.isArray(it.members) && it.members.length > 0
          ? it.members
          : [{ userId: ownerId, name: ownerName, avatar: ownerAvatar, role: 'Owner / Lead', joinedAt: createdAt }];

        return {
          id: it.id || (it.pk as string).replace('PROJECT#', ''),
          title: it.title || 'Untitled Project',
          tagline: it.tagline || 'Student collaboration project',
          description: it.description || '',
          type: it.type || 'Personal',
          ownerId,
          ownerName,
          ownerAvatar,
          ownerCollege: it.ownerCollege || 'Engineering Institute',
          createdAt,
          requiredSkills: Array.isArray(it.requiredSkills) ? it.requiredSkills : [],
          currentMembers: members.length,
          maxMembers: it.maxMembers || 4,
          isOpen: it.isOpen !== undefined ? it.isOpen : true,
          status: it.status || (it.isOpen === false ? 'closed' : 'open'),
          likesCount: it.likesCount || 0,
          tags: Array.isArray(it.tags) ? it.tags : [],
          comments: Array.isArray(it.comments) ? it.comments : [],
          members,
          rolesNeeded: Array.isArray(it.rolesNeeded) ? it.rolesNeeded : []
        };
      });
    } catch (error) {
      console.warn('[DB] Error scanning projects from DynamoDB:', error);
    }
  }

  const projectMap = new Map<string, Project>();
  localProjects.forEach((p) => {
    const ownerId = p.ownerId || 'student-admin';
    const ownerName = p.ownerName || 'Campus Builder';
    const ownerAvatar = p.ownerAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(ownerId)}`;
    const createdAt = p.createdAt || new Date().toISOString();
    const members = Array.isArray(p.members) && p.members.length > 0
      ? p.members
      : [{ userId: ownerId, name: ownerName, avatar: ownerAvatar, role: 'Owner / Lead', joinedAt: createdAt }];

    projectMap.set(p.id, {
      ...p,
      members,
      currentMembers: members.length,
      status: p.status || (p.isOpen === false ? 'closed' : 'open')
    });
  });

  dbProjects.forEach((p) => projectMap.set(p.id, p));

  const allProjects = Array.from(projectMap.values());
  if (allProjects.length > 0) {
    return { projects: allProjects, source: dbProjects.length > 0 ? 'dynamodb' : 'disk' };
  }

  // Strict separation of real vs. mock data in production (Audit Item #14)
  if (process.env.NODE_ENV === 'production') {
    return { projects: [], source: 'disk' };
  }

  return { projects: initialProjects, source: 'fallback' };
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const local = getLocalProjects();
  const foundLocal = local.find((p) => p.id === projectId);
  if (foundLocal) {
    const ownerId = foundLocal.ownerId || 'student-admin';
    const ownerName = foundLocal.ownerName || 'Campus Builder';
    const ownerAvatar = foundLocal.ownerAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(ownerId)}`;
    const createdAt = foundLocal.createdAt || new Date().toISOString();
    const members = Array.isArray(foundLocal.members) && foundLocal.members.length > 0
      ? foundLocal.members
      : [{ userId: ownerId, name: ownerName, avatar: ownerAvatar, role: 'Owner / Lead', joinedAt: createdAt }];
    return {
      ...foundLocal,
      members,
      currentMembers: members.length,
      status: foundLocal.status || (foundLocal.isOpen === false ? 'closed' : 'open')
    };
  }

  if (globalStore.__cc_projects?.has(projectId)) {
    return globalStore.__cc_projects.get(projectId)!;
  }

  const client = getDocClient();
  if (client) {
    try {
      const res = await client.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: {
            pk: `PROJECT#${projectId}`,
            sk: 'METADATA'
          }
        })
      );
      if (res.Item) {
        const it = res.Item;
        const ownerId = it.ownerId || 'student-admin';
        const ownerName = it.ownerName || 'Campus Builder';
        const ownerAvatar = it.ownerAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(ownerId)}`;
        const createdAt = it.createdAt || new Date().toISOString();
        const members = Array.isArray(it.members) && it.members.length > 0
          ? it.members
          : [{ userId: ownerId, name: ownerName, avatar: ownerAvatar, role: 'Owner / Lead', joinedAt: createdAt }];

        const project: Project = {
          id: it.id || projectId,
          title: it.title || 'Untitled Project',
          tagline: it.tagline || '',
          description: it.description || '',
          type: it.type || 'Personal',
          ownerId,
          ownerName,
          ownerAvatar,
          ownerCollege: it.ownerCollege || 'Engineering Institute',
          createdAt,
          requiredSkills: Array.isArray(it.requiredSkills) ? it.requiredSkills : [],
          currentMembers: members.length,
          maxMembers: it.maxMembers || 4,
          isOpen: it.isOpen !== undefined ? it.isOpen : true,
          status: it.status || (it.isOpen === false ? 'closed' : 'open'),
          likesCount: it.likesCount || 0,
          tags: Array.isArray(it.tags) ? it.tags : [],
          comments: Array.isArray(it.comments) ? it.comments : [],
          members,
          rolesNeeded: Array.isArray(it.rolesNeeded) ? it.rolesNeeded : []
        };
        saveLocalProject(project);
        return project;
      }
    } catch (err) {
      console.warn('[DB] Error looking up project by ID:', err);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    const mock = initialProjects.find((p) => p.id === projectId);
    if (mock) return mock;
  }

  return null;
}

export async function saveProjectToDB(project: Project): Promise<boolean> {
  // Ensure members list is populated
  if (!project.members || project.members.length === 0) {
    project.members = [
      {
        userId: project.ownerId,
        name: project.ownerName,
        avatar: project.ownerAvatar,
        role: 'Owner / Lead',
        joinedAt: project.createdAt || new Date().toISOString()
      }
    ];
  }
  project.currentMembers = project.members.length;

  // 1. Always persist to server persistent file store first (guaranteed persistence across restarts)
  saveLocalProject(project);

  // 2. Also persist to DynamoDB cloud database if connected
  const client = getDocClient();
  if (!client) return true;

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
    console.warn('[DB] DynamoDB put failed, project safely preserved on server disk:', error);
    return true;
  }
}

export async function fetchEventsFromDB(): Promise<{ events: CampusEvent[]; source: 'dynamodb' | 'disk' | 'fallback' }> {
  const localEvents = getLocalEvents();
  const client = getDocClient();
  let dbEvents: CampusEvent[] = [];

  if (client) {
    try {
      const command = new ScanCommand({
        TableName: TABLE_NAME,
        Limit: 50
      });
      const response = await client.send(command);
      const items = (response.Items || []).filter((it) => (it.pk as string)?.startsWith('EVENT#'));

      dbEvents = items.map((it) => ({
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
    } catch (error) {
      console.warn('[DB] Error scanning events from DynamoDB:', error);
    }
  }

  const eventMap = new Map<string, CampusEvent>();
  // Seed with initialCampusEvents only in development/demo (Audit Item #14)
  if (process.env.NODE_ENV !== 'production') {
    initialCampusEvents.forEach((e) => eventMap.set(e.id, e));
  }
  localEvents.forEach((e) => eventMap.set(e.id, e));
  dbEvents.forEach((e) => eventMap.set(e.id, e));

  return { events: Array.from(eventMap.values()), source: dbEvents.length > 0 ? 'dynamodb' : 'disk' };
}

export async function saveEventToDB(event: CampusEvent): Promise<boolean> {
  saveLocalEvent(event);
  const client = getDocClient();
  if (!client) return true;

  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `EVENT#${event.id}`,
        sk: 'METADATA',
        updatedAt: new Date().toISOString(),
        ...event
      }
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.warn('[DB] Error saving event to DynamoDB:', error);
    return true;
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

export async function getStudentById(studentId: string): Promise<Student | null> {
  // 1. Local registered students (fresh from persistent store)
  const local = getLocalRegisteredStudents();
  const found = local.find((s) => s.id === studentId);
  if (found) return found;

  // 2. In-memory cache fallback
  if (globalStore.__cc_students?.has(studentId)) {
    return globalStore.__cc_students.get(studentId)!;
  }

  // 3. Direct DynamoDB key lookup
  const client = getDocClient();
  if (client) {
    try {
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          pk: `STUDENT#${studentId}`,
          sk: 'METADATA'
        }
      });
      const res = await client.send(command);
      if (res.Item) {
        const it = res.Item;
        const student: Student = {
          id: it.id || studentId,
          name: it.name || 'Anonymous Student',
          avatar: it.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(studentId)}`,
          college: it.college || 'Engineering Institute',
          year: it.year || '1st Year',
          major: it.major || 'Computer Science',
          primaryRole: it.primaryRole || 'Developer',
          bio: it.bio || '',
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
          email: it.email || '',
          interests: Array.isArray(it.interests) ? it.interests : ['Projects'],
          proofs: Array.isArray(it.proofs) ? it.proofs : [],
          githubUrl: it.githubUrl,
          portfolioUrl: it.portfolioUrl,
          linkedinUrl: it.linkedinUrl,
          figmaUrl: it.figmaUrl
        };
        saveLocalRegisteredStudent(student);
        return student;
      }
    } catch (e) {}
  }

  // Student not found in real registered database
  return null;
}

export async function findStudentByEmail(email: string): Promise<Student | null> {
  const normalized = email.trim().toLowerCase();

  // 1. Check in-memory
  if (globalStore.__cc_students) {
    for (const s of globalStore.__cc_students.values()) {
      if ((s.email || '').toLowerCase() === normalized) return s;
    }
  }

  // 2. Check local registered students
  const local = getLocalRegisteredStudents();
  const foundLocal = local.find((s) => (s.email || '').toLowerCase() === normalized);
  if (foundLocal) {
    if (globalStore.__cc_students) globalStore.__cc_students.set(foundLocal.id, foundLocal);
    return foundLocal;
  }

  // 3. Check Auth record (if auth record exists, it points to student profile or studentId)
  const auth = await getUserAuth(normalized);
  if (auth) {
    if (auth.student) {
      saveLocalRegisteredStudent(auth.student);
      return auth.student;
    }
    if (auth.studentId) {
      const s = await getStudentById(auth.studentId);
      if (s) {
        saveLocalRegisteredStudent(s);
        return s;
      }
    }
  }

  // 4. Check full student catalog
  const { students } = await fetchStudentsFromDB();
  const found = students.find((s) => (s.email || '').toLowerCase() === normalized);
  if (found) {
    saveLocalRegisteredStudent(found);
    return found;
  }

  return null;
}

export async function saveUserAuth(
  email: string,
  passwordHash: string,
  studentId: string,
  studentProfile?: Student
): Promise<boolean> {
  const normEmail = email.trim().toLowerCase();
  saveLocalUserAuthRecord({
    email: normEmail,
    passwordHash,
    studentId,
    name: studentProfile?.name,
    college: studentProfile?.college,
    student: studentProfile,
    createdAt: new Date().toISOString()
  });

  const client = getDocClient();
  if (!client) return true;

  try {
    const item: Record<string, any> = {
      pk: `USER#${normEmail}`,
      sk: 'AUTH',
      email: normEmail,
      passwordHash,
      studentId,
      createdAt: new Date().toISOString()
    };
    if (studentProfile) {
      item.student = studentProfile;
      item.name = studentProfile.name;
      item.college = studentProfile.college;
    }

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.warn('[DB] Error saving user auth record to DynamoDB:', error);
    return true;
  }
}

export async function getUserAuth(email: string): Promise<LocalAuthRecord | null> {
  const normEmail = email.trim().toLowerCase();

  // 1. Check local persistent stores first (primary & backup files for cross-process/worker synchronization)
  const localAuths = getLocalUserAuth();
  const found = localAuths.find((a) => a.email.toLowerCase() === normEmail);
  if (found) {
    if (globalStore.__cc_auth) {
      globalStore.__cc_auth.set(normEmail, found);
    }
    return found;
  }

  // 2. Fallback to in-memory cache
  if (globalStore.__cc_auth?.has(normEmail)) {
    return globalStore.__cc_auth.get(normEmail)!;
  }

  // 3. Check DynamoDB
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

    const record: LocalAuthRecord = {
      email: res.Item.email,
      passwordHash: res.Item.passwordHash,
      studentId: res.Item.studentId,
      name: res.Item.name,
      college: res.Item.college,
      student: res.Item.student,
      createdAt: res.Item.createdAt || new Date().toISOString()
    };
    saveLocalUserAuthRecord(record);
    return record;
  } catch (error) {
    console.warn('[DB] Error getting user auth record from DynamoDB:', error);
    return null;
  }
}

export async function updateUserPassword(email: string, newPasswordHash: string): Promise<boolean> {
  const normEmail = email.trim().toLowerCase();

  // 1. Get existing auth or student
  const auth = await getUserAuth(normEmail);
  const student = await findStudentByEmail(normEmail);

  if (!auth && !student) {
    return false;
  }

  const studentId = auth?.studentId || student?.id || crypto.randomUUID();
  const studentProfile = auth?.student || student || undefined;

  // 2. Save updated auth record in in-memory and local disk tiers
  const updatedRecord: LocalAuthRecord = {
    email: normEmail,
    passwordHash: newPasswordHash,
    studentId,
    name: auth?.name || student?.name,
    college: auth?.college || student?.college,
    student: studentProfile,
    createdAt: auth?.createdAt || new Date().toISOString()
  };

  saveLocalUserAuthRecord(updatedRecord);

  // 3. Update in DynamoDB if configured
  const client = getDocClient();
  if (client) {
    try {
      const item: Record<string, any> = {
        pk: `USER#${normEmail}`,
        sk: 'AUTH',
        email: normEmail,
        passwordHash: newPasswordHash,
        studentId,
        updatedAt: new Date().toISOString(),
        createdAt: auth?.createdAt || new Date().toISOString()
      };
      if (studentProfile) {
        item.student = studentProfile;
        item.name = studentProfile.name;
        item.college = studentProfile.college;
      }
      await client.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: item
        })
      );
    } catch (err) {
      console.warn('[DB] Failed to update password in DynamoDB, saved locally:', err);
    }
  }

  return true;
}

function getLocalRequests(): CollaborationRequest[] {
  const map = new Map<string, CollaborationRequest>();
  if (globalStore.__cc_requests) {
    for (const r of globalStore.__cc_requests.values()) {
      map.set(r.id, r);
    }
  }

  const files = [PRIMARY_REQUESTS_FILE, BACKUP_REQUESTS_FILE];
  for (const f of files) {
    const raw = safeReadFile(f);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const r of parsed) {
            if (r && r.id) {
              map.set(r.id, r);
              if (globalStore.__cc_requests) {
                globalStore.__cc_requests.set(r.id, r);
              }
            }
          }
        }
      } catch {}
    }
  }

  return Array.from(map.values());
}

export async function saveCollaborationRequestToDB(req: CollaborationRequest): Promise<boolean> {
  // 1. In-memory & local file cache
  if (globalStore.__cc_requests) {
    globalStore.__cc_requests.set(req.id, req);
  }
  const current = getLocalRequests();
  const updated = [req, ...current.filter((r) => r.id !== req.id)];
  const jsonStr = JSON.stringify(updated, null, 2);
  safeWriteFile(PRIMARY_REQUESTS_FILE, jsonStr);
  safeWriteFile(BACKUP_REQUESTS_FILE, jsonStr);

  // 2. Direct DynamoDB write
  const client = getDocClient();
  if (client) {
    try {
      await client.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            pk: `REQ#${req.id}`,
            sk: 'METADATA',
            type: 'REQUEST',
            ...req
          }
        })
      );
    } catch (err) {
      console.warn('[DB] Failed to save request to DynamoDB:', err);
    }
  }

  // 3. Dispatch in-app notification to receiver
  if (req.receiverId) {
    saveNotificationToDB({
      id: crypto.randomUUID(),
      userId: req.receiverId,
      type: 'collaboration_request',
      title: 'New Collaboration Request! 📬',
      message: `${req.senderName} sent you a request for "${req.projectTitle}".`,
      read: false,
      createdAt: new Date().toISOString(),
      link: '/requests'
    }).catch(() => {});
  }

  return true;
}

export async function getCollaborationRequestsFromDB(userId?: string): Promise<CollaborationRequest[]> {
  const client = getDocClient();
  let dbRequests: CollaborationRequest[] = [];

  if (client) {
    try {
      const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(pk, :prefix)',
        ExpressionAttributeValues: {
          ':prefix': 'REQ#'
        }
      });
      const res = await client.send(command);
      if (res.Items && res.Items.length > 0) {
        dbRequests = res.Items.map((item) => ({
          id: item.id || item.pk.replace('REQ#', ''),
          senderId: item.senderId,
          senderName: item.senderName,
          senderAvatar: item.senderAvatar,
          senderRole: item.senderRole,
          receiverId: item.receiverId,
          receiverName: item.receiverName,
          projectId: item.projectId,
          projectTitle: item.projectTitle,
          message: item.message,
          status: item.status || 'pending',
          createdAt: item.createdAt || 'Recent',
          contactEmail: item.contactEmail
        }));
      }
    } catch (err) {
      console.warn('[DB] DynamoDB scan requests error, falling back:', err);
    }
  }

  // Real requests from persistent store and DynamoDB only
  const local = getLocalRequests();
  const requestMap = new Map<string, CollaborationRequest>();
  local.forEach((r) => requestMap.set(r.id, r));
  dbRequests.forEach((r) => requestMap.set(r.id, r));

  let all = Array.from(requestMap.values());
  if (userId) {
    all = all.filter((r) => r.senderId === userId || r.receiverId === userId);
  }
  return all;
}

export async function getCollaborationRequestByIdFromDB(requestId: string): Promise<CollaborationRequest | null> {
  const local = getLocalRequests();
  const found = local.find((r) => r.id === requestId);
  if (found) return found;

  if (globalStore.__cc_requests?.has(requestId)) {
    return globalStore.__cc_requests.get(requestId)!;
  }

  const client = getDocClient();
  if (client) {
    try {
      const res = await client.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: {
            pk: `REQ#${requestId}`,
            sk: 'METADATA'
          }
        })
      );
      if (res.Item) {
        const item = res.Item;
        return {
          id: item.id || requestId,
          senderId: item.senderId,
          senderName: item.senderName,
          senderAvatar: item.senderAvatar,
          senderRole: item.senderRole,
          receiverId: item.receiverId,
          receiverName: item.receiverName,
          projectId: item.projectId,
          projectTitle: item.projectTitle,
          message: item.message,
          status: item.status || 'pending',
          createdAt: item.createdAt || new Date().toISOString(),
          contactEmail: item.contactEmail
        };
      }
    } catch (err) {
      console.warn('[DB] Error looking up request by ID:', err);
    }
  }

  return null;
}

export async function updateCollaborationRequestStatusInDB(
  requestId: string,
  status: 'accepted' | 'declined'
): Promise<boolean> {
  // Update local
  const current = getLocalRequests();
  const updated = current.map((r) => (r.id === requestId ? { ...r, status } : r));
  safeWriteFile(PRIMARY_REQUESTS_FILE, JSON.stringify(updated, null, 2));
  safeWriteFile(BACKUP_REQUESTS_FILE, JSON.stringify(updated, null, 2));

  if (globalStore.__cc_requests?.has(requestId)) {
    const existing = globalStore.__cc_requests.get(requestId)!;
    existing.status = status;
  }

  const client = getDocClient();
  if (client) {
    try {
      await client.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: {
            pk: `REQ#${requestId}`,
            sk: 'METADATA'
          },
          UpdateExpression: 'SET #status = :s, respondedAt = :t',
          ExpressionAttributeNames: {
            '#status': 'status'
          },
          ExpressionAttributeValues: {
            ':s': status,
            ':t': new Date().toISOString()
          }
        })
      );
    } catch (err) {
      console.warn('[DB] Error updating request in DynamoDB:', err);
    }
  }

  // Dispatch in-app notification to the original sender
  const targetReq = globalStore.__cc_requests?.get(requestId) || current.find((r) => r.id === requestId);
  if (targetReq && targetReq.senderId) {
    saveNotificationToDB({
      id: crypto.randomUUID(),
      userId: targetReq.senderId,
      type: status === 'accepted' ? 'request_accepted' : 'request_declined',
      title: status === 'accepted' ? 'Collaboration Accepted! 🎉' : 'Request Update',
      message: `${targetReq.receiverName} ${status === 'accepted' ? 'accepted' : 'declined'} your collaboration request for "${targetReq.projectTitle}".`,
      read: false,
      createdAt: new Date().toISOString(),
      link: '/requests'
    }).catch(() => {});
  }

  return true;
}

export async function addProjectCommentToDB(projectId: string, comment: ProjectComment): Promise<boolean> {
  const client = getDocClient();
  if (client) {
    try {
      await client.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            pk: `PROJECT#${projectId}`,
            sk: `COMMENT#${comment.id}`,
            type: 'COMMENT',
            projectId,
            ...comment
          }
        })
      );
    } catch (err) {
      console.warn('[DB] Error saving comment to DynamoDB:', err);
    }
  }

  // Update in cached projects
  if (globalStore.__cc_projects?.has(projectId)) {
    const p = globalStore.__cc_projects.get(projectId)!;
    p.comments = [...(p.comments || []), comment];

    // Notify project owner
    if (p.ownerId && p.ownerId !== comment.authorId) {
      saveNotificationToDB({
        id: crypto.randomUUID(),
        userId: p.ownerId,
        type: 'new_comment',
        title: 'New Project Comment 💬',
        message: `${comment.authorName} commented on your project "${p.title}".`,
        read: false,
        createdAt: new Date().toISOString(),
        link: '/projects'
      }).catch(() => {});
    }
  }
  return true;
}

export async function toggleEventRegistrationInDB(
  eventId: string,
  userId: string
): Promise<{ isRegistered: boolean; attendeesCount: number }> {
  // 1. Update local persistent RSVP store and compute accurate attendee count
  const localResult = toggleLocalRSVP(eventId, userId);

  // 2. Also sync to DynamoDB if connected
  const client = getDocClient();
  if (client) {
    try {
      if (localResult.isRegistered) {
        await client.send(
          new PutCommand({
            TableName: TABLE_NAME,
            Item: {
              pk: `EVENT#${eventId}`,
              sk: `RSVP#${userId}`,
              type: 'RSVP',
              eventId,
              userId,
              registeredAt: new Date().toISOString()
            }
          })
        );
      } else {
        await client.send(
          new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
              pk: `EVENT#${eventId}`,
              sk: `RSVP#${userId}`
            }
          })
        );
      }
    } catch (err) {
      console.warn('[DB] Error syncing RSVP to DynamoDB:', err);
    }
  }

  return localResult;
}

export async function saveNotificationToDB(notification: AppNotification): Promise<boolean> {
  if (globalStore.__cc_notifications) {
    globalStore.__cc_notifications.set(notification.id, notification);
  }
  const client = getDocClient();
  if (client) {
    try {
      await client.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            pk: `NOTIF#${notification.id}`,
            sk: `USER#${notification.userId}`,
            recordType: 'NOTIFICATION',
            ...notification
          }
        })
      );
    } catch (err) {
      console.warn('[DB] Failed to save notification to DynamoDB:', err);
    }
  }
  return true;
}

export async function getNotificationsFromDB(userId: string): Promise<AppNotification[]> {
  const client = getDocClient();
  let dbNotifs: AppNotification[] = [];

  if (client) {
    try {
      const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'recordType = :t AND userId = :uid',
        ExpressionAttributeValues: {
          ':t': 'NOTIFICATION',
          ':uid': userId
        }
      });
      const res = await client.send(command);
      if (res.Items && res.Items.length > 0) {
        dbNotifs = res.Items.map((it) => ({
          id: it.id || (it.pk as string).replace('NOTIF#', ''),
          userId: it.userId,
          type: it.type || 'system',
          title: it.title || 'Notification',
          message: it.message || '',
          read: Boolean(it.read),
          createdAt: it.createdAt || 'Just now',
          link: it.link
        }));
      }
    } catch (err) {
      console.warn('[DB] Failed to scan notifications from DynamoDB:', err);
    }
  }

  const map = new Map<string, AppNotification>();
  if (globalStore.__cc_notifications) {
    for (const n of globalStore.__cc_notifications.values()) {
      if (n.userId === userId) map.set(n.id, n);
    }
  }
  for (const n of dbNotifs) {
    map.set(n.id, n);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function markNotificationReadInDB(notificationId: string, userId: string): Promise<boolean> {
  if (globalStore.__cc_notifications?.has(notificationId)) {
    const n = globalStore.__cc_notifications.get(notificationId)!;
    n.read = true;
  }
  const client = getDocClient();
  if (client) {
    try {
      await client.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: {
            pk: `NOTIF#${notificationId}`,
            sk: `USER#${userId}`
          },
          UpdateExpression: 'SET #read = :r',
          ExpressionAttributeNames: { '#read': 'read' },
          ExpressionAttributeValues: { ':r': true }
        })
      );
    } catch (err) {
      console.warn('[DB] Failed to mark notification read in DynamoDB:', err);
    }
  }
  return true;
}

export async function saveReportToDB(report: Report): Promise<boolean> {
  if (globalStore.__cc_reports) {
    globalStore.__cc_reports.set(report.id, report);
  }
  const client = getDocClient();
  if (client) {
    try {
      await client.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            pk: `REPORT#${report.id}`,
            sk: 'METADATA',
            type: 'REPORT',
            ...report
          }
        })
      );
    } catch (err) {
      console.warn('[DB] Failed to save report in DynamoDB:', err);
    }
  }
  return true;
}

export async function getReportsFromDB(): Promise<Report[]> {
  const client = getDocClient();
  let dbReports: Report[] = [];
  if (client) {
    try {
      const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(pk, :p)',
        ExpressionAttributeValues: { ':p': 'REPORT#' }
      });
      const res = await client.send(command);
      if (res.Items && res.Items.length > 0) {
        dbReports = res.Items.map((it) => ({
          id: it.id || (it.pk as string).replace('REPORT#', ''),
          reporterId: it.reporterId,
          targetType: it.targetType,
          targetId: it.targetId,
          reason: it.reason,
          details: it.details,
          status: it.status || 'pending',
          createdAt: it.createdAt || 'Recent'
        }));
      }
    } catch (err) {
      console.warn('[DB] Error scanning reports from DynamoDB:', err);
    }
  }

  const map = new Map<string, Report>();
  if (globalStore.__cc_reports) {
    for (const r of globalStore.__cc_reports.values()) map.set(r.id, r);
  }
  for (const r of dbReports) map.set(r.id, r);
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function updateReportStatusInDB(
  reportId: string,
  status: 'resolved' | 'dismissed'
): Promise<boolean> {
  if (globalStore.__cc_reports?.has(reportId)) {
    const r = globalStore.__cc_reports.get(reportId)!;
    r.status = status;
  }
  const client = getDocClient();
  if (client) {
    try {
      await client.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: {
            pk: `REPORT#${reportId}`,
            sk: 'METADATA'
          },
          UpdateExpression: 'SET #status = :s, resolvedAt = :t',
          ExpressionAttributeNames: { '#status': 'status' },
          ExpressionAttributeValues: { ':s': status, ':t': new Date().toISOString() }
        })
      );
    } catch (err) {
      console.warn('[DB] Error updating report in DynamoDB:', err);
    }
  }
  return true;
}

