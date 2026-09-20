'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Student, Project, CampusEvent, CollaborationRequest, AIMatchResult, AvailabilityStatus, ProjectComment } from '@/types';
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
  isHydrated: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (formData: any) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  updateUserStatus: (status: AvailabilityStatus, lookingForRole?: string) => void;
  updateUserProfile: (updatedFields: Partial<Student>) => Promise<boolean>;
  createProject: (newProject: Omit<Project, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerAvatar' | 'ownerCollege' | 'comments' | 'likesCount'>) => Promise<Project | null>;
  addCommentToProject: (projectId: string, content: string, offeringSkills?: string[]) => Promise<boolean>;
  sendCollaborationRequest: (receiverId: string, projectId: string, message: string) => Promise<CollaborationRequest | null>;
  respondToRequest: (requestId: string, status: 'accepted' | 'declined') => Promise<boolean>;
  toggleEventRegistration: (eventId: string) => Promise<boolean>;
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
  IS_ADMIN: 'campuscollab_is_admin_v1'
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [events, setEvents] = useState<CampusEvent[]>(initialCampusEvents);
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
      if (data.success && Array.isArray(data.students)) {
        // REAL USERS ONLY: Filter out any legacy mock demo personas
        const realStudents: Student[] = data.students.filter(
          (s: Student) => !s.id.match(/^student-[1-6]$/)
        );
        setStudents(realStudents);
        try {
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(realStudents));
        } catch (e) {}
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
      localStorage.removeItem('campuscollab_auth_token_v2'); // Purge legacy insecure JWT localStorage

      const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const savedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const savedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      const savedUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const savedIsAdmin = localStorage.getItem(STORAGE_KEYS.IS_ADMIN);

      if (savedStudents) {
        try {
          const parsed = JSON.parse(savedStudents);
          const realOnly = Array.isArray(parsed)
            ? parsed.filter((s: Student) => !s.id.match(/^student-[1-6]$/))
            : [];
          setStudents(realOnly);
        } catch (e) {}
      }
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedRequests) setRequests(JSON.parse(savedRequests));
      if (savedUserId && !savedUserId.match(/^student-[1-6]$/)) {
        setCurrentUserId(savedUserId);
      } else {
        setCurrentUserId('');
      }
      setIsAdmin(savedIsAdmin === 'true');
    } catch (e) {
      console.warn('LocalStorage hydration error:', e);
    }
    setIsHydrated(true);

    // Sync authenticated session with server (HttpOnly cookie verified)
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.session) {
          setIsAuthenticated(true);
          setIsAdmin(Boolean(data.isAdmin));
          if (data.session.userId) {
            setCurrentUserId(data.session.userId);
            try {
              localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, data.session.userId);
            } catch (e) {}
          }
          const loadedUser = data.user || data.student;
          if (loadedUser) {
            setStudents((prev) => [loadedUser, ...prev.filter((s) => s.id !== loadedUser.id)]);
          }
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setCurrentUserId('');
          try {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
            localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
          } catch (e) {}
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
      if (currentUserId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [students, projects, events, requests, currentUserId, isHydrated]);

  const fallbackUser: Student = {
    id: currentUserId || 'guest',
    name: isAuthenticated ? 'Campus Member' : 'Guest Visitor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    college: 'Campus Network',
    year: 'Student',
    major: 'Computer Science',
    primaryRole: 'Collaborator',
    bio: '',
    status: 'available',
    skills: [],
    projectCount: 0,
    hackathonCount: 0,
    email: '',
    interests: [],
    proofs: []
  };

  const currentUser: Student =
    (isAuthenticated && currentUserId ? students.find((s) => s.id === currentUserId) : null) ||
    fallbackUser;

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
      } catch (e) {}

      if (data.user) {
        const adminUser: Student = data.user;
        setStudents((prev) => [adminUser, ...prev.filter((s) => s.id !== adminUser.id)]);
        setCurrentUserId(adminUser.id);
        try {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, adminUser.id);
        } catch (e) {}
      }

      showToast('Admin Access Granted 👑', 'success', 'Administrator control portal is unlocked.');
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
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
      localStorage.removeItem('campuscollab_registered_credentials_v1');
    } catch (e) {}
    setCurrentUserId('');
    showToast('Logged out safely', 'info', 'See you next time!');
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
      const res = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentUser.id,
          ...updatedFields
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast('Profile Update Failed', 'error', data.error || 'Server error updating profile.');
        return false;
      }

      const mergedStudent: Student = data.student || {
        ...currentUser,
        ...updatedFields,
        id: currentUser.id
      };

      setStudents((prev) => {
        const exists = prev.some((s) => s.id === currentUser.id);
        if (exists) {
          return prev.map((s) => (s.id === currentUser.id ? mergedStudent : s));
        }
        return [mergedStudent, ...prev];
      });

      showToast('Profile & Proofs Updated! ✨', 'success', 'Your portfolio links and proofs are now public.');
      return true;
    } catch (err: any) {
      console.error('Failed to sync profile update to server:', err);
      showToast('Connection Error', 'error', 'Failed to connect to server.');
      return false;
    }
  };

  const createProject = async (
    newProject: Omit<
      Project,
      'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerAvatar' | 'ownerCollege' | 'comments' | 'likesCount'
    >
  ): Promise<Project | null> => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      const data = await res.json();

      if (!res.ok || !data.success || !data.project) {
        showToast('Failed to Post Project', 'error', data.error || 'Could not publish project.');
        return null;
      }

      const created: Project = data.project;
      setProjects((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
      showToast('Project Published! 🚀', 'success', `"${created.title}" is now live for applications.`);
      return created;
    } catch (err: any) {
      showToast('Network Error', 'error', 'Could not save project to server.');
      return null;
    }
  };

  const addCommentToProject = async (projectId: string, content: string, offeringSkills?: string[]): Promise<boolean> => {
    try {
      const res = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          offeringSkills
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success || !data.comment) {
        showToast('Comment Failed', 'error', data.error || 'Failed to post comment.');
        return false;
      }

      const newComment: ProjectComment = data.comment;
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, comments: [...(p.comments || []), newComment] } : p
        )
      );
      showToast('Comment posted! 💬', 'success');
      return true;
    } catch (err) {
      showToast('Network Error', 'error', 'Could not post comment to server.');
      return false;
    }
  };

  const sendCollaborationRequest = async (
    receiverId: string,
    projectId: string,
    message: string
  ): Promise<CollaborationRequest | null> => {
    try {
      const targetStudent = students.find((s) => s.id === receiverId);
      const targetProject = projects.find((p) => p.id === projectId);

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId,
          receiverName: targetStudent ? targetStudent.name : undefined,
          projectId,
          projectTitle: targetProject ? targetProject.title : undefined,
          message: message.trim(),
          contactEmail: currentUser.email
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success || !data.request) {
        showToast('Request Failed', 'error', data.error || 'Could not send request.');
        return null;
      }

      const createdReq: CollaborationRequest = data.request;
      setRequests((prev) => [createdReq, ...prev.filter((r) => r.id !== createdReq.id)]);
      showToast('Application Sent! 📬', 'success', `Request delivered to ${targetStudent?.name || 'project owner'}`);
      return createdReq;
    } catch (err: any) {
      showToast('Network Error', 'error', 'Could not deliver collaboration request.');
      return null;
    }
  };

  const respondToRequest = async (requestId: string, status: 'accepted' | 'declined'): Promise<boolean> => {
    try {
      const res = await fetch('/api/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast('Action Failed', 'error', data.error || 'Could not update request status.');
        return false;
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status } : r))
      );
      showToast(
        status === 'accepted' ? 'Collaboration Accepted! 🎉' : 'Request declined',
        status === 'accepted' ? 'success' : 'info'
      );
      return true;
    } catch (err) {
      showToast('Network Error', 'error', 'Could not update request on server.');
      return false;
    }
  };

  const toggleEventRegistration = async (eventId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast('RSVP Failed', 'error', data.error || 'Could not update event RSVP.');
        return false;
      }

      const isNowRegistered = Boolean(data.isRegistered);
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === eventId) {
            return {
              ...e,
              isRegistered: isNowRegistered,
              attendeesCount: isNowRegistered ? e.attendeesCount + 1 : Math.max(0, e.attendeesCount - 1)
            };
          }
          return e;
        })
      );

      showToast(
        isNowRegistered ? 'RSVP Confirmed! 🎟️' : 'RSVP Cancelled',
        isNowRegistered ? 'success' : 'info'
      );
      return true;
    } catch (err) {
      showToast('Network Error', 'error', 'Could not connect to event service.');
      return false;
    }
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
        isHydrated,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        signup,
        resetPassword,
        logout,
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
