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
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (formData: any) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
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
  isRefreshingStudents: boolean;
  isAdmin: boolean;
  loginAsAdmin: (passkey: string) => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'campuscollab_students_v2',
  PROJECTS: 'campuscollab_projects_v2',
  EVENTS: 'campuscollab_events_v2',
  REQUESTS: 'campuscollab_requests_v2',
  CURRENT_USER_ID: 'campuscollab_current_user_id_v2',
  AUTH_TOKEN: 'campuscollab_auth_token_v2',
  IS_ADMIN: 'campuscollab_is_admin_v1'
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [events, setEvents] = useState<CampusEvent[]>(initialCampusEvents);
  const [requests, setRequests] = useState<CollaborationRequest[]>(initialRequests);
  const [currentUserId, setCurrentUserId] = useState<string>('student-1');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
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

  const [isRefreshingStudents, setIsRefreshingStudents] = useState<boolean>(false);

  const refreshStudents = useCallback(async () => {
    setIsRefreshingStudents(true);
    try {
      const res = await fetch(`/api/students?_t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.students) && data.students.length > 0) {
        setStudents((prev) => {
          const serverStudents: Student[] = data.students;
          const serverStudentMap = new Map(serverStudents.map((s) => [s.id, s]));

          // Preserve any newly created local student that hasn't synced yet
          const localOnly = prev.filter((s) => !serverStudentMap.has(s.id));

          // Auto-sync local signups to server if server was restarted
          if (localOnly.length > 0) {
            localOnly.forEach((localStd) => {
              if (localStd.id.startsWith('student-17') || !localStd.id.match(/^student-[1-6]$/)) {
                fetch('/api/students', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(localStd)
                }).catch(() => {});
              }
            });
          }

          // Separate real signups from mock students
          const realStudents: Student[] = [];
          const mockStudents: Student[] = [];

          for (const s of serverStudents) {
            if (s.id.startsWith('student-17') || s.id === 'student-live-test' || !s.id.match(/^student-[1-6]$/)) {
              realStudents.push(s);
            } else {
              mockStudents.push(s);
            }
          }

          // Sort real students by newest first
          realStudents.sort((a, b) => {
            const timeA = parseInt(a.id.replace('student-', ''), 10) || 0;
            const timeB = parseInt(b.id.replace('student-', ''), 10) || 0;
            return timeB - timeA;
          });

          const merged = [...localOnly, ...realStudents, ...mockStudents];

          try {
            localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(merged));
          } catch (e) {
            console.warn('Failed to sync students to localStorage:', e);
          }

          return merged;
        });
      }
    } catch (err) {
      console.warn('Failed to refresh students from cloud:', err);
    } finally {
      setIsRefreshingStudents(false);
    }
  }, []);

  // Hydrate from localStorage on mount & sync with API
  useEffect(() => {
    try {
      localStorage.removeItem('campuscollab_registered_credentials_v1'); // Purge legacy raw password cache

      const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const savedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const savedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      const savedUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const savedIsAdmin = localStorage.getItem(STORAGE_KEYS.IS_ADMIN);

      if (savedStudents) setStudents(JSON.parse(savedStudents));
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedRequests) setRequests(JSON.parse(savedRequests));
      if (savedUserId) setCurrentUserId(savedUserId);
      setIsAuthenticated(Boolean(savedToken || savedUserId));
      setIsAdmin(savedIsAdmin === 'true');
    } catch (e) {
      console.warn('LocalStorage hydration error:', e);
    }
    setIsHydrated(true);

    // Sync authenticated session with server
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.session) {
          setIsAuthenticated(true);
          setIsAdmin(Boolean(data.isAdmin));
          if (data.session.userId) {
            setCurrentUserId(data.session.userId);
          }
          if (data.student) {
            setStudents((prev) => [data.student, ...prev.filter((s) => s.id !== data.student.id)]);
          }
        }
      })
      .catch(() => {});

    // Fetch projects from cloud API
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch(() => {});

    // Fetch events from cloud API
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.events) && data.events.length > 0) {
          setEvents(data.events);
        }
      })
      .catch(() => {});

    // Fetch collaboration requests from cloud API
    fetch('/api/requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.requests) && data.requests.length > 0) {
          setRequests(data.requests);
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
      const normalizedEmail = email.trim().toLowerCase();
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed.' };
      }

      const loggedUser: Student = data.user;
      setStudents((prev) => {
        const updated = [loggedUser, ...prev.filter((s) => s.id !== loggedUser.id)];
        try {
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      setCurrentUserId(loggedUser.id);
      setIsAuthenticated(true);

      const isAdminEmail = Boolean(data.isAdmin || (loggedUser.email || '').toLowerCase() === 'mrvaibhavshivam1930@gmail.com');
      setIsAdmin(isAdminEmail);
      try {
        if (isAdminEmail) {
          localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'true');
        } else {
          localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
        }
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, loggedUser.id);
        if (data.token) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        }
      } catch (e) {}

      showToast(`Welcome back, ${loggedUser.name}! 🎉`, 'success', isAdminEmail ? 'Logged in with Admin privileges.' : 'You are now signed in.');
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
      setStudents((prev) => {
        const updated = [newUser, ...prev.filter((s) => s.id !== newUser.id)];
        try {
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      setCurrentUserId(newUser.id);
      setIsAuthenticated(true);
      setIsAdmin(Boolean(data.isAdmin));
      try {
        if (data.isAdmin) {
          localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'true');
        } else {
          localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
        }
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
        if (data.token) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        }
      } catch (e) {}

      showToast(`Welcome to CampusCollab, ${newUser.name}! 🚀`, 'success', 'Your student profile is live.');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error during signup.' };
    }
  };

  const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, newPassword })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Password reset failed.' };
      }

      showToast('Password Reset Successfully! 🔑', 'success', 'You can now sign in with your new password.');
      return { success: true, message: data.message };
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error during password reset.' };
    }
  };

  const loginAsAdmin = async (passkey: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkey.trim() })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid Administrator Passkey.' };
      }

      setIsAdmin(true);
      setIsAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'true');
        if (data.token) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        }
      } catch (e) {}

      if (data.user) {
        const adminUser: Student = data.user;
        setStudents((prev) => [adminUser, ...prev.filter((s) => s.id !== adminUser.id)]);
        setCurrentUserId(adminUser.id);
        try {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, adminUser.id);
        } catch (e) {}
      }

      showToast('Admin Access Granted 👑', 'success', 'Demo Persona Switcher is unlocked for you.');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error connecting to admin auth service.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setIsAuthenticated(false);
    setIsAdmin(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
      localStorage.removeItem('campuscollab_registered_credentials_v1');
    } catch (e) {}
    setCurrentUserId('student-1');
    showToast('Logged out safely', 'info', 'See you next time!');
  };

  const switchUser = (studentId: string) => {
    if (!isAdmin) {
      showToast('Admin Only Feature 🔒', 'error', 'Demo Persona Switcher is restricted to Administrator.');
      return;
    }
    const target = students.find((s) => s.id === studentId);
    if (target) {
      setCurrentUserId(studentId);
      setIsAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, studentId);
      } catch (e) {}
      showToast(`Switched persona to ${target.name}`, 'info', target.primaryRole);
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
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.primaryRole,
      content: content.trim(),
      createdAt: 'Just now',
      offeringSkills: offeringSkills && offeringSkills.length > 0 ? offeringSkills : undefined
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, comments: [...(p.comments || []), newComment] } : p
      )
    );
    showToast('Comment posted! 💬', 'success');

    fetch(`/api/projects/${projectId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: content.trim(),
        offeringSkills,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorRole: currentUser.primaryRole
      })
    }).catch((err) => console.warn('Comment cloud persistence error:', err));
  };

  const sendCollaborationRequest = (
    receiverId: string,
    projectId: string,
    message: string
  ): CollaborationRequest => {
    const targetStudent = students.find((s) => s.id === receiverId);
    const targetProject = projects.find((p) => p.id === projectId);

    const newReq: CollaborationRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.primaryRole,
      receiverId,
      receiverName: targetStudent ? targetStudent.name : 'Teammate',
      projectId,
      projectTitle: targetProject ? targetProject.title : 'Project Collaboration',
      message: message.trim(),
      status: 'pending',
      createdAt: 'Just now',
      contactEmail: currentUser.email
    };

    setRequests((prev) => [newReq, ...prev]);
    showToast('Application Sent! 📬', 'success', `Request delivered to ${targetStudent?.name || 'project owner'}`);

    fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receiverId,
        projectId,
        message: message.trim(),
        contactEmail: currentUser.email
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.request) {
          setRequests((prev) => [data.request, ...prev.filter((r) => r.id !== newReq.id)]);
        }
      })
      .catch((err) => console.warn('Request cloud persistence error:', err));

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

    fetch('/api/requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, status })
    }).catch((err) => console.warn('Request status cloud persistence error:', err));
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

    fetch(`/api/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    }).catch((err) => console.warn('Event RSVP cloud persistence error:', err));
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
        resetPassword,
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
        refreshStudents,
        isRefreshingStudents,
        isAdmin,
        loginAsAdmin
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
