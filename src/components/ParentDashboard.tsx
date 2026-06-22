import React, { useState } from 'react';
import {
  Shield, CheckCircle, AlertTriangle, Calendar, Award, DollarSign, Send, MessageSquare, AlertCircle, HeartCrack
} from 'lucide-react';
import { StudentProfile, ParentNotification, PhysicalActivityLog, Course } from '../types';

interface ParentDashboardProps {
  student: StudentProfile;
  course: Course;
  notifications: ParentNotification[];
  physicalLogs: PhysicalActivityLog[];
  onAddNotification: (n: ParentNotification) => void;
}

export default function ParentDashboard({
  student, course, notifications, physicalLogs, onAddNotification
}: ParentDashboardProps) {

  const [parentSubTab, setParentSubTab] = useState<'status' | 'reports' | 'finance' | 'faculty'>('status');
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Commandant Singh', text: "Namaste. Cadet Ram is demonstrating supreme resilience in morning obstacle drills. He was awarded batch Cadet-Sergeant title today. His vectors homework is a vital focus area this evening.", time: 'Yesterday, 04:30 PM' }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Send message to Cadet Command
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, {
      sender: 'Parent',
      text: userText,
      time: 'Just now'
    }]);

    setIsSending(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'Commandant Singh',
        text: "Jai Hind, respected Parent. I have registered your check. Instructing Cadet Ram immediately during sunset roll-call.",
        time: 'Just now'
      }]);
      setIsSending(false);
    }, 1000);
  };

  return (
    <div className="w-full bg-black rounded-xl border border-zinc-800 text-white min-h-[580px] flex flex-col xl:flex-row overflow-hidden font-sans shadow-2xl">
      
      {/* Sidebar Panel for Parents with critical indicators */}
      <div className="w-full xl:w-1/4 bg-zinc-950 border-r border-zinc-900 p-5 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <h4 className="text-[10px] font-mono text-yellow-500 font-extrabold uppercase tracking-widest mb-1">PARENT SECURE LOGIN</h4>
            <h3 className="text-sm font-bold text-zinc-100 uppercase">Guardian Dashboard</h3>
            <p className="text-[10px] font-mono text-zinc-400 mt-1">Liaised Cadet: <span className="text-yellow-500 font-bold">{student.name}</span></p>
          </div>

          <div className="space-y-1">
            {[
              { id: 'status', title: 'Cadet Health & Status', icon: Shield },
              { id: 'reports', title: 'Performance Reports', icon: Award },
              { id: 'finance', title: 'Fees & Transaction', icon: DollarSign },
              { id: 'faculty', title: 'Direct Faculty Liaison', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setParentSubTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-left text-xs font-mono tracking-wider transition ${
                  parentSubTab === tab.id
                    ? 'bg-yellow-500 text-black font-bold'
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

        {/* Cadet Quick Stats */}
        <div className="p-3.5 bg-zinc-900/30 rounded border border-zinc-900 text-[10px] font-mono space-y-2 text-zinc-400">
          <div className="flex justify-between items-center">
            <span>WEEKLY ATTENDANCE:</span>
            <span className="text-green-500 font-bold">{student.attendancePercent}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span>DRILL ENDURANCES:</span>
            <span className="text-yellow-500 font-bold">{physicalLogs[0]?.score || 0}/100</span>
          </div>
          <div className="flex justify-between items-center">
            <span>UPCOMING PAYMENT STATUS:</span>
            <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-1 py-0.2 rounded font-extrabold">CLEARED</span>
          </div>
        </div>
      </div>

      {/* Main Panel Content container */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* Tab 1: Health & General Status */}
        {parentSubTab === 'status' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">CADET REAL-TIME PROGRESS HUD</h3>
              <p className="text-xs text-zinc-400 font-mono">Immediate feedback logs regarding physical fatigue and drills</p>
            </div>

            {/* Attendance indicator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-900 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono text-zinc-500 uppercase">MONTHLY ATTENDANCE</h4>
                  <div className="text-3xl font-black font-mono text-green-500 mt-1">{student.attendancePercent}%</div>
                  <p className="text-[10px] text-zinc-400 mt-1">Excellent standing. Required benchmark: 85%</p>
                </div>
                <div className="p-4 bg-green-500/10 text-green-500 rounded-full">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>

              <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-900 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono text-zinc-500 uppercase">PHYSICAL PERFORMANCE SCORE</h4>
                  <div className="text-3xl font-black font-mono text-yellow-500 mt-1">{physicalLogs[0]?.score || 0} Pts</div>
                  <p className="text-[10px] text-zinc-400 mt-1">{physicalLogs[0]?.benchmark} • Verified by Drill Staff</p>
                </div>
                <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-full">
                  <Award className="h-8 w-8 animate-bounce" />
                </div>
              </div>
            </div>

            {/* Notifications list */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-2">COMMAND COMMUNICATIONS LOGGER</h4>
              
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 bg-zinc-950 rounded-lg border border-zinc-900 flex items-start gap-3 hover:border-zinc-800 transition">
                    <div className="p-2 rounded bg-zinc-900 shrink-0">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">{n.date} • {n.category}</span>
                      <h5 className="text-xs font-bold text-zinc-100 mt-0.5">{n.title}</h5>
                      <p className="text-xs text-zinc-300 leading-relaxed mt-1">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Performance Reports */}
        {parentSubTab === 'reports' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">OFFICIAL ACADEMIC GRADIENT</h3>
              <p className="text-xs text-zinc-400 font-mono">UPSC Sectional mocks and test metrics history</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-zinc-950 rounded-lg border border-zinc-900 space-y-4">
                <h4 className="text-xs font-mono font-bold text-yellow-500 uppercase">SUBJECT PERCENTAGES METRIC</h4>
                
                <div className="space-y-3">
                  {[
                    { subject: 'Mathematics (Calculus/Trig)', score: 85, color: 'bg-yellow-500' },
                    { subject: 'GAT General Science', score: 90, color: 'bg-green-500' },
                    { subject: 'GAT English Comprehension', score: 78, color: 'bg-blue-500' },
                    { subject: 'Military tactics & general history', score: 94, color: 'bg-indigo-500' }
                  ].map((sub, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-300">{sub.subject}</span>
                        <span className="font-bold text-yellow-500">{sub.score}%</span>
                      </div>
                      <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div className={`h-full ${sub.color}`} style={{ width: `${sub.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical Activity metrics */}
              <div className="p-5 bg-zinc-950 rounded-lg border border-zinc-900 space-y-4">
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase">DRILL AND OUTDOOR MARKS</h4>
                
                <div className="space-y-3">
                  {[
                    { activity: '1.6 Km timed run (NDA standards)', status: 'Outstanding (5.2 mins)' },
                    { activity: 'Pushup endurance limits', status: '45 completed' },
                    { activity: 'Pullup beam exercises', status: '10 count' },
                    { activity: 'Horizontal obstacle jumps', status: 'Grade A passed' }
                  ].map((act, id) => (
                    <div key={id} className="p-2.5 bg-zinc-900/60 rounded border border-zinc-900 flex justify-between text-xs">
                      <span className="text-zinc-300 font-medium">{act.activity}</span>
                      <span className="font-mono text-yellow-500 font-bold">{act.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Fees & Transactions */}
        {parentSubTab === 'finance' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">BILLING AND ACCOUNTS</h3>
              <p className="text-xs text-zinc-400 font-mono">Clear pending tuition and lodging fees securely</p>
            </div>

            <div className="p-5 bg-zinc-950 rounded-lg border border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-[10px] font-mono text-green-500 bg-green-500/10 border border-green-500/20 py-0.5 px-2 rounded font-extrabold uppercase tracking-wider">
                  Dues cleared
                </span>
                <h4 className="text-base font-bold text-zinc-100 mt-2">{course.title} enrollment fee</h4>
                <p className="text-xs text-zinc-400 font-mono">Completed Transaction Value: ₹{course.price}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Tuition Dues</span>
                <span className="text-2xl font-black text-green-500 font-mono">₹0</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Classroom/Faculty messaging */}
        {parentSubTab === 'faculty' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-xl font-bold uppercase text-white">DIRECT COMMAND liaison</h3>
              <p className="text-xs text-zinc-400 font-mono">Communicate with Academy Commandant Col. Hardeep Singh (Retd.)</p>
            </div>

            <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 flex flex-col h-[320px]">
              <div className="flex-1 overflow-y-auto space-y-3 p-1">
                {messages.map((m, idx) => (
                  <div key={idx} className={`p-3 max-w-[80%] rounded ${
                    m.sender === 'Parent' ? 'bg-yellow-500/15 border border-yellow-500/25 ml-auto text-yellow-50' : 'bg-zinc-900 border border-zinc-800 mr-auto text-zinc-100'
                  }`}>
                    <span className="text-[9px] font-mono tracking-widest text-zinc-500 block uppercase mb-1">{m.sender} • {m.time}</span>
                    <p className="text-xs leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inquire about Cadet fitness standard..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-xs px-3 py-2 rounded focus:outline-none focus:border-yellow-500"
                />
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-mono font-bold px-4 py-2 rounded flex items-center gap-1 cursor-pointer transition"
                >
                  <span>SEND</span>
                  <Send className="h-3 w-3" />
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
