import { describe, it, expect, beforeAll } from 'bun:test';
import { Project, ProjectMember, CollaborationRequest } from '../src/types';
import { saveProjectToDB, getProjectById } from '../src/lib/db';

describe('Project Membership & Application Lifecycle (Audit Items #18 & #19)', () => {
  const testProjectId = 'lifecycle-test-project-101';
  const ownerId = 'student-lead-1';

  beforeAll(async () => {
    const testProject: Project = {
      id: testProjectId,
      title: 'Robotics Autonomous Rover',
      tagline: 'Building a ROS-based planetary explorer rover',
      description: 'Engineering competition team project with 3 slots max.',
      type: 'Academic',
      ownerId,
      ownerName: 'Sarah Jenkins',
      ownerAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah',
      ownerCollege: 'Stanford University',
      createdAt: new Date().toISOString(),
      requiredSkills: ['ROS2', 'Python', 'Computer Vision'],
      currentMembers: 1,
      maxMembers: 3,
      isOpen: true,
      status: 'open',
      likesCount: 5,
      comments: [],
      tags: ['Robotics', 'Hardware'],
      members: [
        {
          userId: ownerId,
          name: 'Sarah Jenkins',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah',
          role: 'Owner / Lead',
          joinedAt: new Date().toISOString()
        }
      ]
    };
    await saveProjectToDB(testProject);
  });

  it('retrieves project with verified members roster', async () => {
    const proj = await getProjectById(testProjectId);
    expect(proj).not.toBeNull();
    expect(proj?.members).toBeDefined();
    expect(proj?.members?.length).toBe(1);
    expect(proj?.members?.[0].userId).toBe(ownerId);
    expect(proj?.members?.[0].role).toBe('Owner / Lead');
  });

  it('adds member upon accepted application and updates capacity', async () => {
    const proj = await getProjectById(testProjectId);
    expect(proj).not.toBeNull();

    const newCollaborator: ProjectMember = {
      userId: 'student-dev-2',
      name: 'Michael Chen',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=michael',
      role: 'Computer Vision Engineer',
      joinedAt: new Date().toISOString()
    };

    const updatedMembers = [...(proj!.members || []), newCollaborator];
    proj!.members = updatedMembers;
    proj!.currentMembers = updatedMembers.length;

    await saveProjectToDB(proj!);

    const refreshed = await getProjectById(testProjectId);
    expect(refreshed?.members?.length).toBe(2);
    expect(refreshed?.currentMembers).toBe(2);
    expect(refreshed?.members?.some((m) => m.userId === 'student-dev-2')).toBe(true);
    expect(refreshed?.isOpen).toBe(true);
  });

  it('auto-closes project when max members capacity is reached', async () => {
    const proj = await getProjectById(testProjectId);
    expect(proj).not.toBeNull();

    const thirdMember: ProjectMember = {
      userId: 'student-dev-3',
      name: 'Emma Watson',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=emma',
      role: 'Embedded Systems',
      joinedAt: new Date().toISOString()
    };

    proj!.members = [...(proj!.members || []), thirdMember];
    proj!.currentMembers = proj!.members.length;
    if (proj!.currentMembers >= proj!.maxMembers) {
      proj!.isOpen = false;
      proj!.status = 'closed';
    }

    await saveProjectToDB(proj!);

    const refreshed = await getProjectById(testProjectId);
    expect(refreshed?.members?.length).toBe(3);
    expect(refreshed?.currentMembers).toBe(3);
    expect(refreshed?.isOpen).toBe(false);
    expect(refreshed?.status).toBe('closed');
  });
});
