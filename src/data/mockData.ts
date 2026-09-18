import { Student, Project, CampusEvent, CollaborationRequest } from '@/types';

export const initialStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    college: 'Institute of Engineering & Tech',
    year: '3rd Year',
    major: 'Computer Science',
    primaryRole: 'AI & Python Developer',
    bio: 'Passionate about building applied ML solutions and backend systems. Currently exploring LLM workflows and vector search.',
    status: 'looking',
    lookingForRole: 'UI/UX Designer and React Developer for AI Expense Tracker',
    skills: [
      { name: 'Python', level: 5, category: 'AI/ML' },
      { name: 'Machine Learning', level: 4, category: 'AI/ML' },
      { name: 'FastAPI', level: 4, category: 'Development' },
      { name: 'PyTorch', level: 4, category: 'AI/ML' },
      { name: 'PostgreSQL', level: 3, category: 'Development' }
    ],
    projectCount: 3,
    hackathonCount: 2,
    portfolioUrl: 'https://github.com/rahul-sharma-dev',
    githubUrl: 'https://github.com/rahul-sharma-dev',
    email: 'rahul.s@campuscollab.edu',
    interests: ['AI Tools', 'Hackathons', 'Developer Productivity', 'FinTech'],
    proofs: [
      {
        title: 'AI Expense Tracker (Core Engine)',
        description: 'Automated receipt parsing and classification using fine-tuned embeddings and FastAPI backend.',
        role: 'Lead ML Developer',
        technologies: ['Python', 'FastAPI', 'Torch', 'Docker'],
        githubUrl: 'https://github.com/rahul-sharma-dev/expense-ml-core',
        liveDemoUrl: 'https://expense-demo.campuscollab.app'
      },
      {
        title: 'Smart Campus Attendance System',
        description: 'Edge computer vision pipeline recognizing facial embeddings across 3 camera feeds with low latency.',
        role: 'Computer Vision Engineer',
        technologies: ['Python', 'OpenCV', 'FastAPI', 'Redis'],
        githubUrl: 'https://github.com/rahul-sharma-dev/campus-vision-attend'
      }
    ]
  },
  {
    id: 'student-2',
    name: 'Ananya Sen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    college: 'School of Design & Media',
    year: '2nd Year',
    major: 'Visual Communication & UX',
    primaryRole: 'UI/UX Designer',
    bio: 'Creating thoughtful design systems, intuitive user journeys, and tactile Figma prototypes with a strong focus on mobile usability.',
    status: 'available',
    lookingForRole: 'Frontend developers building real-world student tools',
    skills: [
      { name: 'Figma', level: 5, category: 'Design' },
      { name: 'UI/UX', level: 5, category: 'Design' },
      { name: 'User Research', level: 4, category: 'Design' },
      { name: 'Prototyping', level: 5, category: 'Design' },
      { name: 'Design Systems', level: 4, category: 'Design' }
    ],
    projectCount: 4,
    hackathonCount: 3,
    portfolioUrl: 'https://behance.net/ananyasen-design',
    figmaUrl: 'https://figma.com/@ananya_ux',
    email: 'ananya.sen@campuscollab.edu',
    interests: ['Design Systems', 'Mobile UX', 'Micro-interactions', 'FinTech UI'],
    proofs: [
      {
        title: 'Campus Food Delivery Redesign',
        description: 'End-to-end UX case study, design system, and clickable Figma prototype for dormitory food ordering.',
        role: 'Product Designer',
        technologies: ['Figma', 'FigJam', 'Wireframing'],
        figmaUrl: 'https://figma.com/@ananya_ux/dorm-bites'
      },
      {
        title: 'GreenTrack Sustainability Dashboard',
        description: 'Clean, warm dashboard interface tracking personal carbon footprints with custom SVG badges and progress rings.',
        role: 'Sole UI/UX Designer',
        technologies: ['Figma', 'Illustration', 'User Testing'],
        liveDemoUrl: 'https://ananya-greentrack.framer.website'
      }
    ]
  },
  {
    id: 'student-3',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    college: 'Institute of Engineering & Tech',
    year: '3rd Year',
    major: 'Information Technology',
    primaryRole: 'Frontend & React Developer',
    bio: 'Bridging beautiful designs and performant web apps. Obsessed with clean component architecture, Tailwind CSS, and smooth animations.',
    status: 'available',
    lookingForRole: 'Fast-paced hackathons or creative AI projects',
    skills: [
      { name: 'React', level: 5, category: 'Development' },
      { name: 'TypeScript', level: 4, category: 'Development' },
      { name: 'Next.js', level: 4, category: 'Development' },
      { name: 'Tailwind CSS', level: 5, category: 'Development' },
      { name: 'UI/UX', level: 3, category: 'Design' }
    ],
    projectCount: 4,
    hackathonCount: 4,
    portfolioUrl: 'https://priyapatel.dev',
    githubUrl: 'https://github.com/priyapatel-dev',
    email: 'priya.patel@campuscollab.edu',
    interests: ['Frontend Engineering', 'Web Performance', 'Hackathon Teams', 'EdTech'],
    proofs: [
      {
        title: 'Interactive Study Room Planner',
        description: 'Real-time interactive canvas built with Next.js and Tailwind allowing students to reserve study pods.',
        role: 'Lead Frontend Engineer',
        technologies: ['React', 'Next.js', 'Tailwind CSS', 'Zustand'],
        githubUrl: 'https://github.com/priyapatel-dev/study-pod-planner',
        liveDemoUrl: 'https://study-pods.vercel.app'
      },
      {
        title: 'Club Event Showcase Portal',
        description: 'Responsive event discovery platform featuring smooth transitions, calendar feeds, and ticket RSVP flow.',
        role: 'Frontend Developer',
        technologies: ['React', 'Framer Motion', 'Tailwind CSS'],
        githubUrl: 'https://github.com/priyapatel-dev/club-showcase'
      }
    ]
  },
  {
    id: 'student-4',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    college: 'School of Design & Tech',
    year: '2nd Year',
    major: 'Human-Computer Interaction',
    primaryRole: 'Product & UI/UX Designer',
    bio: 'Crafting thoughtful digital products, editorial user interfaces, and brand identities with earthy colors and bold typography.',
    status: 'available',
    lookingForRole: 'Web applications and creative platforms',
    skills: [
      { name: 'UI/UX', level: 5, category: 'Design' },
      { name: 'Figma', level: 5, category: 'Design' },
      { name: 'Product Design', level: 4, category: 'Design' },
      { name: 'Framer', level: 4, category: 'Design' },
      { name: 'HTML/CSS', level: 3, category: 'Development' }
    ],
    projectCount: 3,
    hackathonCount: 2,
    portfolioUrl: 'https://aaravsharma.design',
    figmaUrl: 'https://figma.com/@aarav_hci',
    email: 'aarav.sharma@campuscollab.edu',
    interests: ['Product Design', 'Editorial UI', 'Interaction Design', 'Micro-interactions'],
    proofs: [
      {
        title: 'Botanical Herbarium Explorer',
        description: 'Digital interactive catalog for campus botanical garden featuring high-res imagery and tactile cards.',
        role: 'Sole Designer & Prototyper',
        technologies: ['Figma', 'Framer', 'Prototyping'],
        figmaUrl: 'https://figma.com/@aarav_hci/herbarium'
      }
    ]
  },
  {
    id: 'student-5',
    name: 'Rohan Mehta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    college: 'Institute of Engineering & Tech',
    year: '4th Year',
    major: 'Computer Science',
    primaryRole: 'Full Stack & Cloud Developer',
    bio: 'Architecting scalable web platforms with Next.js, Node.js, and AWS Lambda. Cloud Club lead and mentor.',
    status: 'looking',
    lookingForRole: 'Frontend developers for AI Study Planner',
    skills: [
      { name: 'React', level: 4, category: 'Development' },
      { name: 'Node.js', level: 5, category: 'Development' },
      { name: 'AWS', level: 4, category: 'Development' },
      { name: 'TypeScript', level: 4, category: 'Development' },
      { name: 'GraphQL', level: 4, category: 'Development' }
    ],
    projectCount: 6,
    hackathonCount: 5,
    portfolioUrl: 'https://rohanmehta.cloud',
    githubUrl: 'https://github.com/rohan-cloud-dev',
    email: 'rohan.m@campuscollab.edu',
    interests: ['Serverless', 'AWS Architecture', 'Hackathons', 'Scalable Systems'],
    proofs: [
      {
        title: 'Serverless Real-Time Polls',
        description: 'AWS Lambda + API Gateway WebSocket solution handling 10,000 concurrent live campus votes during elections.',
        role: 'Cloud Architect',
        technologies: ['AWS Lambda', 'DynamoDB', 'WebSockets', 'TypeScript'],
        githubUrl: 'https://github.com/rohan-cloud-dev/serverless-campus-polls'
      }
    ]
  },
  {
    id: 'student-6',
    name: 'Kunal Verma',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
    college: 'Faculty of Arts & Media',
    year: '3rd Year',
    major: 'Digital Media & Storytelling',
    primaryRole: 'Video Editor & Motion Designer',
    bio: 'Creating cinematic product trailers, motion graphics, and demo videos for student startups and hackathon submissions.',
    status: 'available',
    lookingForRole: 'Demo videos and launch presentations',
    skills: [
      { name: 'Video Editing', level: 5, category: 'Video' },
      { name: 'Premiere Pro', level: 5, category: 'Video' },
      { name: 'After Effects', level: 4, category: 'Video' },
      { name: 'Motion Design', level: 4, category: 'Design' },
      { name: 'Content Writing', level: 3, category: 'Content' }
    ],
    projectCount: 5,
    hackathonCount: 3,
    portfolioUrl: 'https://vimeo.com/kunalverma',
    email: 'kunal.v@campuscollab.edu',
    interests: ['Product Demos', 'Motion Graphics', 'Storytelling', 'Video Production'],
    proofs: [
      {
        title: 'Hackathon Grand Prize Pitch Video',
        description: 'High-energy 90-second promotional explainer video featuring 3D product motion and voiceover syncing.',
        role: 'Director & Motion Designer',
        technologies: ['Premiere Pro', 'After Effects', 'Sound Design'],
        liveDemoUrl: 'https://youtube.com/watch?v=demo-pitch-sample'
      }
    ]
  }
];

export const initialProjects: Project[] = [
  {
    id: 'project-1',
    title: 'AI Expense Tracker for Students',
    tagline: 'Smart receipt scanner and budget companion built for university students.',
    description: 'An AI-powered mobile and web application that categorizes college expenses, alerts roommates on shared grocery bills, and forecasts end-of-semester budgets using local LLM reasoning. We have the Python backend running and need a passionate UI/UX designer and React developer.',
    type: 'Startup',
    ownerId: 'student-1',
    ownerName: 'Rahul Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    ownerCollege: 'Institute of Engineering & Tech',
    createdAt: '2 days ago',
    requiredSkills: ['UI/UX', 'Figma', 'React', 'Tailwind CSS'],
    currentMembers: 2,
    maxMembers: 4,
    isOpen: true,
    likesCount: 24,
    tags: ['AI/ML', 'FinTech', 'React', 'Mobile First'],
    comments: [
      {
        id: 'comment-1',
        authorId: 'student-2',
        authorName: 'Ananya Sen',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        authorRole: 'UI/UX Designer',
        content: 'I love this idea! I have previously worked on 4 campus finance & food apps in Figma and would love to design the wireframes and design system for this.',
        createdAt: '1 day ago',
        offeringSkills: ['UI/UX', 'Figma']
      },
      {
        id: 'comment-2',
        authorId: 'student-3',
        authorName: 'Priya Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
        authorRole: 'Frontend & React Developer',
        content: 'I can help build the frontend in React + Tailwind! The FastAPI integration will be straightforward with TanStack Query.',
        createdAt: '18 hours ago',
        offeringSkills: ['React', 'Tailwind CSS']
      }
    ]
  },
  {
    id: 'project-2',
    title: 'AI Study Planner & Exam Cram',
    tagline: 'Autonomous study timetable generator syncing syllabi with exam dates.',
    description: 'Building an intelligent study planner for college students. It ingests semester course outlines, identifies weak areas through short quizzes, and schedules optimal review sessions with spaced repetition algorithms.',
    type: 'Hackathon',
    ownerId: 'student-5',
    ownerName: 'Rohan Mehta',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    ownerCollege: 'Institute of Engineering & Tech',
    createdAt: '1 day ago',
    requiredSkills: ['AI/ML', 'UI/UX', 'Frontend', 'Next.js'],
    currentMembers: 2,
    maxMembers: 4,
    isOpen: true,
    likesCount: 19,
    tags: ['EdTech', 'Productivity', 'Next.js', 'Hackathon'],
    comments: [
      {
        id: 'comment-3',
        authorId: 'student-6',
        authorName: 'Kunal Verma',
        authorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
        authorRole: 'Video Editor & Motion Designer',
        content: 'If you need an engaging demo video or presentation animation for the final hackathon pitch, count me in!',
        createdAt: '12 hours ago',
        offeringSkills: ['Video Editing', 'Motion Design']
      }
    ]
  },
  {
    id: 'project-3',
    title: 'EcoCampus Cycle Sharing Portal',
    tagline: 'Peer-to-peer bicycle sharing & maintenance tracker on campus.',
    description: 'A student-led green initiative to track, unlock, and share campus bicycles using QR codes and geolocation tags. Needs a mobile-friendly frontend and someone skilled in real-time mapping.',
    type: 'Academic',
    ownerId: 'student-4',
    ownerName: 'Aarav Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    ownerCollege: 'School of Design & Tech',
    createdAt: '3 days ago',
    requiredSkills: ['React', 'Mapbox', 'Node.js', 'UI/UX'],
    currentMembers: 1,
    maxMembers: 3,
    isOpen: true,
    likesCount: 31,
    tags: ['Sustainability', 'IoT', 'Mobile', 'Maps'],
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
    description: 'A 36-hour hackathon to build cloud & AI solutions for campus sustainability, student productivity, and community welfare. Sponsored by AWS with $5,000 in cloud credits.',
    organizer: 'AWS Student Chapter',
    attendeesCount: 142,
    isRegistered: false,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    skillsFocus: ['AWS', 'AI/ML', 'React', 'Python', 'UI/UX']
  },
  {
    id: 'event-2',
    title: 'Design Systems & Figma Masterclass',
    category: 'Workshop',
    date: 'Sep 28, 2026',
    location: 'Design Lab Room 204',
    isOnline: false,
    description: 'Hands-on session on building scalable design tokens, component variants, and interactive tactile micro-interactions in Figma.',
    organizer: 'Design Guild',
    attendeesCount: 68,
    isRegistered: true,
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
    skillsFocus: ['Figma', 'UI/UX', 'Design Tokens']
  },
  {
    id: 'event-3',
    title: 'Full Stack AI Builders Meetup',
    category: 'Club Meetup',
    date: 'Oct 02, 2026',
    location: 'Online via Discord Stage',
    isOnline: true,
    description: 'Show & Tell for campus projects using local embeddings, LangChain, and modern React interfaces. Network and find project teammates.',
    organizer: 'Developers Circle',
    attendeesCount: 95,
    isRegistered: false,
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    skillsFocus: ['Next.js', 'FastAPI', 'PyTorch', 'Vector Search']
  }
];

export const initialRequests: CollaborationRequest[] = [
  {
    id: 'req-1',
    senderId: 'student-1',
    senderName: 'Rahul Sharma',
    senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    senderRole: 'AI & Python Developer',
    receiverId: 'student-2',
    receiverName: 'Ananya Sen',
    projectId: 'project-1',
    projectTitle: 'AI Expense Tracker for Students',
    message: 'Hi Ananya! We are building an AI Expense Tracker and love your portfolio on Behance. We need a UI/UX designer to craft our user flows and Figma components. Would you like to collaborate with us?',
    status: 'pending',
    createdAt: '1 day ago',
    contactEmail: 'rahul.s@campuscollab.edu'
  },
  {
    id: 'req-2',
    senderId: 'student-1',
    senderName: 'Rahul Sharma',
    senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    senderRole: 'AI & Python Developer',
    receiverId: 'student-3',
    receiverName: 'Priya Patel',
    projectId: 'project-1',
    projectTitle: 'AI Expense Tracker for Students',
    message: 'Hey Priya! Saw your Study Room Planner project on GitHub — the frontend clean architecture is impressive. We need a React + Tailwind developer for our AI Expense Tracker. Interested in teaming up?',
    status: 'accepted',
    createdAt: '2 days ago',
    contactEmail: 'rahul.s@campuscollab.edu'
  }
];
