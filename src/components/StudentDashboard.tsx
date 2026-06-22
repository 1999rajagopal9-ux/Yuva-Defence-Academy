import React, { useState } from 'react';
import {
  User, Award, Key, Calendar, MapPin, TrendingUp, CheckSquare, Dumbbell, Play,
  BookOpen, FileText, Download, Shield, Clock, HelpCircle, Trophy, Sparkles, CheckCircle,
  Flame, Zap, ArrowUp, Send, CheckCircle2, Award as BadgeIcon, Target
} from 'lucide-react';
import {
  StudentProfile, Course, SyllabusItem, PhysicalActivityLog, LiveClass, RecordedVideo, MockTest
} from '../types';

interface StudentDashboardProps {
  student: StudentProfile;
  allStudents?: StudentProfile[];
  courses: Course[];
  syllabus: SyllabusItem[];
  physicalLogs: PhysicalActivityLog[];
  recordedVideos: RecordedVideo[];
  mockTests: MockTest[];
  onAddPhysicalLog: (log: PhysicalActivityLog) => void;
  onUpdateSyllabus: (id: string, completed: boolean) => void;
  onUpdateStudentProgress?: (pointsDelta: number, newBadge?: string, incrementStreak?: boolean) => void;
}

export default function StudentDashboard({
  student, allStudents = [], courses, syllabus, physicalLogs, recordedVideos, mockTests, onAddPhysicalLog, onUpdateSyllabus, onUpdateStudentProgress
}: StudentDashboardProps) {
  
  // Outer routing tabs: 'overview', 'curriculum', 'physical', 'recorded', 'mock', 'certificates'
  const [subTab, setSubTab] = useState<'overview' | 'curriculum' | 'physical' | 'recorded' | 'mock' | 'certificates'>('overview');

  // Interactive Workout state logger
  const [runKm, setRunKm] = useState('5.0');
  const [pushups, setPushups] = useState('40');
  const [situps, setSitups] = useState('45');
  const [pullups, setPullups] = useState('8');

  // Interactive Mock Test state
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [testScore, setTestScore] = useState<{ score: number; total: number; done: boolean } | null>(null);

  // Active watching video
  const [activeVideo, setActiveVideo] = useState<RecordedVideo | null>(recordedVideos[0] || null);

  // AI-generated quiz loading trigger
  const [aiQuizLoading, setAiQuizLoading] = useState(false);
  const [aiQuizActive, setAiQuizActive] = useState(false);

  // Gamification & adaptive planner states
  const [loadingAiPlan, setLoadingAiPlan] = useState(false);
  const [musterCheckedIn, setMusterCheckedIn] = useState(false);
  const [aiPlanData, setAiPlanData] = useState<{
    recommendations: any[];
    learningPlateauAlerter: {
      predictedPlateau: boolean;
      confidencePercent: number;
      plateauRiskArea: string;
      remedialActionPlan: string;
    };
    overallFocusAdvice: string;
  } | null>({
    recommendations: [
      { time: '09:00 AM', topic: 'Live Class: Vector Algebra Core', type: 'Theory', resource: 'Video Vault: Lecture 1', rationale: 'Master standard coplanarity proofs' },
      { time: '11:30 AM', topic: 'Independent reading: Constitution preambles', type: 'Theory', resource: 'Admissions Manual Chapter 1', rationale: 'Reinforce GAT General Knowledge parameters' },
      { time: '04:00 PM', topic: 'Ground Drill: Tactical running & repetition stamina', type: 'Physical', resource: 'Obstacle Course Block A', rationale: 'Maintain high military fitness composite levels' },
      { time: '07:30 PM', topic: 'Practice Workbook: Matrices formulas', type: 'Practice', resource: 'Sectional math 2D', rationale: 'Mitigate skew-symmetric equation errors' }
    ],
    learningPlateauAlerter: {
      predictedPlateau: true,
      confidencePercent: 78,
      plateauRiskArea: 'Vector coplanarity and trigonometry calculations',
      remedialActionPlan: 'Secure 10 perfect math calculations, review Vector lecture #1, and request a visual check.'
    },
    overallFocusAdvice: "Cadet, stamina is key. Your analytical score is stable, but potential coplanarity plateau is detected mid-equations. Continue logging physical drills to boost morale!"
  });

  const fetchAIStudyPlan = async () => {
    setLoadingAiPlan(true);
    try {
      const res = await fetch('/api/student/ai-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student,
          syllabus,
          physicalLogs,
          mockTestCount: mockTests.length,
          latestTestScore: testScore?.score
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiPlanData(data);
      }
    } catch (e) {
      console.error("Failed to connect with custom study planner API:", e);
    } finally {
      setLoadingAiPlan(false);
    }
  };

  const handleDailyMusterCheckIn = () => {
    if (musterCheckedIn) return;
    setMusterCheckedIn(true);
    if (onUpdateStudentProgress) {
      // Award 50 points and increment active streak by 1
      onUpdateStudentProgress(50, undefined, true);
    }
  };

  // RADAR CHART DESIGN MATHEMATICS
  const radarSubjects = [
    { subject: 'Mathematics & Vectors', score: 78, full: 100, isWeak: false },
    { subject: 'GAT English', score: 85, full: 100, isWeak: false },
    { subject: 'GK - Constitution & Polity', score: 62, full: 100, isWeak: true },
    { subject: 'Physical Endurance & Run', score: physicalLogs[0]?.score || 88, full: 100, isWeak: false },
    { subject: 'SSB Psychology & OIR', score: 70, full: 100, isWeak: false },
    { subject: 'Current Military Affairs', score: 82, full: 100, isWeak: false }
  ];

  const radarWidth = 240;
  const radarHeight = 240;
  const radarRadius = 75;
  const radarCenterX = radarWidth / 2;
  const radarCenterY = radarHeight / 2;
  const concentricLevels = [25, 50, 75, 100];

  const getRadarPoint = (index: number, score: number, maxScore: number) => {
    const angle = (index * 2 * Math.PI) / radarSubjects.length - Math.PI / 2;
    const ratio = score / maxScore;
    const distance = ratio * radarRadius;
    const x = radarCenterX + distance * Math.cos(angle);
    const y = radarCenterY + distance * Math.sin(angle);
    return { x, y };
  };

  const getGridPoint = (index: number, percentage: number) => {
    const angle = (index * 2 * Math.PI) / radarSubjects.length - Math.PI / 2;
    const distance = (percentage / 100) * radarRadius;
    const x = radarCenterX + distance * Math.cos(angle);
    const y = radarCenterY + distance * Math.sin(angle);
    return { x, y };
  };

  const masteryPolyPoints = radarSubjects.map((sub, i) => {
    const p = getRadarPoint(i, sub.score, sub.full);
    return `${p.x},${p.y}`;
  }).join(' ');

  // Filter current course items
  const studentCourse = courses.find(c => c.id === student.enrolledCourseId) || courses[0];
  const courseSyllabus = syllabus.filter(s => s.courseId === student.enrolledCourseId);
  const syllabusCompletedPercent = Math.round(
    (courseSyllabus.filter(s => s.completed).length / (courseSyllabus.length || 1)) * 100
  );

  const handleLogWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const r = parseFloat(runKm) || 0;
    const p = parseInt(pushups) || 0;
    const s = parseInt(situps) || 0;
    const pl = parseInt(pullups) || 0;

    // Standard military composite index (max 100)
    // Run: 40 pts, Pushups: 20 pts, Situps: 20 pts, Pullups: 20 pts
    const runScore = Math.min((r / 6) * 40, 40);
    const pushScore = Math.min((p / 45) * 20, 20);
    const sitScore = Math.min((s / 50) * 20, 20);
    const pullScore = Math.min((pl / 10) * 20, 20);
    const totalScore = Math.round(runScore + pushScore + sitScore + pullScore);

    let b = 'Average';
    if (totalScore >= 90) b = 'Honorable (Elite Grade)';
    else if (totalScore >= 80) b = 'A Grade (Excellent)';
    else if (totalScore >= 65) b = 'Satisfactory';

    const newLog: PhysicalActivityLog = {
      id: `p-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      runKm: r,
      pushups: p,
      situps: s,
      pullups: pl,
      score: totalScore,
      benchmark: b
    };

    onAddPhysicalLog(newLog);
  };

  const handleStartTest = (test: MockTest) => {
    setActiveTest(test);
    setSelectedAnswers({});
    setTestScore(null);
    setAiQuizActive(false);
  };

  const handleOptionSelect = (qId: string, idx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: idx }));
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;
    let score = 0;
    activeTest.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });

    setTestScore({
      score,
      total: activeTest.questions.length,
      done: true
    });

    // Integrated gamification reward
    if (onUpdateStudentProgress) {
      const isPerfect = score === activeTest.questions.length;
      const passPoints = isPerfect ? 200 : 100;
      onUpdateStudentProgress(
        passPoints,
        isPerfect ? 'Top Scorer' : undefined,
        false
      );
    }
  };

  // Generate tactical AI Practice questions
  const triggerAIGeneratedTest = () => {
    setAiQuizLoading(true);
    setTimeout(() => {
      setAiQuizLoading(false);
      setAiQuizActive(true);
      const randomAIQuiz: MockTest = {
        id: 'ai-mock-1',
        title: 'AI Generated: Tactical Defense Mathematics & spatial reasoning',
        examType: 'NDA Technical',
        durationMinutes: 15,
        questions: [
          { id: 'aq1', text: 'Determine the unit vector perpendicular to both vectors 2i - j + k and i + 2j - k.', options: ['(-i + 3j + 5k)/√35', '(i + 3j + 5k)/√35', '(-i + 3j - 5k)/√35', '(2i - j + k)/√3'], correctIndex: 0, explanation: 'Obtained using cross product calculation (A x B).' },
          { id: 'aq2', text: 'Which fighter jet of IAF was highly pivotal in Kargil Operation Safed Sagar?', options: ['Mirage 2000', 'MiG-21', 'Sukhoi Su-30MKI', 'Rafale'], correctIndex: 0, explanation: 'Mirage 2000 precision-guided strikes destroyed bunkers on Tiger Hill.' }
        ]
      };
      setActiveTest(randomAIQuiz);
      setSelectedAnswers({});
      setTestScore(null);
    }, 1500);
  };

  return (
    <div className="w-full bg-black rounded-xl border border-zinc-800 text-white min-h-[640px] flex flex-col xl:flex-row overflow-hidden font-sans shadow-2xl">
      
      {/* Side HUD navigation */}
      <div className="w-full xl:w-1/4 bg-zinc-950 border-r border-zinc-900 p-5 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Cadet badge header */}
          <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-lg flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full text-black">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-yellow-500 tracking-wide uppercase">{student.name}</h4>
              <p className="text-[10px] font-mono text-zinc-400">{student.rank}</p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase px-3 block mb-2">OPERATIONAL SECTIONS</span>
            {[
              { id: 'overview', title: 'Tactical HUD Overview', icon: User },
              { id: 'curriculum', title: 'Syllabus & Planner', icon: BookOpen },
              { id: 'physical', title: 'Physical Activity Log', icon: Dumbbell },
              { id: 'recorded', title: 'Video Vault', icon: Play },
              { id: 'mock', title: 'Mock Exam Center', icon: Shield },
              { id: 'certificates', title: 'Academy Certificates', icon: Trophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSubTab(tab.id as any);
                  setActiveTest(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-left text-xs font-mono tracking-wider transition ${
                  subTab === tab.id
                    ? 'bg-yellow-500 text-black font-bold border-l-4 border-yellow-600'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <tab.icon className="h-4 w-4 shrink-0" />
                  <span>{tab.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tactical status details */}
        <div className="p-3.5 bg-zinc-900/45 rounded-lg border border-zinc-800 text-[10px] font-mono space-y-2.5 text-zinc-400">
          <div className="border-b border-zinc-900 pb-2">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">CADET INSTRUCTION SYLLABUS</span>
            <span className="text-zinc-100 text-[11px] font-bold font-serif leading-tight block mt-0.5">{
              student.enrolledCourseId === 'nda-1' ? "Intermediate NDA Target Cadet Program" :
              student.enrolledCourseId === 'cds-1' ? "UPSC CDS Strategic Officer Course" :
              "AFCAT Flying & Flight technical Course"
            }</span>
          </div>

          <div className="border-b border-zinc-900 pb-2">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">DEFENCE FORCE DIVISION</span>
            <span className="text-yellow-500 text-[9.5px] font-extrabold tracking-wide block mt-0.5 uppercase leading-normal">{
              student.enrolledCourseId === 'nda-1' ? "Indian Army, Indian Navy & Air Force Combined" :
              student.enrolledCourseId === 'cds-1' ? "Indian Army (IMA/OTA) & Indian Navy (INA) Combat Wings" :
              "Indian Air Force (IAF) Flying Officer Division"
            }</span>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between">
              <span>REGISTRATION CODE:</span>
              <span className="text-zinc-200">{student.enrollmentId}</span>
            </div>
            <div className="flex justify-between">
              <span>SIGHTING SECTOR:</span>
              <span className="text-zinc-200">VIKRANT SHIELD</span>
            </div>
            <div className="flex justify-between">
              <span>ATTENDANCE RECORD:</span>
              <span className="text-green-400 font-bold">{student.attendancePercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main body display pane */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* 1. OVERVIEW HUD */}
        {subTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white uppercase font-serif">MISSION TACTICAL HUD</h3>
                <p className="text-xs text-zinc-400 font-mono">Real-time status, active streaks, and advanced AI cognitive evaluation</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-[11px] font-mono rounded flex items-center gap-1.5">
                  <span className="text-zinc-500 uppercase">My Squadron Rank:</span>
                  <strong className="text-yellow-500 font-bold">
                    #{allStudents.map(s => ({ ...s, points: s.name === student.name ? (student.points || 1250) : (s.points || 1000) })).sort((a,b) => b.points - a.points).findIndex(x => x.name === student.name) + 1}
                  </strong>
                </div>

                <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-yellow-500/20 text-yellow-500 text-xs font-mono rounded flex items-center gap-2 animate-pulse-border">
                  <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
                  <span>Streak: <strong className="font-extrabold">{student.streakDays} Days</strong></span>
                </div>
              </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'TACTICAL SCORE POINTS', value: `${student.points || 1250} XP`, sub: 'Accumulated from correct modules & drills', color: 'text-yellow-500', bg: 'bg-yellow-500/5' },
                { title: 'Syllabus Progress', value: `${syllabusCompletedPercent}%`, sub: `${courseSyllabus.filter(s => s.completed).length}/${courseSyllabus.length} Syllabus Modules Clear`, color: 'text-zinc-100', bg: 'bg-zinc-950' },
                { title: 'Composite Fitness Index', value: `${physicalLogs[0]?.score || 0}/100`, sub: `Confidence Index: ${physicalLogs[0]?.benchmark || 'No workout logged estimate'}`, color: 'text-green-500', bg: 'bg-green-500/5' },
                { title: 'Cadet Category Wing', value: studentCourse.exam, sub: studentCourse.title, color: 'text-blue-400', bg: 'bg-blue-500/5' }
              ].map((stat, idx) => (
                <div key={idx} className={`p-4 rounded-lg border border-zinc-900 space-y-1 ${stat.bg}`}>
                  <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase block">{stat.title}</span>
                  <div className={`text-2xl font-black font-mono tracking-tight ${stat.color}`}>{stat.value}</div>
                  <p className="text-[10px] text-zinc-400 font-mono leading-tight">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Core Interactive Layout (2-Column Grid on desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT: AI ADAPTIVE COMMAND PLANNER PANEL */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* SUBJECT MASTERY COGNITIVE RADAR HUD */}
                <div className="p-5 rounded-lg bg-zinc-950 border border-zinc-900 space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-yellow-500 animate-pulse" />
                      <div>
                        <h4 className="font-bold tracking-tight text-sm text-yellow-500 font-mono uppercase">COGNITIVE SUBJECT MASTERY RADAR HUD</h4>
                        <p className="text-[10px] text-zinc-500 font-mono">Trigonometric vector analysis & active learning plateaus</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-mono bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-2 py-0.5 rounded font-black shrink-0">
                      D3 COGNITIVE INDEX
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                    
                    {/* SVG Radar Map Graphic */}
                    <div className="relative w-[240px] h-[240px] shrink-0">
                      <svg width={radarWidth} height={radarHeight} className="mx-auto overflow-visible select-none">
                        <defs>
                          <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="rgba(234, 179, 8, 0.45)" />
                            <stop offset="70%" stopColor="rgba(234, 179, 8, 0.12)" />
                            <stop offset="100%" stopColor="rgba(234, 179, 8, 0)" />
                          </radialGradient>
                        </defs>

                        {/* Concentric Grid lines */}
                        {concentricLevels.map((level, levelIdx) => {
                          const gridPointsStr = radarSubjects.map((sub, subIdx) => {
                            const p = getGridPoint(subIdx, level);
                            return `${p.x},${p.y}`;
                          }).join(' ');

                          return (
                            <polygon
                              key={`grid-${level}`}
                              points={gridPointsStr}
                              className={`fill-none ${
                                levelIdx === concentricLevels.length - 1 ? 'stroke-yellow-500/20' : 'stroke-zinc-800/50'
                              }`}
                              strokeWidth={levelIdx === concentricLevels.length - 1 ? 1.5 : 1}
                              strokeDasharray={levelIdx === concentricLevels.length - 1 ? 'none' : '3 3'}
                            />
                          );
                        })}

                        {/* Ring Watermark Markers */}
                        {concentricLevels.map((l) => (
                          <text
                            key={`text-${l}`}
                            x={radarCenterX}
                            y={radarCenterY - (l / 100) * radarRadius + 3}
                            className="text-[7px] font-mono fill-zinc-650 font-bold text-center select-none"
                            textAnchor="middle"
                          >
                            {l}%
                          </text>
                        ))}

                        {/* Axis lines from center to outer points */}
                        {radarSubjects.map((sub, i) => {
                          const pOuter = getGridPoint(i, 100);
                          return (
                            <line
                              key={`axis-${i}`}
                              x1={radarCenterX}
                              y1={radarCenterY}
                              x2={pOuter.x}
                              y2={pOuter.y}
                              className="stroke-zinc-900/80"
                              strokeWidth={1}
                            />
                          );
                        })}

                        {/* The Actual Mastery Area Poly */}
                        <polygon
                          points={masteryPolyPoints}
                          fill="url(#radarGrad)"
                          stroke="#eab308"
                          strokeWidth={2}
                          className="transition-all duration-700 ease-out"
                        />

                        {/* Vertex Dots & Score badges */}
                        {radarSubjects.map((sub, i) => {
                          const p = getRadarPoint(i, sub.score, sub.full);
                          return (
                            <g key={`dot-${i}`} className="cursor-help">
                              {sub.isWeak && (
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r={8}
                                  className="fill-red-500/10 stroke-red-500/30 animate-pulse"
                                />
                              )}
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={sub.isWeak ? 4.5 : 3.5}
                                className={`${sub.isWeak ? 'fill-red-500 stroke-red-300' : 'fill-yellow-500 stroke-zinc-950'} stroke-[1.2]`}
                              />
                            </g>
                          );
                        })}

                        {/* Subject Outer Labels */}
                        {radarSubjects.map((sub, i) => {
                          const angle = (i * 2 * Math.PI) / radarSubjects.length - Math.PI / 2;
                          // Offset label slightly further outside 
                          const labelRadiusOffset = radarRadius + 22;
                          const lx = radarCenterX + labelRadiusOffset * Math.cos(angle);
                          // Shift y slightly for top/bottom label clearance
                          const ly = radarCenterY + labelRadiusOffset * Math.sin(angle) + (Math.sin(angle) > 0.5 ? 4 : Math.sin(angle) < -0.5 ? -3 : 2);

                          let anchorVal: "start" | "end" | "middle" = "middle";
                          if (Math.cos(angle) > 0.18) anchorVal = "start";
                          else if (Math.cos(angle) < -0.18) anchorVal = "end";

                          return (
                            <text
                              key={`lbl-${i}`}
                              x={lx}
                              y={ly}
                              className={`text-[8.5px] font-mono leading-none ${
                                sub.isWeak ? 'fill-red-400 font-black' : 'fill-zinc-400 font-bold'
                              }`}
                              textAnchor={anchorVal}
                            >
                              {sub.subject.split(' ')[0]} {sub.subject.split(' ')[1] || ''} ({sub.score}%)
                            </text>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Right Info: Subject metrics list & AI actionable advice */}
                    <div className="flex-1 space-y-3.5 w-full">
                      <div className="p-3 bg-zinc-900/25 border border-zinc-900 rounded space-y-2">
                        <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase block">CADET REMEDIAL ACTIONS REPORT</span>
                        
                        <div className="space-y-1.5">
                          {radarSubjects.map((sub, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px] gap-2 border-b border-zinc-900/40 pb-1 last:border-0 last:pb-0">
                              <span className="text-zinc-350 font-sans leading-tight text-[10px]">
                                {sub.subject}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`font-mono font-bold text-[10px] ${
                                  sub.score >= 80 ? 'text-green-500' :
                                  sub.score >= 70 ? 'text-yellow-500' :
                                  'text-red-400 animate-pulse'
                                }`}>
                                  {sub.score}%
                                </span>
                                {sub.isWeak ? (
                                  <span className="px-1 py-0.5 rounded text-[7px] font-mono bg-red-950 text-red-500 border border-red-500/20 font-black uppercase">
                                    AI TARGET
                                  </span>
                                ) : (
                                  <span className="px-1 py-0.5 rounded text-[7px] font-mono bg-zinc-900 text-zinc-650 uppercase">
                                    OK
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI remediation recommendation feedback box */}
                      <div className="p-2.5 bg-red-950/10 border border-red-500/20 rounded flex gap-2 items-start">
                        <Sparkles className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <div className="text-[9.5px] space-y-0.5 text-left font-mono leading-relaxed">
                          <span className="text-red-400 font-black uppercase block tracking-wider text-[8px]">AI REMEDIAL MANEUVER DETECTED</span>
                          <p className="text-zinc-300">
                             Cadet, General Knowledge Polity & Constitution averages below 65%. Rectify by attending daily mock evaluations.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="p-5 rounded-lg bg-zinc-950 border border-zinc-900 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                      <h4 className="font-bold tracking-tight text-sm text-yellow-500 font-mono uppercase">AI COMMANDER: DAILY STUDY MAP</h4>
                    </div>
                    <button
                      onClick={fetchAIStudyPlan}
                      disabled={loadingAiPlan}
                      className="text-[10px] bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-mono tracking-wider font-extrabold px-3 py-1.5 rounded transition uppercase flex items-center gap-1.5 cursor-pointer"
                    >
                      {loadingAiPlan ? (
                        <>
                          <div className="h-3 w-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>MAPPING DRILLS...</span>
                        </>
                      ) : (
                        <span>RE-GENERATE ADAPTIVE PLAN</span>
                      )}
                    </button>
                  </div>

                  {/* Overall Advisor strategic advice */}
                  <div className="p-3 bg-zinc-900/40 rounded border border-zinc-900 text-xs text-zinc-300 leading-relaxed italic">
                    "{aiPlanData?.overallFocusAdvice}"
                  </div>

                  {/* Recommendations list */}
                  <div className="space-y-3">
                    {aiPlanData?.recommendations.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 bg-zinc-900/20 rounded border border-zinc-900 hover:border-zinc-800 transition">
                        <span className="text-[11px] font-mono font-bold text-yellow-500 shrink-0 w-16 pt-0.5">{item.time}</span>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="text-xs text-zinc-100 font-bold">{item.topic}</span>
                            <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-black tracking-wider uppercase ${
                              item.type === 'Theory' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                              item.type === 'Physical' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-normal font-mono">Resource: <span className="text-zinc-300">{item.resource}</span></p>
                          <p className="text-[10px] text-zinc-500 italic">"Rationale: {item.rationale}"</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI PLATEAU DETECTOR & ADVICE ALERTS */}
                  <div className="pt-2">
                    <div className="p-4 rounded-lg bg-red-950/10 border border-red-500/30 flex gap-3 items-start">
                      <Shield className="h-5 w-5 text-red-500 shrink-0 animate-pulse mt-0.5" />
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[11px] font-mono font-black text-red-500 uppercase tracking-widest">AI LEARNING PLATEAU DETECTOR ANALYSIS</h4>
                          <span className="px-1.5 py-0.5 text-[8px] font-mono bg-red-500/20 text-red-400 border border-red-500/30 rounded font-black uppercase">
                            Plateau Probability: {aiPlanData?.learningPlateauAlerter.confidencePercent}%
                          </span>
                        </div>
                        
                        <div className="text-xs text-zinc-300 leading-tight">
                          <span className="text-zinc-500 font-mono text-[10px]">PREDICTED RISK AREA:</span> <strong className="text-zinc-200">{aiPlanData?.learningPlateauAlerter.plateauRiskArea}</strong>
                        </div>
                        
                        <p className="text-xs text-zinc-400 leading-relaxed pt-1 font-sans">
                          <span className="text-red-400/90 font-mono font-bold text-[10px] block uppercase">RECOMMENDED REMEDIAL MANEUVER:</span>
                          {aiPlanData?.learningPlateauAlerter.remedialActionPlan}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
              
              {/* RIGHT: GAMIFICATION HUB, BADGES, AND Cohort LEADERBOARD */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. ATTENDANCE MUSTER & STREAK BOOSTER */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 space-y-3">
                  <h4 className="text-[11px] font-mono font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                    <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
                    <span>DAILY MUSTER STREAK BOOSTER</span>
                  </h4>

                  <div className="flex items-center justify-between gap-3 bg-black/40 p-2.5 rounded border border-zinc-900">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 block">TODAY'S ATTENDANCE STATUS</span>
                      <span className={`text-xs font-bold font-mono ${musterCheckedIn ? 'text-green-500' : 'text-yellow-500/80 animate-pulse'}`}>
                        ● {musterCheckedIn ? 'MUSTER SECURED (PRESENT)' : 'TACTICAL MUSTER WAITING'}
                      </span>
                    </div>

                    <button
                      onClick={handleDailyMusterCheckIn}
                      disabled={musterCheckedIn}
                      className={`text-xs font-mono font-black tracking-wider px-3.5 py-2.5 rounded transition uppercase ${
                        musterCheckedIn 
                          ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:scale-105 cursor-pointer'
                      }`}
                    >
                      {musterCheckedIn ? '✔️ BOOSTER CLAIMENT' : 'SECURE CADET SIGN-IN'}
                    </button>
                  </div>
                  <p className="text-[9px] font-mono text-zinc-500 leading-normal text-center">
                    Signing in daily rewards <strong className="text-yellow-500">+50 XP points</strong>, maintains military discipline streaks, and guards batch rank standings securely.
                  </p>
                </div>

                {/* 2. SQUADRON MILITARY MILESTONES BADGES WALL */}
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-900 space-y-4">
                  <h4 className="text-[11px] font-mono font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                    <BadgeIcon className="h-4 w-4 text-yellow-500" />
                    <span>CHEVRON HONOR BADGES WALL</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-3.5">
                    {[
                      { name: 'Consistent Learner', desc: 'Secure consecutive study streak of >=10 days.', icon: Flame, color: 'from-amber-600 to-yellow-500' },
                      { name: 'Top Scorer', desc: 'Log 100% correctness on any mock test evaluation.', icon: Trophy, color: 'from-yellow-400 to-amber-500' },
                      { name: 'Fitness Champion', desc: 'Sustain ground workout index score of >=85.', icon: Dumbbell, color: 'from-green-600 to-emerald-500' },
                      { name: 'Math Marshal', desc: 'Successfully clear difficult vectors limits modules.', icon: Target, color: 'from-purple-600 to-indigo-500' }
                    ].map((badge) => {
                      // Check validation parameters
                      const hasBadge = student.badges?.includes(badge.name) || (badge.name === 'Consistent Learner' && student.streakDays >= 10);
                      
                      return (
                        <div
                          key={badge.name}
                          className={`relative p-3 rounded border text-center transition space-y-1.5 ${
                            hasBadge 
                              ? 'bg-zinc-900 border-yellow-500/20 text-white shadow-[0_0_15px_rgba(234,179,8,0.06)]' 
                              : 'bg-zinc-950/40 border-zinc-950 text-zinc-600 filter saturate-50 brightness-75'
                          }`}
                          title={`${badge.name}: ${badge.desc}`}
                        >
                          {/* Circle badge */}
                          <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${
                            hasBadge ? badge.color : 'from-zinc-900 to-zinc-950'
                          } text-black`}>
                            <badge.icon className={`h-5 w-5 ${hasBadge ? 'text-black' : 'text-zinc-600'}`} />
                          </div>

                          <div className="space-y-0.5">
                            <span className={`text-[10px] font-mono font-bold block leading-tight ${hasBadge ? 'text-yellow-500' : 'text-zinc-500'}`}>
                              {badge.name}
                            </span>
                            <p className="text-[8px] leading-tight text-zinc-500 font-sans tracking-tight">
                              {badge.desc}
                            </p>
                          </div>

                          {/* Lock / Unlock mini watermark */}
                          <span className={`absolute top-1 right-1 text-[7px] font-mono uppercase px-1 rounded ${
                            hasBadge ? 'bg-yellow-500/10 text-yellow-500' : 'bg-zinc-900 text-zinc-700'
                          }`}>
                            {hasBadge ? 'ACTIVE' : 'LOCKED'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. COHORT SQUADRON LEADERBOARD scoreboard */}
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-900 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <h4 className="text-[11px] font-mono font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span>COHORT SQUADRON scoreboard</span>
                    </h4>
                    <span className="text-[8px] font-mono bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded">
                      VIKRANT BATCH
                    </span>
                  </div>

                  {/* High morale student array list */}
                  <div className="space-y-2">
                    {allStudents && allStudents.length > 0 ? (
                      [...allStudents]
                        .map(s => {
                          const points = s.name === student.name ? (student.points || 1250) : (s.points || 1000);
                          const streak = s.name === student.name ? (student.streakDays) : (s.streakDays || 4);
                          return { ...s, points, streak };
                        })
                        .sort((a, b) => b.points - a.points)
                        .map((cadet, rankIdx) => {
                          const isSelf = cadet.name === student.name;
                          return (
                            <div
                              key={cadet.enrollmentId}
                              className={`p-2 rounded text-xs flex items-center justify-between transition ${
                                isSelf 
                                  ? 'bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 font-bold' 
                                  : 'bg-zinc-900/40 border border-zinc-900 text-zinc-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`font-mono text-center w-5 font-black text-xs ${
                                  rankIdx === 0 ? 'text-yellow-500' :
                                  rankIdx === 1 ? 'text-zinc-300' :
                                  rankIdx === 2 ? 'text-amber-600' :
                                  'text-zinc-600'
                                }`}>
                                  {rankIdx + 1}
                                </span>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold block truncate max-w-[120px]">{cadet.name}</span>
                                    {isSelf && <span className="bg-yellow-500 text-black text-[7px] font-mono font-extrabold px-1 rounded">YOU</span>}
                                  </div>
                                  <span className="text-[8px] font-mono text-zinc-500">{cadet.rank}</span>
                                </div>
                              </div>

                              <div className="text-right font-mono flex items-center gap-2">
                                <div className="text-[8px] text-zinc-500 leading-tight">
                                  <span>🔥 {cadet.streak}d</span>
                                </div>
                                <strong className="text-xs font-extrabold block text-zinc-200">
                                  {cadet.points} <span className="text-[8px] text-zinc-500 font-normal">XP</span>
                                </strong>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <span className="text-xs text-zinc-650 font-mono">Calculating tactical grades from headquarters...</span>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* 2. SYLLABUS & PLANNER */}
        {subTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">CURRICULUM RADER</h3>
              <p className="text-xs text-zinc-400 font-mono">Select and check topics as you master them to sync progression</p>
            </div>

            <div className="space-y-3">
              {courseSyllabus.map((item) => (
                <div key={item.id} className="p-4 bg-zinc-950 rounded-lg border border-zinc-900 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onUpdateSyllabus(item.id, !item.completed)}
                      className="mt-1 cursor-pointer"
                    >
                      {item.completed ? (
                        <CheckSquare className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <div className="h-5 w-5 rounded border border-zinc-700 hover:border-yellow-500/50" />
                      )}
                    </button>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{item.subject}</span>
                      <h4 className="text-sm font-semibold text-zinc-100">{item.topic}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-mono text-zinc-300 rounded cursor-pointer transition">
                      <Download className="h-3.5 w-3.5" />
                      <span>PDF SHEETS</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PHYSICAL ACTIVITY */}
        {subTab === 'physical' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">DAILY PHYSICAL PROTOCOL</h3>
              <p className="text-xs text-zinc-400 font-mono">Command fitness standard check tool</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Logger form */}
              <form onSubmit={handleLogWorkout} className="p-5 bg-zinc-950 rounded-lg border border-zinc-900 space-y-4">
                <h4 className="text-xs font-mono font-extrabold text-yellow-500 uppercase tracking-widest border-b border-zinc-900 pb-2">log today's drill output</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400">RUNNING (KM):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={runKm}
                      onChange={(e) => setRunKm(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-2 text-sm text-yellow-500 rounded focus:outline-none focus:border-yellow-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400">PUSHUPS (COUNT):</label>
                    <input
                      type="number"
                      value={pushups}
                      onChange={(e) => setPushups(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-2 text-sm text-yellow-500 rounded focus:outline-none focus:border-yellow-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400">SITUPS (COUNT):</label>
                    <input
                      type="number"
                      value={situps}
                      onChange={(e) => setSitups(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-2 text-sm text-yellow-500 rounded focus:outline-none focus:border-yellow-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400">CHINUPS / PULLUPS:</label>
                    <input
                      type="number"
                      value={pullups}
                      onChange={(e) => setPullups(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-2 text-sm text-yellow-500 rounded focus:outline-none focus:border-yellow-500 font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs tracking-wider rounded cursor-pointer transition uppercase"
                >
                  SAVE WORKOUT & DRILL SCORE
                </button>
              </form>

              {/* Training Logs History */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-extrabold text-zinc-400 uppercase tracking-widest">DRILLED ENTRIES HISTORY</h4>
                
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                  {physicalLogs.map((log) => (
                    <div key={log.id} className="p-3.5 bg-zinc-950 rounded border border-zinc-900 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500">{log.date}</span>
                        <div className="flex gap-3 text-xs text-zinc-300 mt-1">
                          <span>🏃 {log.runKm} km</span>
                          <span>💪 {log.pushups} pushups</span>
                          <span>🎯 {log.pullups} pullups</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-green-500 font-bold block">{log.benchmark}</span>
                        <span className="text-lg font-black font-mono text-yellow-500">{log.score} <span className="text-xs text-zinc-500 font-normal">pts</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. VIDEO VAULT */}
        {subTab === 'recorded' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">RECORDED OFFICER LECTURES</h3>
              <p className="text-xs text-zinc-400 font-mono">Watch structured lectures to master syllabus requirements offline</p>
            </div>

            {activeVideo && (
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-900 space-y-4">
                <div className="aspect-video w-full rounded bg-zinc-900 overflow-hidden relative flex items-center justify-center">
                  <video
                    src={activeVideo.videoUrl}
                    controls
                    className="w-full h-full max-h-[360px]"
                    poster="https://images.unsplash.com/photo-1590172545645-12cf36b955b2?q=80&w=600"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest">{activeVideo.chapter}</span>
                  <h4 className="text-base font-bold text-zinc-100">{activeVideo.title}</h4>
                  <p className="text-xs text-zinc-400 font-mono mt-1">Uploaded: {activeVideo.dateUploaded} • Duration: {activeVideo.duration}</p>
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">AVAILABLE CHAPTER MASTER LECTURES</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recordedVideos.map((vid) => (
                  <button
                    key={vid.id}
                    onClick={() => setActiveVideo(vid)}
                    className={`p-3.5 rounded-lg border text-left flex justify-between items-center transition cursor-pointer ${
                      activeVideo?.id === vid.id
                        ? 'bg-zinc-900 border-yellow-500/40 text-white'
                        : 'bg-zinc-950 border-zinc-900 hover:bg-zinc-900/50 text-zinc-300'
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-bold">{vid.title}</h5>
                      <span className="text-[9px] font-mono text-zinc-500 block mt-1">{vid.chapter} • {vid.duration}</span>
                    </div>
                    <Play className="h-4 w-4 text-yellow-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. MOCK EXAM CENTER */}
        {subTab === 'mock' && (
          <div className="space-y-6">
            
            {/* If no active question layout */}
            {!activeTest ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-bold uppercase text-white">TACTICAL EVALUATION DEPOT</h3>
                    <p className="text-xs text-zinc-400 font-mono">Take official academy mock tests mapped to current UPSC guidelines</p>
                  </div>

                  <button
                    onClick={triggerAIGeneratedTest}
                    disabled={aiQuizLoading}
                    className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white rounded text-xs tracking-wider uppercase font-mono font-extrabold shadow-[0_0_20px_rgba(109,40,217,0.3)] transition cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4 animate-spin-slow" />
                    <span>{aiQuizLoading ? "Drafting with AI..." : "GENERATE AI PRACTICE WORK_SHEET"}</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {mockTests.map((test) => (
                    <div key={test.id} className="p-5 bg-zinc-950 rounded-lg border border-zinc-900 flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <span className="text-[10px] font-mono bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 py-0.5 px-2 rounded uppercase tracking-wider">
                          UPSC {test.examType}
                        </span>
                        <h4 className="text-sm font-extrabold text-zinc-100 mt-2">{test.title}</h4>
                        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mt-1">
                          <span>📝 {test.questions.length} QUESTIONS</span>
                          <span>⏱ {test.durationMinutes} MINUTES</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartTest(test)}
                        className="py-2 px-5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-mono font-extrabold rounded cursor-pointer transition uppercase"
                      >
                        COMMENCE TEST EVALUATION
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Quiz Active View
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div>
                    <h4 className="font-bold text-yellow-500 text-sm uppercase font-mono">{activeTest.title}</h4>
                    <p className="text-xs text-zinc-400">Answer carefully. Passing benchmark: 60% accuracy required.</p>
                  </div>
                  <button
                    onClick={() => setActiveTest(null)}
                    className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded text-[10px]"
                  >
                    EXIT TEST
                  </button>
                </div>

                <div className="space-y-6">
                  {activeTest.questions.map((q, idx) => {
                    const selectedOpt = selectedAnswers[q.id];
                    const showFeedback = testScore?.done;

                    return (
                      <div key={q.id} className="p-5 bg-zinc-950 rounded-lg border border-zinc-900 space-y-4">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                          QUESTION {idx + 1} OF {activeTest.questions.length}
                        </span>
                        <h4 className="text-sm font-semibold text-zinc-100 leading-relaxed">{q.text}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedOpt === oIdx;
                            const isCorrect = q.correctIndex === oIdx;

                            let optBtnStyle = "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300";
                            if (isSelected) optBtnStyle = "bg-yellow-500/10 border-yellow-500 text-yellow-500 font-bold";
                            if (showFeedback) {
                              if (isCorrect) optBtnStyle = "bg-green-500/10 border-green-500 text-green-500 font-extrabold";
                              else if (isSelected) optBtnStyle = "bg-red-500/10 border-red-500 text-red-500";
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={showFeedback}
                                onClick={() => handleOptionSelect(q.id, oIdx)}
                                className={`p-3 text-left rounded text-xs border transition ${optBtnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {showFeedback && (
                          <div className="p-3 bg-zinc-900 border-l-4 border-green-500 rounded text-xs text-zinc-300 leading-relaxed">
                            <strong className="text-green-500 block uppercase font-mono tracking-wider mb-0.5">Tactical Explanation:</strong>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Score Summary Panel */}
                {testScore?.done ? (
                  <div className="p-5 bg-yellow-500/5 border border-yellow-500/20 text-center rounded-lg space-y-3">
                    <CheckCircle className="h-10 w-10 text-yellow-500 mx-auto animate-bounce" />
                    <div>
                      <h4 className="font-bold text-lg text-yellow-500">EVALUATION SUMMARY LOGGED</h4>
                      <p className="text-xs text-zinc-400">Score: {testScore.score} Correct out of {testScore.total} answered</p>
                    </div>

                    <div className="text-2xl font-black font-mono text-yellow-100">
                      {Math.round((testScore.score / testScore.total) * 100)}% Pass Rating
                    </div>

                    <button
                      onClick={() => setActiveTest(null)}
                      className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-mono font-bold uppercase rounded cursor-pointer transition border border-yellow-400"
                    >
                      RETURN TO DEPOT
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs tracking-wider uppercase rounded cursor-pointer transition border border-yellow-400"
                  >
                    SUBMIT ANSWERS FOR MILITARY MARKING
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 6. TROPHY / CERTIFICATES */}
        {subTab === 'certificates' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">OFFICIAL COMMISSIONS & CERTIFICATES</h3>
              <p className="text-xs text-zinc-400 font-mono">Commission credentials and honor ranks attained at the Cadet Board</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-zinc-950 rounded-xl border border-yellow-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-yellow-600">
                  <Shield className="h-10 w-10 opacity-15" />
                </div>
                <span className="text-[10px] font-mono text-yellow-500 font-bold uppercase tracking-widest block">LEVEL 1 COMMISSION</span>
                <h4 className="text-base font-extrabold text-zinc-100 mt-2">NDA Base Training Pass Badge</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Awarded to cadets achieving &gt;75% performance score and passing obstacle run logs.</p>
                
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('YUVA DEFENSE ACADEMY COMMISSION FOR ' + student.name);
                    link.download = 'academy_commission.txt';
                    link.click();
                  }}
                  className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-mono font-bold rounded cursor-pointer transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>DOWNLOAD COMMISSION TXT</span>
                </button>
              </div>

              <div className="p-6 bg-zinc-950/40 rounded-xl border border-zinc-900 text-zinc-500 relative">
                <span className="text-[10px] font-mono uppercase tracking-widest block font-bold">LEVEL 2 COMMISSION</span>
                <h4 className="text-base font-extrabold mt-2">Special Forces Air Wings Badge</h4>
                <p className="text-xs mt-1">Requires AFCAT or flying course master completion.</p>
                <span className="absolute bottom-4 right-4 text-[9px] font-mono uppercase border border-zinc-800 py-0.5 px-2 rounded">Locked</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
