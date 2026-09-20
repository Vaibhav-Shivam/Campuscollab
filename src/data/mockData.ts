import { Student, Project, CampusEvent, CollaborationRequest } from '@/types';

// REAL USERS ONLY: Zero mock / demo student personas.
// All students shown on CampusCollab are real registered users.
export const initialStudents: Student[] = [];

export const initialProjects: Project[] = [
  {
    id: 'project-1',
    title: 'AI Expense Tracker for Students',
    tagline: 'Smart receipt scanner and budget companion built for university students.',
    description: 'An AI-powered mobile and web application that categorizes college expenses, alerts roommates on shared grocery bills, and forecasts end-of-semester budgets using local LLM reasoning. Looking for UI/UX designers and React developers to collaborate!',
    type: 'Startup',
    ownerId: 'student-1789820112921',
    ownerName: 'Vaibhav Shivam',
    ownerAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Vaibhav%20Shivam',
    ownerCollege: 'National Institute of Technology',
    createdAt: 'Recent',
    requiredSkills: ['UI/UX', 'Figma', 'React', 'Tailwind CSS'],
    currentMembers: 1,
    maxMembers: 4,
    isOpen: true,
    likesCount: 24,
    tags: ['AI/ML', 'FinTech', 'React', 'Mobile First'],
    comments: []
  },
  {
    id: 'project-2',
    title: 'Autonomous Campus Resource Hub',
    tagline: 'Student collaboration hub for open-source campus initiatives.',
    description: 'A platform enabling students across departments to discover real project collaborators, showcase verified portfolio proofs, and coordinate hackathon squads.',
    type: 'Hackathon',
    ownerId: 'student-1789820112921',
    ownerName: 'Vaibhav Shivam',
    ownerAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Vaibhav%20Shivam',
    ownerCollege: 'National Institute of Technology',
    createdAt: 'Recent',
    requiredSkills: ['Next.js', 'TypeScript', 'Node.js', 'AWS'],
    currentMembers: 1,
    maxMembers: 4,
    isOpen: true,
    likesCount: 19,
    tags: ['Next.js', 'TypeScript', 'AWS', 'Collaboration'],
    comments: []
  }
];

export const initialCampusEvents: CampusEvent[] = [
  {
    id: 'event-1',
    title: 'AWS Campus Innovation Hackathon',
    category: 'Hackathon',
    date: 'Oct 14–15, 2026',
    location: 'Main Auditorium & AWS Virtual Hub',
    isOnline: false,
    description: 'A 36-hour cross-campus building sprint focused on generative AI, cloud computing, and social impact tools. Free meals, mentorship from AWS cloud architects, and cash prizes for the top 3 projects.',
    organizer: 'Campus Tech Council & AWS Cloud Club',
    attendeesCount: 240,
    isRegistered: false,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600',
    skillsFocus: ['Cloud Architecture', 'AWS Bedrock', 'Full Stack', 'Pitching']
  },
  {
    id: 'event-2',
    title: 'Design Systems & Figma Masterclass',
    category: 'Workshop',
    date: 'Oct 22, 2026',
    location: 'Design Studio Lab (Room 304)',
    isOnline: false,
    description: 'Hands-on intensive workshop breaking down design tokens, responsive auto-layout, component variants, and handoff protocols to developers. Bring your laptop and your portfolio drafts.',
    organizer: 'University Design Guild',
    attendeesCount: 85,
    isRegistered: false,
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=600',
    skillsFocus: ['UI/UX', 'Figma', 'Design Systems', 'Prototyping']
  },
  {
    id: 'event-3',
    title: 'Open Source Saturday: Next.js & TypeScript',
    category: 'Club Meetup',
    date: 'Nov 02, 2026',
    location: 'Virtual Google Meet',
    isOnline: true,
    description: 'Bi-weekly contributor jam helping students land their first open source Pull Request. We will walk through issue triage, git etiquette, code reviews, and production deployment on Vercel.',
    organizer: 'Open Source Club',
    attendeesCount: 130,
    isRegistered: false,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
    skillsFocus: ['Next.js', 'TypeScript', 'Git / GitHub', 'CI/CD']
  }
];

export const initialRequests: CollaborationRequest[] = [];
