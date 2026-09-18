'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Project, CampusEvent, CollaborationRequest, AIMatchResult, AvailabilityStatus } from '@/types';
import { initialStudents, initialProjects, initialCampusEvents, initialRequests } from '@/data/mockData';

interface AppContextType {
  currentUser: Student;
  allStudents: Student[];
  projects: Project[];
  events: CampusEvent[];
  requests: CollaborationRequest[];
  switchUser: (studentId: string) => void;
  updateUserStatus: (status: AvailabilityStatus, lookingForRole?: string) => void;
  createProject: (newProject: Omit<Project, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerAvatar' | 'ownerCollege' | 'comments' | 'likesCount'>) => Project;
  addCommentToProject: (projectId: string, content: string, offeringSkills?: string[]) => void;
  sendCollaborationRequest: (receiverId: string, projectId: string, message: string) => CollaborationRequest;
  respondToRequest: (requestId: string, status: 'accepted' | 'declined') => void;
  toggleEventRegistration: (eventId: string) => void;
  runSmartMatch: (query: string) => { neededSkills: string[]; availableSkills: string[]; matches: AIMatchResult[] };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'campuscollab_students_v1',
  PROJECTS: 'campuscollab_projects_v1',
  EVENTS: 'campuscollab_events_v1',
  REQUESTS: 'campuscollab_requests_v1',
  CURRENT_USER_ID: 'campuscollab_current_user_id_v1'
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [events, setEvents] = useState<CampusEvent[]>(initialCampusEvents);
  const [requests, setRequests] = useState<CollaborationRequest[]>(initialRequests);
  const [currentUserId, setCurrentUserId] = useState<string>('student-1');
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const savedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const savedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      const savedUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);

      if (savedStudents) setStudents(JSON.parse(savedStudents));
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedRequests) setRequests(JSON.parse(savedRequests));
      if (savedUserId) setCurrentUserId(savedUserId);
    } catch (e) {
      console.warn('LocalStorage hydration error:', e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on state changes once hydrated
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [students, projects, events, requests, currentUserId, isHydrated]);

  const currentUser = students.find((s) => s.id === currentUserId) || students[0];

  const switchUser = (studentId: string) => {
    const target = students.find((s) => s.id === studentId);
    if (target) {
      setCurrentUserId(studentId);
    }
  };

  const updateUserStatus = (status: AvailabilityStatus, lookingForRole?: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentUser.id
          ? { ...s, status, lookingForRole: lookingForRole ?? s.lookingForRole }
          : s
      )
    );
  };

  const createProject = (
    newProject: Omit<
      Project,
      'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerAvatar' | 'ownerCollege' | 'comments' | 'likesCount'
    >
  ): Project => {
    const created: Project = {
      ...newProject,
      id: `project-${Date.now()}`,
      createdAt: 'Just now',
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      ownerCollege: currentUser.college,
      likesCount: 1,
      comments: []
    };
    setProjects((prev) => [created, ...prev]);
    return created;
  };

  const addCommentToProject = (projectId: string, content: string, offeringSkills?: string[]) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.primaryRole,
      content,
      createdAt: 'Just now',
      offeringSkills: offeringSkills && offeringSkills.length > 0 ? offeringSkills : undefined
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
  };

  const sendCollaborationRequest = (
    receiverId: string,
    projectId: string,
    message: string
  ): CollaborationRequest => {
    const targetStudent = students.find((s) => s.id === receiverId);
    const targetProject = projects.find((p) => p.id === projectId);

    const newReq: CollaborationRequest = {
      id: `req-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.primaryRole,
      receiverId,
      receiverName: targetStudent ? targetStudent.name : 'Teammate',
      projectId,
      projectTitle: targetProject ? targetProject.title : 'Project Collaboration',
      message,
      status: 'pending',
      createdAt: 'Just now',
      contactEmail: currentUser.email
    };

    setRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  const respondToRequest = (requestId: string, status: 'accepted' | 'declined') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
  };

  const toggleEventRegistration = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const isReg = !e.isRegistered;
          return {
            ...e,
            isRegistered: isReg,
            attendeesCount: isReg ? e.attendeesCount + 1 : Math.max(0, e.attendeesCount - 1)
          };
        }
        return e;
      })
    );
  };

  // Smart Matching AI Engine simulating AWS Bedrock skill extraction & candidate ranking
  const runSmartMatch = (query: string) => {
    const lowerQuery = query.toLowerCase();

    // Known skills catalog for extraction
    const knownSkills = [
      'python', 'react', 'ui/ux', 'figma', 'machine learning', 'fastapi',
      'next.js', 'typescript', 'tailwind css', 'node.js', 'aws', 'video editing',
      'premiere pro', 'motion design', 'html/css', 'docker', 'pytorch'
    ];

    const extractedNeeded: string[] = [];
    const extractedAvailable: string[] = [];

    // Analyze natural language signals (e.g., "I know Python", "need React and UI/UX")
    knownSkills.forEach((skill) => {
      if (lowerQuery.includes(skill)) {
        // If preceded by "i know", "have", "with", assume available; if preceded by "need", "looking for", "want", assume needed
        const haveRegex = new RegExp(`(i know|have|knows|with|proficient in)\\s+[^.]*?${skill}`, 'i');
        const needRegex = new RegExp(`(need|looking for|want|searching for|require)\\s+[^.]*?${skill}`, 'i');

        if (needRegex.test(lowerQuery)) {
          extractedNeeded.push(skill);
        } else if (haveRegex.test(lowerQuery)) {
          extractedAvailable.push(skill);
        } else {
          // Default to needed if looking for collaborators
          extractedNeeded.push(skill);
        }
      }
    });

    // Fallbacks if no specific trigger pattern matched
    const targetSkills = extractedNeeded.length > 0 ? extractedNeeded : ['react', 'ui/ux', 'figma'];

    // Rank students (excluding current user)
    const matches: AIMatchResult[] = students
      .filter((s) => s.id !== currentUser.id)
      .map((student) => {
        const studentSkillNames = student.skills.map((sk) => sk.name.toLowerCase());
        const matched = targetSkills.filter((req) =>
          studentSkillNames.some((sk) => sk.includes(req) || req.includes(sk))
        );
        const missing = targetSkills.filter((req) => !matched.includes(req));

        // Score formula: base match ratio + availability bonus + project proof bonus
        const skillRatio = targetSkills.length > 0 ? (matched.length / targetSkills.length) * 60 : 30;
        const availBonus = student.status === 'available' ? 25 : 10;
        const proofBonus = Math.min(student.proofs.length * 5, 15);
        const totalScore = Math.min(98, Math.round(skillRatio + availBonus + proofBonus));

        const reasons: string[] = [];
        if (matched.length > 0) {
          reasons.push(`Mastery in ${matched.map((m) => m.toUpperCase()).join(' & ')}`);
        }
        if (student.proofs.length > 0) {
          reasons.push(`${student.proofs.length} verified project proofs in portfolio`);
        }
        if (student.status === 'available') {
          reasons.push('Currently actively looking to join a project');
        }
        if (student.hackathonCount > 1) {
          reasons.push(`Proven hackathon collaborator (${student.hackathonCount} attended)`);
        }

        return {
          student,
          matchScore: totalScore,
          matchedSkills: matched,
          missingSkills: missing,
          reasons
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    return {
      neededSkills: targetSkills,
      availableSkills: extractedAvailable,
      matches
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allStudents: students,
        projects,
        events,
        requests,
        switchUser,
        updateUserStatus,
        createProject,
        addCommentToProject,
        sendCollaborationRequest,
        respondToRequest,
        toggleEventRegistration,
        runSmartMatch
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
