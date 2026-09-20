export type AvailabilityStatus = 'available' | 'looking';

export type ProjectType = 'Hackathon' | 'Academic' | 'Personal' | 'Startup' | 'Open Source';

export interface ProjectProof {
  title: string;
  description: string;
  role: string;
  technologies: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  figmaUrl?: string;
  image?: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  college: string;
  year: string;
  major: string;
  primaryRole: string;
  bio: string;
  status: AvailabilityStatus;
  lookingForRole?: string;
  skills: { name: string; level: number; category: string }[];
  projectCount: number;
  hackathonCount: number;
  portfolioUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
  linkedinUrl?: string;
  email: string;
  interests: string[];
  proofs: ProjectProof[];
}

export interface ProjectComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  createdAt: string;
  offeringSkills?: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  type: ProjectType;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerCollege: string;
  createdAt: string;
  requiredSkills: string[];
  currentMembers: number;
  maxMembers: number;
  isOpen: boolean;
  likesCount: number;
  comments: ProjectComment[];
  tags: string[];
}

export interface CollaborationRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  projectId: string;
  projectTitle: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  contactEmail?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Hackathon' | 'Workshop' | 'Competition' | 'Club Meetup' | 'Showcase';
  date: string;
  location: string;
  isOnline: boolean;
  description: string;
  organizer: string;
  attendeesCount: number;
  isRegistered?: boolean;
  image: string;
  skillsFocus: string[];
}

export interface AIMatchResult {
  student: Student;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'collaboration_request' | 'request_accepted' | 'request_declined' | 'new_comment' | 'event_reminder' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'student' | 'project' | 'comment';
  targetId: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

