import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { initialStudents, initialProjects, initialCampusEvents } from '@/data/mockData';
import { Student, Project, CampusEvent } from '@/types';

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'workshop-campuscollab-db';
const REGION = process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1';

let docClient: DynamoDBDocumentClient | null = null;

function getDocClient() {
  if (docClient) return docClient;

  // Uses AWS environment variables or default AWS credentials chain
  try {
    const rawClient = new DynamoDBClient({
      region: REGION,
      credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
      } : undefined
    });
    docClient = DynamoDBDocumentClient.from(rawClient, {
      marshallOptions: { removeUndefinedValues: true }
    });
    return docClient;
  } catch (error) {
    console.warn('[DB] DynamoDB client initialization failed, fallback to memory:', error);
    return null;
  }
}

export async function fetchStudentsFromDB(): Promise<{ students: Student[]; source: 'dynamodb' | 'fallback' }> {
  const client = getDocClient();
  if (!client) {
    return { students: initialStudents, source: 'fallback' };
  }

  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      Limit: 50
    });
    const response = await client.send(command);
    const items = (response.Items || []).filter((it) => (it.pk as string)?.startsWith('STUDENT#'));
    
    if (items.length === 0) {
      return { students: initialStudents, source: 'fallback' };
    }

    // Merge or map with defaults
    const students: Student[] = items.map((it) => ({
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
      skills: Array.isArray(it.skills) ? it.skills.map((s: string | { name: string; level: number; category: string }) => 
        typeof s === 'string' ? { name: s, level: 4, category: 'General' } : s
      ) : [],
      projectCount: it.projectCount || 0,
      hackathonCount: it.hackathonCount || 0,
      email: it.email || 'student@campuscollab.edu',
      interests: it.interests || ['Hackathons', 'Tech'],
      proofs: it.proofs || []
    }));

    return { students, source: 'dynamodb' };
  } catch (error) {
    console.warn('[DB] Error scanning students from DynamoDB, serving mock data:', error);
    return { students: initialStudents, source: 'fallback' };
  }
}

export async function saveStudentToDB(student: Student): Promise<boolean> {
  const client = getDocClient();
  if (!client) return false;

  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `STUDENT#${student.id}`,
        sk: 'METADATA',
        ...student,
        updatedAt: new Date().toISOString()
      }
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.error('[DB] Error saving student to DynamoDB:', error);
    return false;
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
      tagline: it.tagline || 'Student Project Collaboration',
      description: it.description || '',
      type: it.type || 'Hackathon',
      ownerId: it.ownerId || 'student-1',
      ownerName: it.ownerName || 'Project Lead',
      ownerAvatar: it.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      ownerCollege: it.ownerCollege || 'College Campus',
      createdAt: it.createdAt || 'Recently',
      requiredSkills: it.requiredSkills || it.neededRoles || ['React', 'Python'],
      currentMembers: it.currentMembers || 1,
      maxMembers: it.maxMembers || 4,
      isOpen: it.isOpen !== undefined ? it.isOpen : true,
      likesCount: it.likesCount || 0,
      comments: it.comments || [],
      tags: it.tags || []
    }));

    return { projects, source: 'dynamodb' };
  } catch (error) {
    console.warn('[DB] Error scanning projects from DynamoDB:', error);
    return { projects: initialProjects, source: 'fallback' };
  }
}

export async function saveProjectToDB(project: Project): Promise<boolean> {
  const client = getDocClient();
  if (!client) return false;

  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `PROJECT#${project.id}`,
        sk: 'METADATA',
        ...project,
        updatedAt: new Date().toISOString()
      }
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.error('[DB] Error saving project to DynamoDB:', error);
    return false;
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
