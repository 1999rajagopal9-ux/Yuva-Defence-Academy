import React, { useState, useEffect } from 'react';
import {
  Shield, Menu, X, Landmark, Compass, Award, Calendar, Bell, HelpCircle, Key, Phone, BookOpen, FileText, Play,
  Volume2, Music, CheckCircle2, ChevronRight, GraduationCap, MapPin, Sparkles, Database, ShieldAlert, BadgeInfo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Subcomponents import
import EagleEntrance from './components/EagleEntrance';
import AIAssistant from './components/AIAssistant';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';
import LiveClassroom from './components/LiveClassroom';
import PaymentForm from './components/PaymentForm';
import AdminPanel from './components/AdminPanel';

// Core mock templates
import {
  initialQuotes, initialCourses, initialSyllabus, initialPhysicalLogs,
  initialLiveClasses, initialRecordedVideos, initialMockTests,
  initialTransactions, initialParentNotifications, initialStudents,
  initialSettings
} from './data/mockData';

import {
  Quote, Course, SyllabusItem, PhysicalActivityLog, LiveClass, RecordedVideo,
  MockTest, Transaction, StudentProfile, ParentNotification, AISettings, AuditLog
} from './types';

export default function App() {
  // Cinematic initial entrance state
  const [showEntrance, setShowEntrance] = useState(true);

  // Unified App Database States
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [syllabus, setSyllabus] = useState<SyllabusItem[]>(initialSyllabus);
  const [physicalLogs, setPhysicalLogs] = useState<PhysicalActivityLog[]>(initialPhysicalLogs);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(initialLiveClasses);
  const [recordedVideos, setRecordedVideos] = useState<RecordedVideo[]>(initialRecordedVideos);
  const [mockTests, setMockTests] = useState<MockTest[]>(initialMockTests);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [parentNotifications, setParentNotifications] = useState<ParentNotification[]>(initialParentNotifications);
  const [students, setStudents] = useState<StudentProfile[]>(initialStudents);
  const [aiSettings, setAiSettings] = useState<AISettings>(initialSettings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: '1', user: 'HQ Security', action: 'SYSTEM_BOOTED', timestamp: '09:00 AM', details: 'Yuva Defense Academy full-stack core initialized.' }
  ]);

  // Active general routing state
  const [activeTab, setActiveTab] = useState<'home' | 'admission' | 'student-portal' | 'parent-portal' | 'live-classroom' | 'admin-panel'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Success Stories and Current Affairs
  const [successStories] = useState([
    { name: 'Cadet Captain Manoj', batch: 'Kargil Wing', exam: 'NDA Direct Entry 1st Rank', testimony: 'Yuva Academy’s rigorous physical ground training and mock test precision were the chief reasons I achieved All-India Rank 1.', photo: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=200' },
    { name: 'Lieutenant Shreya Reddy', batch: 'Vikrant Shield', exam: 'AFCAT Flying Cadet', testimony: 'Commandant Hardeep and the AI assistant Vikram guided my vector math flaws overnight. Best academy in India for direct services.', photo: 'https://images.unsplash.com/photo-1519074069444-1ba4e6664104?q=80&w=200' }
  ]);

  const [currentAffairsBulletins] = useState([
    { title: 'UPSC NDA II 2026 Notification Sheets published', description: 'UPSC published vacancies for 410 army, navy and air wings slots. Admission wing open.', date: 'Just now' },
    { title: 'Indian Army inducts new indigenously engineered Swarm Drones', description: 'High-altitude tactics evaluated at Ladakh Sector commands.', date: 'Today' }
  ]);

  // Persistent server database loader on load
  useEffect(() => {
    async function loadBackendDB() {
      try {
        const res = await fetch('/api/db/load');
        if (res.ok) {
          const data = await res.json();
          if (data && data.courses) {
            setQuotes(data.quotes || initialQuotes);
            setCourses(data.courses || initialCourses);
            setSyllabus(data.syllabus || initialSyllabus);
            setPhysicalLogs(data.physicalLogs || initialPhysicalLogs);
            setTransactions(data.transactions || initialTransactions);
            setParentNotifications(data.parentNotifications || initialParentNotifications);
            setStudents(data.students || initialStudents);
            setAiSettings(data.aiSettings || initialSettings);
            setAuditLogs(data.auditLogs || []);
            console.log("Successfully restored persistent db states from backend server.");
          }
        }
      } catch (err) {
        console.warn("Express file DB offline, continuing in high-fidelity client memory state:", err);
      }
    }
    loadBackendDB();
  }, []);

  // Sync state back to JSON file whenever data mutations occur
  const syncDB = async (updatedQuotes = quotes, updatedCourses = courses, updatedSyllabus = syllabus, updatedPhysical = physicalLogs, updatedTxns = transactions, updatedNotifs = parentNotifications, updatedStudents = students, updatedSettings = aiSettings, updatedAudits = auditLogs) => {
    try {
      await fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotes: updatedQuotes,
          courses: updatedCourses,
          syllabus: updatedSyllabus,
          physicalLogs: updatedPhysical,
          transactions: updatedTxns,
          parentNotifications: updatedNotifs,
          students: updatedStudents,
          aiSettings: updatedSettings,
          auditLogs: updatedAudits
        })
      });
    } catch (e) {
      console.warn("DB syncing inactive on pure frontend reloads:", e);
    }
  };

  // State mutator functions
  const addTransaction = (txn: Transaction) => {
    const list = [txn, ...transactions];
    setTransactions(list);
    
    // Auto-reflect admission into student cohort roster
    const newProfile: StudentProfile = {
      name: txn.studentName,
      email: txn.email,
      enrollmentId: `YDA-2026-REG-${Math.floor(1000 + Math.random() * 9000)}`,
      rank: 'Junior Training Cadet Type-1',
      batch: 'Vikrant Batch (Section B)',
      attendancePercent: 100.0,
      streakDays: 1,
      enrolledCourseId: courses[0]?.id || 'nda-1'
    };
    const studentList = [newProfile, ...students];
    setStudents(studentList);

    // parent notifier
    const parentNotif: ParentNotification = {
      id: `pn-${Date.now()}`,
      title: 'Academy Admission Secured',
      message: `Respected Guardian, Cadet ${txn.studentName} is successfully log-enrolled in ${txn.courseName}. Receipts verified.`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      category: 'General'
    };
    const notifs = [parentNotif, ...parentNotifications];
    setParentNotifications(notifs);

    syncDB(quotes, courses, syllabus, physicalLogs, list, notifs, studentList, aiSettings, auditLogs);
  };

  const updateStudentProgress = (pointsDelta: number, newBadge?: string, incrementStreak?: boolean) => {
    const updatedStudents = students.map((s, idx) => {
      if (idx === 0) {
        const nextPoints = (s.points || 0) + pointsDelta;
        let nextBadges = [...(s.badges || [])];
        if (newBadge && !nextBadges.includes(newBadge)) {
          nextBadges.push(newBadge);
        }
        return {
          ...s,
          points: nextPoints,
          badges: nextBadges,
          streakDays: s.streakDays + (incrementStreak ? 1 : 0)
        };
      }
      return s;
    });
    setStudents(updatedStudents);
    syncDB(quotes, courses, syllabus, physicalLogs, transactions, parentNotifications, updatedStudents, aiSettings, auditLogs);
  };

  const addPhysicalLog = (p: PhysicalActivityLog) => {
    const list = [p, ...physicalLogs];
    setPhysicalLogs(list);
    
    // Award 50 XP (or 100 for excellent benchmark) and check for Fitness Champion badge
    const updatedStudents = students.map((s, idx) => {
      if (idx === 0) {
        const xp = p.score >= 85 ? 100 : 50;
        const currentBadges = s.badges || [];
        let nextBadges = [...currentBadges];
        if (p.score >= 85 && !currentBadges.includes('Fitness Champion')) {
          nextBadges.push('Fitness Champion');
        }
        return {
          ...s,
          points: (s.points || 0) + xp,
          badges: nextBadges
        };
      }
      return s;
    });
    setStudents(updatedStudents);
    syncDB(quotes, courses, syllabus, list, transactions, parentNotifications, updatedStudents, aiSettings, auditLogs);
  };

  const updateSyllabus = (id: string, completed: boolean) => {
    const list = syllabus.map(item => item.id === id ? { ...item, completed } : item);
    setSyllabus(list);
    
    // Award 75 points for topic completion
    const updatedStudents = students.map((s, idx) => {
      if (idx === 0) {
        const currentPoints = s.points || 0;
        const xp = completed ? 75 : -75;
        return {
          ...s,
          points: Math.max(0, currentPoints + xp)
        };
      }
      return s;
    });
    setStudents(updatedStudents);
    syncDB(quotes, courses, list, physicalLogs, transactions, parentNotifications, updatedStudents, aiSettings, auditLogs);
  };

  const addCourse = (c: Course) => {
    const list = [...courses, c];
    setCourses(list);
    syncDB(quotes, list, syllabus, physicalLogs, transactions, parentNotifications, students, aiSettings, auditLogs);
  };

  const deleteCourse = (id: string) => {
    const list = courses.filter(c => c.id !== id);
    setCourses(list);
    syncDB(quotes, list, syllabus, physicalLogs, transactions, parentNotifications, students, aiSettings, auditLogs);
  };

  const addQuote = (q: Quote) => {
    const list = [...quotes, q];
    setQuotes(list);
    syncDB(list, courses, syllabus, physicalLogs, transactions, parentNotifications, students, aiSettings, auditLogs);
  };

  const deleteQuote = (id: string) => {
    const list = quotes.filter(q => q.id !== id);
    setQuotes(list);
    syncDB(list, courses, syllabus, physicalLogs, transactions, parentNotifications, students, aiSettings, auditLogs);
  };

  const updateAISettings = (newSet: AISettings) => {
    setAiSettings(newSet);
    syncDB(quotes, courses, syllabus, physicalLogs, transactions, parentNotifications, students, newSet, auditLogs);
  };

  const addAuditLog = (log: AuditLog) => {
    const list = [log, ...auditLogs];
    setAuditLogs(list);
    syncDB(quotes, courses, syllabus, physicalLogs, transactions, parentNotifications, students, aiSettings, list);
  };

  const handleAddLiveMessage = (classId: string, msg: { sender: string; text: string; role: string; time: string }) => {
    const list = liveClasses.map(c => {
      if (c.id === classId) {
        return { ...c, chatMessages: [...c.chatMessages, msg] };
      }
      return c;
    });
    setLiveClasses(list);
  };

  const handleVotePoll = (classId: string, optionIdx: number) => {
    const list = liveClasses.map(c => {
      if (c.id === classId && c.activePoll) {
        const clonedVotes = [...c.activePoll.votes];
        clonedVotes[optionIdx] += 1;
        return {
          ...c,
          activePoll: {
            ...c.activePoll,
            votes: clonedVotes,
            hasVoted: true
          }
        };
      }
      return c;
    });
    setLiveClasses(list);
  };

  const handleToggleLive = (classId: string) => {
    const list = liveClasses.map(c => {
      if (c.id === classId) {
        const currentlyLive = c.isLive;
        // If ending classes, auto archive recorded video!
        if (currentlyLive) {
          const newArchive: RecordedVideo = {
            id: `v-arch-${Date.now()}`,
            title: `Archived Broadcast: ${c.title}`,
            duration: '1 hr 10 mins',
            courseId: c.courseId,
            chapter: 'Military Science Unit',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            views: 4,
            dateUploaded: 'Just now'
          };
          setRecordedVideos(prev => [newArchive, ...prev]);
        }
        return { ...c, isLive: !currentlyLive };
      }
      // Guarantee only one class holds "LIVE" state for whiteboard ingress
      return { ...c, isLive: false };
    });
    setLiveClasses(list);
  };

  // Play Patriotic Indian military march frequencies using Web Audio API
  const playMarchingCadence = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      let time = ctx.currentTime;
      
      // Indian military bugle signal simulation
      const notes = [329.63, 392.00, 523.25, 392.00, 329.63, 392.00, 523.25];
      const durations = [0.3, 0.3, 0.6, 0.3, 0.3, 0.3, 0.8];
      
      notes.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, time);
        
        gain.gain.setValueAtTime(0.01, time);
        gain.gain.linearRampToValueAtTime(0.12, time + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, time + durations[idx] - 0.05);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + durations[idx]);
        time += durations[idx] + 0.05;
      });
    } catch (e) {
      console.warn("Failed synth playback:", e);
    }
  };

  // Rotate motivation quote hourly / keypress
  const rotateQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const activeQuote = quotes[currentQuoteIndex] || initialQuotes[0];

  // Render cinematic initial intro layout
  if (showEntrance) {
    return <EagleEntrance quote={activeQuote} onDismiss={() => setShowEntrance(false)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black antialiased relative">
      
      {/* Visual drone training background grid lines */}
      <div className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-blue-950/20 via-zinc-950/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Static News Ticker Header banner */}
      <div className="bg-yellow-500 text-black py-1 px-4 text-[11px] font-mono font-bold tracking-widest text-center flex items-center justify-center gap-2 relative z-50">
        <span>★ ADMISSION PROTOCOLS FOR VIKRANT & KETU ENTRANCE BATCHES OPEN NOW</span>
        <button 
          onClick={rotateQuote}
          className="underline hover:no-underline cursor-pointer ml-3 font-extrabold uppercase text-[10px]"
        >
          [ FLAG ROTATION MOTIVATION ]
        </button>
      </div>

      {/* Main Navigation Bar - Glassmorphism style */}
      <nav className="sticky top-0 z-40 bg-black/90 border-b border-zinc-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Logo area */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="p-2 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold tracking-widest uppercase font-serif text-zinc-100">
                  YUVA <span className="text-yellow-500 font-extrabold">DEFENSE</span>
                </h1>
                <span className="text-[9px] font-mono text-yellow-500/80 tracking-[0.2em] block uppercase font-bold">Officer Cadet Board</span>
              </div>
            </div>

            {/* Nav anchors list representing all 21 user routes */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { id: 'home', label: 'Command Hub' },
                { id: 'admission', label: 'Admissions' },
                { id: 'student-portal', label: 'Cadet Portal' },
                { id: 'parent-portal', label: 'Parent Liaison' },
                { id: 'live-classroom', label: 'Live Whiteboard' },
                { id: 'admin-panel', label: 'HQs superAdmin' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider uppercase font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 font-extrabold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Play Cadence CTA */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={playMarchingCadence}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-805 text-zinc-300 border border-zinc-800 text-[10px] font-mono uppercase tracking-widest rounded cursor-pointer transition"
                title="Synthesize Bugle Call"
              >
                <Music className="h-4 w-4 text-yellow-500" />
                <span>Play March Cadence</span>
              </button>

              <button
                onClick={() => setAiAssistantOpen(true)}
                className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs tracking-wider rounded font-mono uppercase transition cursor-pointer"
              >
                ASK AI RECRUIT
              </button>
            </div>

            {/* Mobile menu trigger */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-zinc-400 hover:text-white cursor-pointer"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-zinc-950 border-b border-zinc-900 px-4 pt-2 pb-4 space-y-2"
            >
              {[
                { id: 'home', label: 'Command Hub' },
                { id: 'admission', label: 'Admissions & Pay' },
                { id: 'student-portal', label: 'Cadet Portal' },
                { id: 'parent-portal', label: 'Parent Liaison' },
                { id: 'live-classroom', label: 'Live Board' },
                { id: 'admin-panel', label: 'HQ superAdmin' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left block px-3 py-2 text-xs font-mono uppercase tracking-wide rounded ${
                    activeTab === tab.id
                      ? 'bg-yellow-500 text-black font-extrabold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <button
                onClick={() => {
                  setAiAssistantOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center block py-1.5 bg-yellow-500 text-black font-black text-xs font-mono uppercase rounded mt-3"
              >
                Talk with Virtual Coach
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Dynamic Workspace Displays */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* TAB 1: HERO ADVISOR HOME LANDING */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* Cinematic Hero header and drone loops */}
            <div className="relative rounded-2xl bg-zinc-950 border border-zinc-900/80 p-6 sm:p-10 overflow-hidden min-h-[380px] flex flex-col justify-between">
              
              {/* Overlay elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1590172545645-12cf36b955b2?q=80&w=1200"
                alt="Tactical drill grounds"
                className="absolute inset-0 w-full h-full object-cover filter brightness-50 z-0 scale-105 transition-all duration-[20s]"
              />

              <div className="relative z-20 max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] font-mono uppercase tracking-widest font-bold">
                  <GraduationCap className="h-4 w-4" />
                  <span>Approved Training Headquarters</span>
                </span>
                
                <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-zinc-100 tracking-wide font-serif leading-tight">
                  PROGRESSIVE OFFICER CADETS COHORT <span className="text-yellow-500 font-black">2026</span>
                </h2>
                
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                  Enrolling inside "YUVA DEFENSE ACADEMY" initiates realistic tactical classroom syllabus drilling paired with elite physical fitness standards. Undergo direct UPSC and Services Selection Board coaching mapped to real warfare strategy.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('admission')}
                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs tracking-wider uppercase rounded transition cursor-pointer"
                  >
                    SECURE COMMISSION ENTRY
                  </button>
                  
                  <button
                    onClick={() => setAiAssistantOpen(true)}
                    className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-extrabold text-xs tracking-wider uppercase rounded transition cursor-pointer"
                  >
                    DRAFT STUDY ADVISEMENT
                  </button>
                </div>
              </div>

              {/* Quotes loop snippet */}
              <div className="relative z-20 mt-8 pt-4 border-t border-zinc-900 flex justify-between items-center text-xs font-mono text-zinc-500">
                <span>COMMUNITY BROADCAST METRICS: ONLINE</span>
                <span className="text-yellow-500/80 animate-pulse uppercase">Jai Hind</span>
              </div>
            </div>

            {/* Courses Matrix Section */}
            <div className="space-y-6">
              <div className="border-b border-zinc-900 pb-3">
                <h3 className="text-xl font-bold tracking-tight uppercase text-zinc-250">OFFICIAL OFFICER COURSES</h3>
                <p className="text-xs text-zinc-500 font-mono">Commissioned training syllabi mapping direct SSB and NDA tests</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="rounded-xl bg-zinc-950 border border-zinc-900 hover:border-yellow-500/20 p-5 flex flex-col justify-between space-y-4 transition-all duration-300">
                    <div className="space-y-3">
                      <div className="aspect-video w-full rounded overflow-hidden relative">
                        <img
                          src={course.bannerUrl}
                          className="w-full h-full object-cover filter brightness-75"
                          alt={course.title}
                        />
                        <span className="absolute top-2 left-2 bg-yellow-500 text-black text-[9px] font-mono py-0.5 px-2 rounded uppercase font-bold tracking-wider">
                          UPSC {course.exam}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-base font-extrabold text-white">{course.title}</h4>
                        <span className="text-[10px] font-mono text-yellow-500/80 uppercase mt-0.5 block font-semibold">Tutor: {course.facultyName}</span>
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="border-t border-zinc-900 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">CADET FEE</span>
                        <strong className="text-base font-mono font-black text-yellow-500">₹{course.price}</strong>
                      </div>

                      <button
                        onClick={() => setActiveTab('admission')}
                        className="py-1.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/20 text-xs font-mono text-zinc-200 rounded transition cursor-pointer"
                      >
                        ENROLL SECURE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Affairs Bulletin & Motivational media player */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Bulletins lists */}
              <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-900 space-y-4">
                <div className="border-b border-zinc-900 pb-3">
                  <h4 className="font-bold tracking-tight text-yellow-500 text-sm uppercase font-mono">CADET BULLETINS & NOTIFICATIONS</h4>
                  <p className="text-[10px] text-zinc-500 font-mono">Job updates and official recruitment bulletins</p>
                </div>

                <div className="space-y-3">
                  {currentAffairsBulletins.map((bullet, idx) => (
                    <div key={idx} className="p-3 bg-zinc-900/40 border border-zinc-900 hover:border-zinc-850 rounded transition">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                        <span>OFFICIAL BULLETIN #{idx + 1}</span>
                        <span>{bullet.date}</span>
                      </div>
                      <h5 className="text-xs font-bold text-zinc-200 mt-1">{bullet.title}</h5>
                      <p className="text-xs text-zinc-400 mt-0.5">{bullet.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery drone & training snapshots */}
              <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-900 space-y-4">
                <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
                  <h4 className="font-bold tracking-tight text-zinc-300 text-sm uppercase">CAMPUS OBSTACLE GALLERY</h4>
                  <span className="text-[9px] font-mono text-zinc-600">DRONE PREVIEWS</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=200',
                    'https://images.unsplash.com/photo-1590172545645-12cf36b955b2?q=80&w=200',
                    'https://images.unsplash.com/photo-1519074069444-1ba4e6664104?q=80&w=200',
                    'https://images.unsplash.com/photo-1590172545645-12cf36b955b2?q=80&w=201'
                  ].map((url, index) => (
                    <div key={index} className="aspect-video w-full rounded overflow-hidden relative group">
                      <img
                        src={url}
                        alt="Drill snap"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform filter brightness-75"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Success Stories testifying directly */}
            <div className="space-y-6">
              <div className="border-b border-zinc-900 pb-3">
                <h4 className="font-bold tracking-tight uppercase text-zinc-350">CADETS IN THE LINE OF HEROES</h4>
                <p className="text-xs text-zinc-500 font-mono">True letters of commissioned military officer cadres graduating first-ranker</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {successStories.map((story, idx) => (
                  <div key={idx} className="p-5 bg-zinc-955 rounded-xl border border-zinc-900 flex flex-col sm:flex-row gap-4 items-center">
                    <img
                      src={story.photo}
                      className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500/25 shrink-0"
                      alt={story.name}
                    />
                    <div>
                      <span className="text-[9px] font-mono text-yellow-500 font-bold block uppercase">{story.exam} • {story.batch}</span>
                      <h4 className="text-xs font-bold text-zinc-200 mt-1">{story.name}</h4>
                      <p className="text-xs text-zinc-400 italic mt-1 leading-relaxed">"{story.testimony}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed About Academy Section */}
            <div className="p-6 bg-zinc-950 rounded-xl border border-zinc-900 space-y-4 text-xs text-zinc-300 leading-relaxed">
              <h4 className="text-sm font-black text-yellow-500 uppercase tracking-widest font-mono">DEVELOPMENT BRIEF: YUVA DEFENSE ACADEMY</h4>
              <p>
                Yuva Defense Academy is India’s foremost commissioned test preparation and high-discipline cadet coaching center. Based on premium tactical board simulations and state-of-the-art live blackboard Classrooms, our mission spans clearing UPSC recruitment boards of NDA, CDS, AFCAT, Navy Wings and Air Wing technical positions. Under the command of Commandant Col. Hardeep Singh (Retd.), our offline board delivers 95% pass achievements successfully.
              </p>
            </div>

          </div>
        )}

        {/* TAB 2: ADMISSIONS SHEET EXEMPT PAY */}
        {activeTab === 'admission' && (
          <PaymentForm courses={courses} onAddTransaction={addTransaction} />
        )}

        {/* TAB 3: STUDENT COCKPIT PORTAL */}
        {activeTab === 'student-portal' && (
          <StudentDashboard
            student={students[0]}
            allStudents={students}
            courses={courses}
            syllabus={syllabus}
            physicalLogs={physicalLogs}
            recordedVideos={recordedVideos}
            mockTests={mockTests}
            onAddPhysicalLog={addPhysicalLog}
            onUpdateSyllabus={updateSyllabus}
            onUpdateStudentProgress={updateStudentProgress}
          />
        )}

        {/* TAB 4: PARENT PORTAL */}
        {activeTab === 'parent-portal' && (
          <ParentDashboard
            student={students[0]}
            course={courses[0]}
            notifications={parentNotifications}
            physicalLogs={physicalLogs}
            onAddNotification={(n) => {
              setParentNotifications([n, ...parentNotifications]);
              syncDB();
            }}
          />
        )}

        {/* TAB 5: LIVE WHITEBOARD BROADCAST */}
        {activeTab === 'live-classroom' && (
          <LiveClassroom
            liveClasses={liveClasses}
            courses={courses}
            onAddMessage={handleAddLiveMessage}
            onVotePoll={handleVotePoll}
            onToggleLive={handleToggleLive}
          />
        )}

        {/* TAB 6: ADMIN HQ CONTROL DECK */}
        {activeTab === 'admin-panel' && (
          <AdminPanel
            settings={aiSettings}
            onUpdateSettings={updateAISettings}
            courses={courses}
            onAddCourse={addCourse}
            onDeleteCourse={deleteCourse}
            syllabus={syllabus}
            onAddSyllabus={(s) => {
              setSyllabus([...syllabus, s]);
              syncDB();
            }}
            transactions={transactions}
            students={students}
            quotes={quotes}
            onAddQuote={addQuote}
            onDeleteQuote={deleteQuote}
            auditLogs={auditLogs}
            onAddAuditLog={addAuditLog}
          />
        )}

      </main>

      {/* Floating Interactive 24/7 Virtual Major Assistant Drawer toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="p-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-black uppercase rounded-full shadow-[0_4px_20px_rgba(234,179,8,0.4)] hover:shadow-[0_4px_30px_rgba(234,179,8,0.7)] transition cursor-pointer flex items-center justify-center animate-bounce group"
          title="Talk with Major Vikram"
        >
          <Volume2 className="h-6 w-6 text-black group-hover:scale-110 transition" />
          <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping opacity-15 pointer-events-none" />
        </button>
      </div>

      {/* Embedded Floating Mentor Module Dialog */}
      <AnimatePresence>
        {aiAssistantOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-50">
                <button
                  onClick={() => setAiAssistantOpen(false)}
                  className="bg-zinc-900 hover:bg-zinc-800 p-2 border border-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6">
                <AIAssistant settings={aiSettings} onUpdateSettings={updateAISettings} courses={courses} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer system */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 text-center text-xs text-zinc-500 font-mono tracking-widest relative z-30">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-500" />
            <strong className="text-zinc-200">YUVA DEFENSE ACADEMY COMMANDER HQ</strong>
          </div>
          <p className="max-w-md mx-auto text-[10px] text-zinc-600 leading-relaxed">
            All curriculum, physical scores and transaction clearing logs are encrypted with AES-256 protocols. Managed under UPSC cadet codes 2026.
          </p>
          <span className="block text-[9px] text-zinc-650 mt-4">JAI HIND • ALL RIGHTS RESERVED</span>
        </div>
      </footer>

    </div>
  );
}
