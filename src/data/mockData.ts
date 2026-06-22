import {
  Quote,
  Course,
  SyllabusItem,
  PhysicalActivityLog,
  LiveClass,
  RecordedVideo,
  MockTest,
  Transaction,
  StudentProfile,
  ParentNotification,
  AIKnowledgeBase,
  AISettings
} from '../types';

export const initialQuotes: Quote[] = [
  { id: '1', text: "Either I will come back after hoisting the Tricolour, or I will come back wrapped in it, but I will be back for sure.", author: "Captain Vikram Batra, PVC" },
  { id: '2', text: "Some goals are so worthy, it's glorious even to fail.", author: "Captain Manoj Kumar Pandey, PVC" },
  { id: '3', text: "No Sir, I will not abandon my tank. My gun is still working and I will get these bastards.", author: "Second Lieutenant Arun Khetarpal, PVC" },
  { id: '4', text: "We fight to win and win with a knockout because there are no runners-up in war.", author: "General J.N. Chaudhuri" },
  { id: '5', text: "The safety, honour and welfare of your country come first, always and every time.", author: "Field Marshal Philip Chetwode" }
];

export const initialCourses: Course[] = [
  {
    id: 'nda-1',
    title: 'NDA Target Mission Wing',
    description: 'Comprehensive 1-year residential training program covering Mathematics, General Ability Test (GAT), live physical drill sessions, and intensive SSB Interview preparation.',
    exam: 'National Defence Academy (NDA)',
    duration: '12 Months',
    price: 45000,
    syllabusOverview: ['Paper I: Mathematics (Calculus, Algebra, Vector, Trig)', 'Paper II: General Ability Test (English, Science, GK)', 'Services Selection Board (SSB) Process coaching', 'Daily physical conditioning & Obstacle course training'],
    bannerUrl: 'https://images.unsplash.com/photo-1590172545645-12cf36b955b2?q=80&w=400',
    facultyName: 'Col. Hardeep Singh (Retd.)',
    category: 'Combined'
  },
  {
    id: 'cds-1',
    title: 'CDS Elite Officers Course',
    description: 'Specialized syllabus targeted to clear UPSC CDS exam for entry into IMA, OTA, INA and AFA. Rigorous mock evaluations and psychological SSB prep.',
    exam: 'Combined Defence Services (CDS)',
    duration: '6 Months',
    price: 32000,
    syllabusOverview: ['Elementary Mathematics', 'English Language Skills', 'General Knowledge & Current Affairs', 'Leadership & Situation Reaction Tests'],
    bannerUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=400',
    facultyName: 'Lt. Cdr. Vijay Prasad',
    category: 'Combined'
  },
  {
    id: 'afcat-1',
    title: 'AFCAT Flying & Technical Wings',
    description: 'Premier coaching focusing on Air Force Common Admission Test, including numerical ability, spatial reasoning, aircraft mechanics basics, and flying aptitude evaluations.',
    exam: 'Air Force Common Admission Test (AFCAT)',
    duration: '8 Months',
    price: 35000,
    syllabusOverview: ['General Awareness & Aerospace trivia', 'Verbal Skills in English', 'Numerical Ability & Modern Reasoning', 'Military Aptitude & Spatial Visual Test'],
    bannerUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4e6664104?q=80&w=400',
    facultyName: 'Wing Commander S. K. Nair (Retd.)',
    category: 'Airforce'
  }
];

export const initialSyllabus: SyllabusItem[] = [
  { id: 's1', courseId: 'nda-1', subject: 'Mathematics', topic: 'Differentiation & Calculus Limits', completed: true },
  { id: 's2', courseId: 'nda-1', subject: 'Mathematics', topic: 'Matrices & Determinants', completed: true },
  { id: 's3', courseId: 'nda-1', subject: 'Mathematics', topic: 'Trigonometric Equations', completed: false, pdfUrl: 'nda_math_trig.pdf' },
  { id: 's4', courseId: 'nda-1', subject: 'GAT English', topic: 'Synonyms & Vocabulary Drill', completed: true },
  { id: 's5', courseId: 'nda-1', subject: 'GAT GK', topic: 'Indian Constitution & Assemblies', completed: false, pdfUrl: 'constitution_basics.pdf' },
  { id: 's6', courseId: 'nda-1', subject: 'SSB Prep', topic: 'Thematic Apperception Test (TAT)', completed: false, pdfUrl: 'ssb_tat_guide.pdf' }
];

export const initialPhysicalLogs: PhysicalActivityLog[] = [
  { id: 'p1', date: '21 Jun 2026', runKm: 5.2, pushups: 45, situps: 50, pullups: 10, score: 88, benchmark: 'Excellent (A Grade)' },
  { id: 'p2', date: '20 Jun 2026', runKm: 5.0, pushups: 42, situps: 48, pullups: 9, score: 84, benchmark: 'Good' },
  { id: 'p3', date: '19 Jun 2026', runKm: 4.8, pushups: 40, situps: 45, pullups: 8, score: 80, benchmark: 'Good' },
  { id: 'p4', date: '18 Jun 2026', runKm: 5.5, pushups: 44, situps: 50, pullups: 10, score: 89, benchmark: 'Excellent (A Grade)' },
  { id: 'p5', date: '17 Jun 2026', runKm: 3.0, pushups: 35, situps: 40, pullups: 7, score: 70, benchmark: 'Average' }
];

export const initialLiveClasses: LiveClass[] = [
  {
    id: 'l1',
    title: 'NDA Math: Vector Algebra & 3D Geometry Core',
    facultyName: 'Col. Hardeep Singh (Retd.)',
    time: '09:00 AM - 10:30 AM',
    isLive: true,
    courseId: 'nda-1',
    chatMessages: [
      { sender: 'Cadet Ram Kumar', text: 'Sir, how do we prove the coplanarity condition?', role: 'Student', time: '09:12 AM' },
      { sender: 'Cadet Sai Chandu', text: 'Is this vector triple product in NDA syllabus this year?', role: 'Student', time: '09:15 AM' },
      { sender: 'Col. Hardeep Singh', text: 'Yes, both coplanarity and triple scalar product are highly tested.', role: 'Faculty', time: '09:16 AM' }
    ],
    activePoll: {
      question: 'Have you solved the vector homework worksheet?',
      options: ['Completed entire sheet', 'Completed 50%', 'Not started yet'],
      votes: [12, 8, 4]
    }
  },
  {
    id: 'l2',
    title: 'CDS: Masterclass on Modern Indian History',
    facultyName: 'Lt. Cdr. Vijay Prasad',
    time: '11:30 AM - 01:00 PM',
    isLive: false,
    courseId: 'cds-1',
    chatMessages: []
  }
];

export const initialRecordedVideos: RecordedVideo[] = [
  { id: 'v1', title: 'Matrices and Systems of Linear Equations', duration: '52 mins', courseId: 'nda-1', chapter: 'Maths Unit 2', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', views: 340, dateUploaded: '15 Jun 2026' },
  { id: 'v2', title: 'Newtonian Mechanics & Force Diagrams', duration: '1 hr 12 mins', courseId: 'nda-1', chapter: 'GAT Physics', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', views: 280, dateUploaded: '12 Jun 2026' },
  { id: 'v3', title: 'Active vs Passive Voice & Spotting Errors', duration: '45 mins', courseId: 'nda-1', chapter: 'GAT English', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', views: 190, dateUploaded: '10 Jun 2026' }
];

export const initialMockTests: MockTest[] = [
  {
    id: 'm1',
    title: 'NDA Mathematics Sectional Test 1',
    examType: 'NDA',
    durationMinutes: 45,
    questions: [
      {
        id: 'q1',
        text: 'What is the locus of a point whose distance from a fixed point is constant?',
        options: ['Straight line', 'Circle', 'Parabola', 'Ellipse'],
        correctIndex: 1,
        explanation: 'A circle is defined as the locus of all points in a plane that are at a given constant distance from a fixed center point.'
      },
      {
        id: 'q2',
        text: 'If A and B are symmetric matrices of same order, then AB - BA is a:',
        options: ['Skew-symmetric matrix', 'Symmetric matrix', 'Zero matrix', 'Identity matrix'],
        correctIndex: 0,
        explanation: '(AB - BA)\' = (AB)\' - (BA)\' = B\'A\' - A\'B\' = BA - AB = -(AB - BA). Hence, skew-symmetric.'
      },
      {
        id: 'q3',
        text: 'The value of cos(15°) is equal to:',
        options: ['(√3 - 1)/2√2', '(√3 + 1)/2√2', '(√3 + 1)/2', '(√3 - 1)/2'],
        correctIndex: 1,
        explanation: 'cos(15°) = cos(45° - 30°) = cos(45)cos(30) + sin(45)sin(30) = (1/√2)(√3/2) + (1/√2)(1/2) = (√3 + 1)/2√2.'
      },
      {
        id: 'q4',
        text: 'Find the projection of vector i - j on vector i + j.',
        options: ['0', '1', '√2', '2'],
        correctIndex: 0,
        explanation: 'Projection of vector A on vector B is given by (A.B)/|B|. Here, (i - j).(i + j) = 1 - 1 = 0.'
      }
    ]
  }
];

export const initialTransactions: Transaction[] = [
  { id: 'TXN-9021-A', studentName: 'Cadet Ram Kumar', email: '1999rajagopal9@gmail.com', courseName: 'NDA Target Mission Wing', amount: 45000, status: 'COMPLETED', paymentMethod: 'UPI (GPay)', date: '18 Jun 2026' },
  { id: 'TXN-8310-B', studentName: 'Cadet Sai Chandu', email: 'sai.chandu@gmail.com', courseName: 'CDS Elite Officers Course', amount: 32000, status: 'COMPLETED', paymentMethod: 'Credit Card', date: '14 Jun 2026' },
  { id: 'TXN-4122-C', studentName: 'Cadet Abhinav G', email: 'parent.abhinav@gmail.com', courseName: 'AFCAT Flying & Technical Wings', amount: 35000, status: 'PENDING', paymentMethod: 'UPI QR', date: '21 Jun 2026' }
];

export const initialParentNotifications: ParentNotification[] = [
  { id: 'pn1', title: 'Attendance Warning', message: 'Cadet Ram has maintained 98% attendance this week. Keep up the high standard!', date: '21 Jun 2026', category: 'General' },
  { id: 'pn2', title: 'Weekly Drill Test Results', message: 'Ram scored 88/100 in Physical endurance and obstacle run. Excellent class ranking of #4/120.', date: '20 Jun 2026', category: 'Physical' },
  { id: 'pn3', title: 'Sectional Mock Exam Cleared', message: 'Ram scored 75% in the NDA Algebra section. Highlighted weak area: Vectors.', date: '19 Jun 2026', category: 'Performance' },
  { id: 'pn4', title: 'Fee Status: Fully Cleared', message: 'The tuition receipt #TXN-9021-A is registered and digitally compiled.', date: '18 Jun 2026', category: 'Fees' }
];

export const initialStudents: StudentProfile[] = [
  {
    name: 'Cadet Ram Kumar',
    email: '1999rajagopal9@gmail.com',
    enrollmentId: 'YDA-2026-NDA-0943',
    rank: 'Academy Cadet Sergeant Major (CSM)',
    batch: 'Vikrant Batch (Section A)',
    attendancePercent: 98.4,
    streakDays: 14,
    enrolledCourseId: 'nda-1',
    points: 1250,
    badges: ['Consistent Learner', 'Fitness Champion', 'Math Marshal']
  },
  {
    name: 'Cadet Priya Sharma',
    email: 'priya.sharma@yuvadefense.in',
    enrollmentId: 'YDA-2026-NDA-0102',
    rank: 'Academy Cadet Captain (ACC)',
    batch: 'Vikrant Batch (Section A)',
    attendancePercent: 99.1,
    streakDays: 21,
    enrolledCourseId: 'nda-1',
    points: 1420,
    badges: ['Top Scorer', 'Consistent Learner', 'GAT Tactician', 'Commandant Favorite']
  },
  {
    name: 'Cadet Sai Chandu',
    email: 'sai.chandu@gmail.com',
    enrollmentId: 'YDA-2026-CDS-0321',
    rank: 'Cadet Corporal (CC)',
    batch: 'Vikrant Batch (Section B)',
    attendancePercent: 96.5,
    streakDays: 8,
    enrolledCourseId: 'cds-1',
    points: 1350,
    badges: ['Top Scorer', 'Fitness Champion']
  },
  {
    name: 'Cadet Abhinav G',
    email: 'parent.abhinav@gmail.com',
    enrollmentId: 'YDA-2026-AFC-0789',
    rank: 'Cadet Flight Sergeant (CFS)',
    batch: 'Gagan Flying Cohort',
    attendancePercent: 95.2,
    streakDays: 5,
    enrolledCourseId: 'afcat-1',
    points: 1100,
    badges: ['Consistent Learner']
  },
  {
    name: 'Cadet Aditya Singh',
    email: 'aditya.singh@gmail.com',
    enrollmentId: 'YDA-2026-NDA-0411',
    rank: 'Cadet Lance Corporal',
    batch: 'Vikrant Batch (Section B)',
    attendancePercent: 92.4,
    streakDays: 3,
    enrolledCourseId: 'nda-1',
    points: 950,
    badges: ['Math Marshal']
  }
];

export const initialAIKnowledge: AIKnowledgeBase[] = [
  { id: 'k1', question: 'What is the full admission criteria for Yuva Defense Academy?', answer: 'Admissions require filling out our entrance medical scan form, a basic fitness runtime check (1.6 km run in under 7 minutes, 30 pushups, 40 situps), and an academic assessment matching UPSC guidelines.', category: 'general' },
  { id: 'k2', question: 'How much are the courses?', answer: 'Our core course NDA Target Wing is ₹45,000 for 12 months. CDS course is ₹32,000 for 6 months. AFCAT flying wings is ₹35,000 for 8 months.', category: 'courses' },
  { id: 'k3', question: 'Do you offer residential lodging & food?', answer: 'Yes! Yuva Defense Academy offers mandatory high-discipline military-style hostel board & dining with an optimal high-protein diet program custom tailored for military exams.', category: 'general' },
  { id: 'k4', question: 'What languages does the AI agent understand?', answer: 'I understand English, Telugu (తెలుగు), and Hindi (हिन्दी) perfectly.', category: 'general' }
];

export const initialSettings: AISettings = {
  systemPrompt: 'You are the official Yuva Defense Academy Virtual Chief Drill Officer & Academic Mentor. Speak in a disciplined, high-morale, military cadet officer tone. Command respect, use occasional patriotic words like "Jai Hind", "Squadron", "Cadet", "Incredible valor". Give brief and precise answers in English, Telugu, or Hindi as requested. Teach syllabus and admissions clearly.',
  selectedLanguage: 'all',
  enableVoice: true,
  knowledgeBase: initialAIKnowledge
};
