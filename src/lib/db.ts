import fs from 'fs';
import path from 'path';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { initialStudents, initialProjects, initialCampusEvents } from '@/data/mockData';
import { Student, Project, CampusEvent } from '@/types';
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
};
if (!globalStore.__cc_students) globalStore.__cc_students = new Map();
if (!globalStore.__cc_auth) globalStore.__cc_auth = new Map();

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

  // 1. In-memory cache
  if (globalStore.__cc_students) {
    for (const s of globalStore.__cc_students.values()) {
      map.set(s.id, s);
    }
  }

  // 2. Multi-tier file stores (Primary and Backup)
  const files = [PRIMARY_STUDENTS_FILE, BACKUP_STUDENTS_FILE];
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

export async function getStudentById(studentId: string): Promise<Student | null> {
  // 1. In-memory
  if (globalStore.__cc_students?.has(studentId)) {
    return globalStore.__cc_students.get(studentId)!;
  }

  // 2. Local registered students
  const local = getLocalRegisteredStudents();
  const found = local.find((s) => s.id === studentId);
  if (found) return found;

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

  // 4. Initial template students
  return initialStudents.find((s) => s.id === studentId) || null;
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

  const studentId = auth?.studentId || student?.id || `student-${Date.now()}`;
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
