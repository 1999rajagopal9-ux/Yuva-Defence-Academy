import React, { useState } from 'react';
import {
  Settings, Bot, ShieldAlert, Award, FileText, Database, UserCheck, Plus, Trash, Edit, RefreshCw, KeyRound, Lock, FileSpreadsheet
} from 'lucide-react';
import {
  AISettings, Course, SyllabusItem, AIKnowledgeBase, Transaction, StudentProfile, Quote, AuditLog
} from '../types';

interface AdminPanelProps {
  settings: AISettings;
  onUpdateSettings: (s: AISettings) => void;
  courses: Course[];
  onAddCourse: (c: Course) => void;
  onDeleteCourse: (id: string) => void;
  syllabus: SyllabusItem[];
  onAddSyllabus: (s: SyllabusItem) => void;
  transactions: Transaction[];
  students: StudentProfile[];
  quotes: Quote[];
  onAddQuote: (q: Quote) => void;
  onDeleteQuote: (id: string) => void;
  auditLogs: AuditLog[];
  onAddAuditLog: (log: AuditLog) => void;
}

export default function AdminPanel({
  settings, onUpdateSettings, courses, onAddCourse, onDeleteCourse, syllabus, onAddSyllabus,
  transactions, students, quotes, onAddQuote, onDeleteQuote, auditLogs, onAddAuditLog
}: AdminPanelProps) {

  // Inner admin navigation: 'ai-training', 'academics', 'content', 'users', 'finance', 'audits'
  const [adminTab, setAdminTab] = useState<'ai-training' | 'academics' | 'content' | 'users' | 'finance' | 'audits'>('ai-training');
  
  // Security lock state
  const [unlocked, setUnlocked] = useState(false);
  const [pincode, setPincode] = useState('');

  // AI custom training state
  const [customPrompt, setCustomPrompt] = useState(settings.systemPrompt);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [speechEnabled, setSpeechEnabled] = useState(settings.enableVoice);

  // Quote state adder
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');

  // Course state adder
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [coursePrice, setCoursePrice] = useState('35000');
  const [courseCategory, setCourseCategory] = useState<'Army' | 'Navy' | 'Airforce' | 'Combined'>('Combined');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode === '1999') {
      setUnlocked(true);
      onAddAuditLog({
        id: `aud-${Date.now()}`,
        user: 'Headquarters Commandant',
        action: 'SUPERPORTAL_UNLOCKED',
        timestamp: new Date().toLocaleTimeString(),
        details: 'Admin super portal decrypted using master pin.'
      });
    } else {
      alert("INCORRECT COMMAND ACCESS PIN. DECRYPTION ABORTED.");
    }
  };

  const handleSaveAISettings = () => {
    onUpdateSettings({
      ...settings,
      systemPrompt: customPrompt,
      enableVoice: speechEnabled
    });

    onAddAuditLog({
      id: `aud-${Date.now()}`,
      user: 'Commandant',
      action: 'AI_SETTINGS_MUTATED',
      timestamp: new Date().toLocaleTimeString(),
      details: 'Chief Drill Officer system prompt customized.'
    });

    alert("AI Virtual Advisor Settings successfully written to server memory!");
  };

  const handleAddKnowledgeFact = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    
    const newFact: AIKnowledgeBase = {
      id: `fact-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: 'general'
    };

    onUpdateSettings({
      ...settings,
      knowledgeBase: [...settings.knowledgeBase, newFact]
    });

    setNewQuestion('');
    setNewAnswer('');

    onAddAuditLog({
      id: `aud-${Date.now()}`,
      user: 'Chief Intel Cdr',
      action: 'AI_BRAIN_TRAINED',
      timestamp: new Date().toLocaleTimeString(),
      details: `Injected new factual guideline: "${newFact.question.slice(0, 30)}..."`
    });
  };

  const handleDeleteFact = (fId: string) => {
    onUpdateSettings({
      ...settings,
      knowledgeBase: settings.knowledgeBase.filter(f => f.id !== fId)
    });

    onAddAuditLog({
      id: `aud-${Date.now()}`,
      user: 'Chief Intel Cdr',
      action: 'AI_BRAIN_FACT_PRUNED',
      timestamp: new Date().toLocaleTimeString(),
      details: `Removed target factual node ID: ${fId}`
    });
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    const price = parseFloat(coursePrice) || 25000;
    const newC: Course = {
      id: `course-${Date.now()}`,
      title: courseTitle,
      description: courseDesc,
      exam: 'Academy Customized entrance UPSC exam target',
      duration: '8 Months',
      price,
      syllabusOverview: ['General training', 'Academics core', 'Personality drill'],
      bannerUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=400',
      facultyName: 'Reserve Officer Wing',
      category: courseCategory
    };

    onAddCourse(newC);
    setCourseTitle('');
    setCourseDesc('');

    onAddAuditLog({
      id: `aud-${Date.now()}`,
      user: 'Commandant',
      action: 'COURSE_AUTHORIZED',
      timestamp: new Date().toLocaleTimeString(),
      details: `Authorized new Academy program: ${newC.title}`
    });
  };

  const handleAddMotivationalQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;

    onAddQuote({
      id: `q-${Date.now()}`,
      text: newQuoteText,
      author: newQuoteAuthor || 'Unknown Hero'
    });

    setNewQuoteText('');
    setNewQuoteAuthor('');

    onAddAuditLog({
      id: `aud-${Date.now()}`,
      user: 'Drill Sergeant',
      action: 'MOTIVATIONAL_QUOTE_ADDED',
      timestamp: new Date().toLocaleTimeString(),
      details: 'Added daily quote to main command hub entrance.'
    });
  };

  // Secure login shield
  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto p-6 bg-zinc-950 border border-red-500/30 rounded-xl space-y-4 text-center font-sans tracking-wide">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto animate-pulse" />
        <h3 className="text-lg font-black text-red-500 uppercase tracking-widest">SECURE COMBAT ACCESS DESK</h3>
        <p className="text-xs text-zinc-400">Enter headquarter clearance pin to decrypt Admin Super Control board.</p>
        
        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            placeholder="ENTER HEADQUARTER PIN (Try 1999)"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-center p-2.5 text-sm rounded focus:outline-none focus:border-red-500 font-bold tracking-widest text-red-500 placeholder-zinc-700"
          />
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-extrabold text-xs tracking-widest uppercase rounded cursor-pointer transition border border-red-500"
          >
            DECRYPT AND ACCESS
          </button>
        </form>
        <span className="block text-[9px] font-mono text-zinc-600">ENCRYPTED PROTOCOL: AES-256 COOP</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-black rounded-xl border border-zinc-800 text-white min-h-[580px] flex flex-col xl:flex-row overflow-hidden font-sans shadow-2xl">
      
      {/* Admin Subnav */}
      <div className="w-full xl:w-1/4 bg-zinc-950 border-r border-zinc-900 p-5 space-y-6 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-lg">
            <h4 className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-widest">ACADEMY COMMAND HQ</h4>
            <h3 className="text-sm font-bold text-zinc-100 uppercase">Super Control Board</h3>
          </div>

          <div className="space-y-1">
            {[
              { id: 'ai-training', title: 'Tuning: AI Officer', icon: Bot },
              { id: 'academics', title: 'Curriculum & Courses', icon: Award },
              { id: 'content', title: 'Banner & Quotes', icon: FileText },
              { id: 'users', title: 'Instructors & Cadets', icon: UserCheck },
              { id: 'finance', title: 'Admissions & Ledger', icon: Database },
              { id: 'audits', title: 'Audit SECURE LOGS', icon: ShieldAlert }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-left text-xs font-mono tracking-wider transition ${
                  adminTab === tab.id
                    ? 'bg-red-700 text-white font-bold border-l-4 border-red-500'
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

        <button
          onClick={() => setUnlocked(false)}
          className="w-full p-2.5 bg-zinc-900 hover:bg-red-900/30 text-red-400 border border-zinc-805 text-xs font-mono rounded text-center cursor-pointer transition uppercase"
        >
          Lock Command Console
        </button>
      </div>

      {/* Admin Central Deck Panel */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* Tab 1: AI COMMAND BRAIN TUNING */}
        {adminTab === 'ai-training' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">AI MAJOR TRAINING AND CONFIG</h3>
              <p className="text-xs text-zinc-400 font-mono">Calibrate voice prompts, adjust military behavior presets, or inject custom admissions updates</p>
            </div>

            <div className="p-5 bg-zinc-950 rounded-lg border border-zinc-900 space-y-4">
              <h4 className="text-xs font-mono font-bold text-yellow-500 uppercase tracking-widest border-b border-zinc-900 pb-2">behavioral system prompt</h4>
              
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs text-zinc-200 rounded focus:border-yellow-500 outline-none leading-relaxed font-sans"
                placeholder="Instruct the AI character tone..."
              />

              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-zinc-300 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={speechEnabled}
                    onChange={(e) => setSpeechEnabled(e.target.checked)}
                  />
                  <span>ENABLE COMPRESSIVE SYNTH VOICES</span>
                </label>

                <button
                  onClick={handleSaveAISettings}
                  className="py-2 px-5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs font-mono rounded cursor-pointer transition uppercase"
                >
                  COMMIT AI BEHAVIOR CHANNELS
                </button>
              </div>
            </div>

            {/* Train FAQ Knowledge Bases */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">TRAINABLE FAQ KNOWLEDGE BASE ({settings.knowledgeBase.length} Facts Loaded)</h4>
              
              {/* Form loader */}
              <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-900 space-y-3">
                <input
                  type="text"
                  placeholder="Inquire prompt (e.g. Can parents check workout scores?)"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs text-zinc-200 rounded outline-none h-9"
                />

                <textarea
                  placeholder="Trained response reply..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs text-zinc-200 rounded outline-none h-16"
                />

                <button
                  onClick={handleAddKnowledgeFact}
                  className="py-1.5 px-4 bg-zinc-905 hover:bg-zinc-800 border border-zinc-805 text-xs text-yellow-500 font-mono rounded flex items-center gap-1.5 cursor-pointer ml-auto transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>INJECT INTEL UNIT TO COGNITION</span>
                </button>
              </div>

              {/* List of custom facts */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                {settings.knowledgeBase.map((fact) => (
                  <div key={fact.id} className="p-3 bg-zinc-950 rounded border border-zinc-900 flex justify-between items-start gap-3">
                    <div className="text-xs space-y-1">
                      <strong className="text-yellow-500">Q: {fact.question}</strong>
                      <p className="text-zinc-300 leading-relaxed">A: {fact.answer}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteFact(fact.id)}
                      className="p-1 hover:bg-red-500/15 text-red-500 rounded cursor-pointer shrink-0 transition"
                      title="Destroy Fact"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: COURSE & SYLLABUS OPERATIONS */}
        {adminTab === 'academics' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">EDUCATION SCHEDULER HUB</h3>
              <p className="text-xs text-zinc-400 font-mono">Commission NDA/CDS/AFCAT courses first-hand or adjust subjects</p>
            </div>

            <form onSubmit={handleCreateCourse} className="p-5 bg-zinc-950 rounded-lg border border-zinc-900 space-y-4">
              <h4 className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest border-b border-zinc-900 pb-2">Enroll New Cadet Program</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500">PROGRAM TITLE:</label>
                  <input
                    type="text"
                    required
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs text-zinc-200 rounded"
                    placeholder="NDA Ultimate Command Course"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500">COURSE TUITION PRICE (INR):</label>
                  <input
                    type="number"
                    required
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs text-zinc-200 rounded"
                    placeholder="45000"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500">BRIEF MISSION DESCRIPTION:</label>
                <textarea
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs text-zinc-200 rounded h-16"
                  placeholder="Comprehensive description..."
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 mr-2">SERVICE CATEGORY:</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 py-1.5 px-3 rounded"
                  >
                    <option value="Army">Army wing</option>
                    <option value="Navy">Navy wing</option>
                    <option value="Airforce">Airforce wing</option>
                    <option value="Combined">Combined branches</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="py-2 px-5 bg-red-700 hover:bg-red-600 text-white font-mono font-bold text-xs rounded cursor-pointer transition border border-red-500"
                >
                  AUTHORIZE COURSE INTAKE
                </button>
              </div>
            </form>

            {/* List current course maps */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">ACTIVE REGISTERED COURSES ({courses.length})</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((c) => (
                  <div key={c.id} className="p-4 bg-zinc-950 rounded-lg border border-zinc-900 flex justify-between items-start gap-3">
                    <div className="text-xs space-y-1">
                      <span className="text-[9px] font-mono text-yellow-500 uppercase font-bold">{c.category} • {c.duration}</span>
                      <h5 className="font-extrabold text-zinc-100">{c.title}</h5>
                      <p className="text-zinc-400 leading-relaxed text-[11px]">{c.description}</p>
                      <strong className="block text-yellow-500 font-mono mt-1">₹{c.price} Tuition</strong>
                    </div>

                    <button
                      onClick={() => onDeleteCourse(c.id)}
                      className="p-1 hover:bg-red-500/15 text-red-500 rounded cursor-pointer shrink-0 transition"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: CORE CONTENT / MOTIVATIONAL MEDIA */}
        {adminTab === 'content' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">MILITARY QUOTE & MEDIA BRIEF</h3>
              <p className="text-xs text-zinc-400 font-mono">Commission dynamic background quotes displayed in the cinematic landing viewport</p>
            </div>

            <form onSubmit={handleAddMotivationalQuote} className="p-5 bg-zinc-950 rounded-lg border border-zinc-900 space-y-4">
              <h4 className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest border-b border-zinc-900 pb-2">Add Motivational Quote</h4>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400">QUOTE BRIEF PHRASE:</label>
                  <textarea
                    required
                    value={newQuoteText}
                    onChange={(e) => setNewQuoteText(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs text-zinc-100 rounded focus:border-red-500 outline-none"
                    placeholder="E.g. We fight to win and win with a knockout..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400">AUTHOR / HERO DESIGNATION:</label>
                  <input
                    type="text"
                    required
                    value={newQuoteAuthor}
                    onChange={(e) => setNewQuoteAuthor(e.target.value)}
                    className="w-full bg-zinc-905 border border-zinc-800 p-2 text-xs text-zinc-100 rounded focus:border-red-500 outline-none"
                    placeholder="Field Marshal Sam Manekshaw"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-500 text-white font-mono font-bold text-xs uppercase rounded cursor-pointer transition"
              >
                COMMIT DAILY QUOTE
              </button>
            </form>

            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">HEROIC BRIEFINGS REGISTER ({quotes.length})</h4>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {quotes.map((q) => (
                  <div key={q.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded flex justify-between items-center">
                    <div className="text-xs">
                      <p className="italic text-yellow-100/90 leading-relaxed font-serif">"{q.text}"</p>
                      <span className="text-[10px] font-mono text-zinc-500 block uppercase mt-1">— {q.author}</span>
                    </div>

                    <button
                      onClick={() => onDeleteQuote(q.id)}
                      className="p-1 hover:bg-red-500/15 text-red-500 rounded shrink-0 cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: USERS & ACTIVE CADETS DIRECTORY */}
        {adminTab === 'users' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">COMMISSIONED CADETS DIRECTORY</h3>
              <p className="text-xs text-zinc-400 font-mono">Assigned cadet rosters and enrollment records</p>
            </div>

            <div className="space-y-3.5">
              {students.map((student, idx) => (
                <div key={idx} className="p-5 bg-zinc-950 rounded-lg border border-zinc-900 flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-950 text-red-500 border border-red-500/20 rounded-full font-bold">
                      CDT
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-zinc-100">{student.name}</h4>
                      <div className="flex gap-4 text-[10px] font-mono text-zinc-400 mt-1">
                        <span>CODE: {student.enrollmentId}</span>
                        <span>COHORT: {student.batch}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-yellow-500 block">{student.rank}</span>
                    <span className="text-xs font-mono text-zinc-400">Attendance: {student.attendancePercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: FINANCIAL LOGS AND ADMISSIONS REGISTER */}
        {adminTab === 'finance' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">ACADEMY ADMISSION FINANCE LEDGER</h3>
              <p className="text-xs text-zinc-400 font-mono">Real-time compilation of secure transaction clearances</p>
            </div>

            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-900">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-3">
                <span className="text-xs font-mono text-zinc-400">LEDGER STATUS: EXCELLENT STANDING</span>
                <button
                  onClick={() => {
                    // Export logs to excel simulation
                    const link = document.createElement('a');
                    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent("TXN_ID,NAME,COURSE,AMOUNT,STATUS\n" + transactions.map(t => `${t.id},${t.studentName},${t.courseName},${t.amount},${t.status}`).join('\n'));
                    link.download = 'academy_finance_ledger.csv';
                    link.click();
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-mono text-zinc-300 rounded cursor-pointer transition uppercase"
                >
                  <FileSpreadsheet className="h-4.5 w-4.5" />
                  <span>EXPORT SPREADSHEET</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto">
                {transactions.map((t) => (
                  <div key={t.id} className="p-4 bg-zinc-950 border border-zinc-900 rounded flex justify-between items-center text-xs">
                    <div>
                      <strong className="block text-zinc-200">{t.studentName}</strong>
                      <span className="text-[10px] font-mono text-zinc-500">{t.courseName} • Gateway {t.paymentMethod}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-green-500 block font-bold">{t.status}</span>
                      <span className="text-sm font-black font-mono text-yellow-500">₹{t.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: SYSTEM SECURITY AUDIT LOGS */}
        {adminTab === 'audits' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">SYSTEM SECURITY AUDIT HUD</h3>
              <p className="text-xs text-zinc-400 font-mono">Chronological event stream documenting security calibrations and super control logins</p>
            </div>

            <div className="space-y-2.5">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg flex items-start gap-3 hover:border-zinc-850 transition">
                  <div className="p-2 bg-red-950/20 text-red-500 rounded shrink-0">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div className="text-xs">
                    <div className="flex gap-4 font-mono text-zinc-500">
                      <span>[{log.timestamp}]</span>
                      <strong className="text-red-500 font-bold uppercase text-[10px]">{log.action}</strong>
                    </div>
                    <p className="font-semibold text-zinc-100 mt-1">{log.details}</p>
                    <span className="text-[9px] font-mono text-zinc-600 block mt-0.5">Clearance: {log.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
