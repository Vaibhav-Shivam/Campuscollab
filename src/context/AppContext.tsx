'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Student, Project, CampusEvent, CollaborationRequest, AIMatchResult, AvailabilityStatus } from '@/types';
import { initialStudents, initialProjects, initialCampusEvents, initialRequests } from '@/data/mockData';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import AuthModal from '@/components/AuthModal';

interface AppContextType {
  currentUser: Student;
  allStudents: Student[];
  projects: Project[];
  events: CampusEvent[];
  requests: CollaborationRequest[];
  isAuthenticated: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (formData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (studentId: string) => void;
  updateUserStatus: (status: AvailabilityStatus, lookingForRole?: string) => void;
  updateUserProfile: (updatedFields: Partial<Student>) => Promise<boolean>;
  createProject: (newProject: Omit<Project, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerAvatar' | 'ownerCollege' | 'comments' | 'likesCount'>) => Project;
  addCommentToProject: (projectId: string, content: string, offeringSkills?: string[]) => void;
  sendCollaborationRequest: (receiverId: string, projectId: string, message: string) => CollaborationRequest;
  respondToRequest: (requestId: string, status: 'accepted' | 'declined') => void;
  toggleEventRegistration: (eventId: string) => void;
  runSmartMatch: (query: string) => { neededSkills: string[]; availableSkills: string[]; matches: AIMatchResult[] };
  showToast: (title: string, type?: 'success' | 'error' | 'info', description?: string) => void;
  refreshStudents: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'campuscollab_students_v2',
  PROJECTS: 'campuscollab_projects_v2',
  EVENTS: 'campuscollab_events_v2',
  REQUESTS: 'campuscollab_requests_v2',
  CURRENT_USER_ID: 'campuscollab_current_user_id_v2',
  AUTH_TOKEN: 'campuscollab_auth_token_v2'
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [events, setEvents] = useState<CampusEvent[]>(initialCampusEvents);
  const [requests, setRequests] = useState<CollaborationRequest[]>(initialRequests);
  const [currentUserId, setCurrentUserId] = useState<string>('student-1');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isHydrated, setIsHydrated] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, type: 'success' | 'error' | 'info' = 'success', description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev.slice(-3), { id, title, description, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  }, [dismissToast]);

  const refreshStudents = useCallback(async () => {
    try {
      const res = await fetch(`/api/students?_t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.students) && data.students.length > 0) {
        setStudents((prev) => {
          const dbStudentMap = new Map(data.students.map((s: Student) => [s.id, s]));
          // 1. Update existing students with fresh data from database
          const updatedExisting = prev.map((s) => dbStudentMap.get(s.id) || s);
          // 2. Identify brand new students from DynamoDB
          const existingIds = new Set(prev.map((s) => s.id));
          const brandNew = data.students.filter((s: Student) => !existingIds.has(s.id));
          // 3. New real signups placed at the front so they are immediately visible
          return [...brandNew, ...updatedExisting];
        });
      }
    } catch (err) {
      console.warn('Failed to refresh students from cloud:', err);
    }
  }, []);

  // Hydrate from localStorage on mount & sync with API
  useEffect(() => {
    try {
      const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const savedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const savedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      const savedUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (savedStudents) setStudents(JSON.parse(savedStudents));
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedRequests) setRequests(JSON.parse(savedRequests));
      if (savedUserId) setCurrentUserId(savedUserId);
      setIsAuthenticated(Boolean(savedToken || savedUserId));
    } catch (e) {
      console.warn('LocalStorage hydration error:', e);
    }
    setIsHydrated(true);

    // Background fetch from cloud API
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects((prev) => {
            const existingIds = new Set(prev.map(p => p.id));
            const fresh = data.projects.filter((p: Project) => !existingIds.has(p.id));
            return [...fresh, ...prev];
          });
        }
      })
      .catch(() => {});

    refreshStudents();
  }, [refreshStudents]);

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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed.' };
      }

      const loggedUser: Student = data.user;
      setStudents((prev) => {
        if (!prev.some(s => s.id === loggedUser.id)) {
          return [loggedUser, ...prev];
        }
        return prev;
      });

      setCurrentUserId(loggedUser.id);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, loggedUser.id);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token || 'demo-token');

      showToast(`Welcome back, ${loggedUser.name}! 🎉`, 'success', 'You are now signed in.');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error during login.' };
    }
  };

  const signup = async (formData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      const newUser: Student = data.user;
      setStudents((prev) => [newUser, ...prev]);
      setCurrentUserId(newUser.id);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token || 'demo-token');

      showToast(`Welcome to CampusCollab, ${newUser.name}! 🚀`, 'success', 'Your student profile is live.');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error during signup.' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    showToast('Logged out safely', 'info', 'See you next time!');
  };

  const switchUser = (studentId: string) => {
    const target = students.find((s) => s.id === studentId);
    if (target) {
      setCurrentUserId(studentId);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, studentId);
      showToast(`Switched profile to ${target.name}`, 'info', target.primaryRole);
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
    showToast(
      status === 'available' ? 'You are now Open for Collabs!' : 'Status set to Looking for Teammates',
      'success',
      lookingForRole ? `Target: ${lookingForRole}` : undefined
    );
  };

  const updateUserProfile = async (updatedFields: Partial<Student>): Promise<boolean> => {
    try {
      const mergedStudent: Student = {
        ...currentUser,
        ...updatedFields,
        id: currentUser.id
      };

      // 1. Update state immediately for instant UI responsiveness
      setStudents((prev) =>
        prev.map((s) => (s.id === currentUser.id ? mergedStudent : s))
      );

      showToast('Profile & Proofs Updated! ✨', 'success', 'Your portfolio links and proofs are now public.');

      // 2. Persist to cloud backend / DynamoDB
      const res = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentUser.id,
          ...updatedFields
        })
      });

      if (!res.ok) {
        console.warn('Student profile update: server status', res.status);
      }
      return true;
    } catch (err: any) {
      console.error('Failed to sync profile update to server:', err);
      showToast('Saved Locally', 'info', 'Saved in browser storage (offline mode).');
      return true;
    }
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
    showToast('Project Published! 🚀', 'success', `"${created.title}" is now live for applications.`);

    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created)
    }).catch((err) => console.warn('Cloud persistence queued:', err));

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
    showToast('Comment posted! 💬', 'success');
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
    showToast('Application Sent! 📬', 'success', `Request delivered to ${targetStudent?.name || 'project owner'}`);
    return newReq;
  };

  const respondToRequest = (requestId: string, status: 'accepted' | 'declined') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
    showToast(
      status === 'accepted' ? 'Collaboration Accepted! 🎉' : 'Request declined',
      status === 'accepted' ? 'success' : 'info'
    );
  };

  const toggleEventRegistration = (eventId: string) => {
    let nowRegistered = false;
    let eventTitle = 'Campus Event';

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const isReg = !e.isRegistered;
          nowRegistered = isReg;
          eventTitle = e.title;
          return {
            ...e,
            isRegistered: isReg,
            attendeesCount: isReg ? e.attendeesCount + 1 : Math.max(0, e.attendeesCount - 1)
          };
        }
        return e;
      })
    );

    showToast(
      nowRegistered ? 'RSVP Confirmed! 🎟️' : 'RSVP Cancelled',
      nowRegistered ? 'success' : 'info',
      eventTitle
    );
  };

  const runSmartMatch = (query: string) => {
    const lowerQuery = query.toLowerCase();

    const knownSkills = [
      'python', 'react', 'ui/ux', 'figma', 'machine learning', 'fastapi',
      'next.js', 'typescript', 'tailwind css', 'node.js', 'aws', 'video editing',
      'premiere pro', 'motion design', 'html/css', 'docker', 'pytorch', 'postgresql',
      'solidity', 'web3', 'flutter', 'react native', 'cybersecurity'
    ];

    const extractedNeeded: string[] = [];
    const extractedAvailable: string[] = [];

    knownSkills.forEach((skill) => {
      if (lowerQuery.includes(skill)) {
        if (
          lowerQuery.includes(`need ${skill}`) ||
          lowerQuery.includes(`looking for ${skill}`) ||
          lowerQuery.includes(`want ${skill}`) ||
          lowerQuery.includes(`require ${skill}`) ||
          lowerQuery.includes(`search ${skill}`)
        ) {
          extractedNeeded.push(skill);
        } else if (
          lowerQuery.includes(`i know ${skill}`) ||
          lowerQuery.includes(`i have ${skill}`) ||
          lowerQuery.includes(`my skill is ${skill}`) ||
          lowerQuery.includes(`skilled in ${skill}`)
        ) {
          extractedAvailable.push(skill);
        } else {
          extractedNeeded.push(skill);
        }
      }
    });

    const targetSkills = extractedNeeded.length > 0 ? extractedNeeded : (knownSkills.filter(s => lowerQuery.includes(s)));

    const matches: AIMatchResult[] = students
      .filter((s) => s.id !== currentUser.id)
      .map((student) => {
        const studentSkillNames = student.skills.map((sk) => sk.name.toLowerCase());
        const matched = targetSkills.filter((req) =>
          studentSkillNames.some((sk) => sk.includes(req) || req.includes(sk))
        );
        const missing = targetSkills.filter((req) => !matched.includes(req));

        let score = 0;
        const reasons: string[] = [];

        if (targetSkills.length > 0) {
          const matchRatio = matched.length / targetSkills.length;
          score += matchRatio * 60;
          if (matched.length > 0) {
            reasons.push(`Verified skills: ${matched.join(', ')}`);
          }
        } else {
          score += 40;
        }

        if (student.status === 'looking') {
          score += 25;
          reasons.push('Actively seeking a project team right now');
        } else if (student.status === 'available') {
          score += 15;
          reasons.push('Available for new collaboration');
        }

        if (student.proofs && student.proofs.length > 0) {
          score += 15;
          reasons.push(`${student.proofs.length} verified portfolio project proof(s) attached`);
        }

        const normalizedScore = Math.min(99, Math.max(35, Math.round(score)));

        return {
          student,
          matchScore: normalizedScore,
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
        isAuthenticated,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        signup,
        logout,
        switchUser,
        updateUserStatus,
        updateUserProfile,
        createProject,
        addCommentToProject,
        sendCollaborationRequest,
        respondToRequest,
        toggleEventRegistration,
        runSmartMatch,
        showToast,
        refreshStudents
      }}
    >
      {children}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
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
