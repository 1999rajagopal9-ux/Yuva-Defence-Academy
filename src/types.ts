export interface Quote {
  id: string;
  text: string;
  author: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  exam: string;
  duration: string;
  price: number;
  syllabusOverview: string[];
  bannerUrl: string;
  facultyName: string;
  category: 'Army' | 'Navy' | 'Airforce' | 'Combined';
}

export interface SyllabusItem {
  id: string;
  courseId: string;
  subject: string;
  topic: string;
  completed: boolean;
  notesUrl?: string;
  pdfUrl?: string;
}

export interface PhysicalActivityLog {
  id: string;
  date: string;
  runKm: number;
  pushups: number;
  situps: number;
  pullups: number;
  score: number; // calculated 0-100 military standard index
  benchmark: string;
}

export interface LiveClass {
  id: string;
  title: string;
  facultyName: string;
  time: string;
  isLive: boolean;
  courseId: string;
  whiteboardData?: string; // canvas drawing commands
  chatMessages: { sender: string; text: string; role: string; time: string }[];
  activePoll?: {
    question: string;
    options: string[];
    votes: number[];
    hasVoted?: boolean;
  };
}

export interface RecordedVideo {
  id: string;
  title: string;
  duration: string;
  courseId: string;
  chapter: string;
  videoUrl: string;
  views: number;
  dateUploaded: string;
}

export interface MockQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MockTest {
  id: string;
  title: string;
  examType: string;
  durationMinutes: number;
  questions: MockQuestion[];
}

export interface PerformanceAnalysis {
  testId: string;
  score: number;
  total: number;
  percentile: number;
  rank: number;
  weakTopics: string[];
  predictionText: string;
}

export interface Transaction {
  id: string;
  studentName: string;
  email: string;
  courseName: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  paymentMethod: string;
  date: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  enrollmentId: string;
  rank: string; // Cadet Rank (e.g. Academy Sergeant Major, Cadet Lance Corporal)
  batch: string;
  attendancePercent: number;
  streakDays: number;
  enrolledCourseId: string;
  points?: number;
  badges?: string[];
}

export interface ParentNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  category: 'Performance' | 'Physical' | 'Fees' | 'General';
}

export interface AIKnowledgeBase {
  id: string;
  question: string;
  answer: string;
  category: 'admissions' | 'courses' | 'exams' | 'syllabus' | 'general';
}

export interface AISettings {
  systemPrompt: string;
  selectedLanguage: 'en' | 'te' | 'hi' | 'all';
  enableVoice: boolean;
  knowledgeBase: AIKnowledgeBase[];
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
}
