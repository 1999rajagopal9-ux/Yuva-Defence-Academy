import React, { useState, useRef, useEffect } from 'react';
import {
  Video, Users, MessageSquare, Hand, Radio, Play, RefreshCw, Send, CheckCircle2, Award, Eraser, Trash
} from 'lucide-react';
import { LiveClass, Course } from '../types';

interface LiveClassroomProps {
  liveClasses: LiveClass[];
  courses: Course[];
  onAddMessage: (classId: string, msg: { sender: string; text: string; role: string; time: string }) => void;
  onVotePoll: (classId: string, optIdx: number) => void;
  onToggleLive: (classId: string) => void;
}

export default function LiveClassroom({
  liveClasses, courses, onAddMessage, onVotePoll, onToggleLive
}: LiveClassroomProps) {

  const activeClass = liveClasses.find(c => c.isLive) || liveClasses[0];
  const [chatText, setChatText] = useState('');
  const [handRaised, setHandRaised] = useState(false);
  const [raisedCount, setRaisedCount] = useState(3);
  const [screenShareActive, setScreenShareActive] = useState(false);

  // Whiteboard drawing tools refs and state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [brushColor, setBrushColor] = useState('#EAB308'); // gold by default
  const [brushSize, setBrushSize] = useState(3);

  // Initialize and attach whiteboard drawing handlers
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background with military blackboard theme initially
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines look tactical
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 0.5;
    const step = 40;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [activeClass]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    isDrawingRef.current = true;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Reapply grid
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 0.5;
    const step = 40;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  // Submit classroom message
  const handlePushMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !activeClass) return;

    onAddMessage(activeClass.id, {
      sender: 'Cadet Ram Kumar (You)',
      text: chatText.trim(),
      role: 'Student',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setChatText('');
  };

  const handleRaiseHandToggle = () => {
    if (handRaised) {
      setRaisedCount(prev => prev - 1);
    } else {
      setRaisedCount(prev => prev + 1);
    }
    setHandRaised(!handRaised);
  };

  return (
    <div className="w-full bg-black rounded-xl border border-zinc-800 text-white min-h-[600px] flex flex-col xl:flex-row overflow-hidden font-sans shadow-2xl">
      
      {/* Live class workspace */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        
        {/* Stream metadata header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className={`h-3 w-3 rounded-full absolute ${activeClass?.isLive ? 'bg-red-500 animate-ping' : 'bg-zinc-600'}`} />
              <span className={`h-2.5 w-2.5 rounded-full relative ${activeClass?.isLive ? 'bg-red-600' : 'bg-zinc-700'}`} />
            </div>
            <div>
              <h3 className="font-bold tracking-tight text-yellow-500 font-sans text-sm uppercase">
                {activeClass?.title || "Operational Briefing Class"}
              </h3>
              <p className="text-[10px] font-mono text-zinc-400">Instructor: {activeClass?.facultyName || "Academy Major"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLive(activeClass.id)}
              className={`px-3 py-1 flex items-center gap-1 text-[10px] font-mono rounded cursor-pointer border ${
                activeClass?.isLive 
                  ? 'bg-red-950/40 text-red-500 border-red-500/20' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              <Radio className="h-4 w-4" />
              <span>{activeClass?.isLive ? 'BROADCASTING' : 'OFFLINE'}</span>
            </button>

            <button
              onClick={() => setScreenShareActive(!screenShareActive)}
              className={`px-3 py-1 text-[10px] font-mono rounded border transition cursor-pointer ${
                screenShareActive 
                  ? 'bg-yellow-500 text-black border-yellow-400 font-bold' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              SHARE SCREEN
            </button>
          </div>
        </div>

        {/* Video feed viewport OR Whiteboard canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
          
          {/* Main Stage: Whiteboard Canvas Drawing Block */}
          <div className="lg:col-span-2 rounded-xl bg-zinc-950 border border-zinc-900 overflow-hidden flex flex-col justify-between p-3 relative h-[420px]">
            <div className="absolute top-2 left-2 bg-black/80 text-yellow-500/90 py-0.5 px-2 rounded border border-yellow-500/20 text-[9px] font-mono z-10 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 animate-pulse" />
              <span>COMMAND INTELLIGENT WHITEBOARD</span>
            </div>

            <canvas
              ref={canvasRef}
              width="600"
              height="340"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full flex-1 rounded bg-zinc-950 border border-zinc-900/40 cursor-crosshair"
            />

            {/* Whiteboard Controls palette */}
            <div className="mt-2.5 bg-zinc-900/80 border border-zinc-800 rounded p-2 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">COLORS:</span>
                <div className="flex gap-1.5">
                  {['#EAB308', '#EF4444', '#22C55E', '#3B82F6', '#FFFFFF'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      className={`h-5 w-5 rounded-full border cursor-pointer flex items-center justify-center transition-all ${
                        brushColor === color ? 'ring-2 ring-yellow-500/60 scale-110' : 'border-zinc-700/50 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-zinc-500">SIZE:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value) || 3)}
                    className="w-16 accent-yellow-500 cursor-pointer h-1 rounded"
                  />
                </div>

                <div className="h-4 w-[1px] bg-zinc-800" />

                <button
                  onClick={clearCanvas}
                  className="p-1 px-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-mono text-zinc-300 rounded flex items-center gap-1 cursor-pointer transition"
                >
                  <Trash className="h-3.5 w-3.5" />
                  <span>CLEAR BOARD</span>
                </button>
              </div>
            </div>
          </div>

          {/* Secondary screen: Faculty preview screen block */}
          <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-4 flex flex-col justify-between h-[420px]">
            <div className="space-y-4">
              <div className="aspect-video w-full rounded bg-zinc-900 border border-zinc-800 overflow-hidden relative flex items-center justify-center">
                {screenShareActive ? (
                  <div className="text-center p-3">
                    <span className="text-[9px] font-mono text-yellow-500 block animate-pulse mb-1">SCREENCAST BROADCAST ON</span>
                    <strong className="text-xs text-white">Interactive Syllabus PDF</strong>
                  </div>
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=260"
                    alt="Commander Nair"
                    className="w-full h-full object-cover filter brightness-75"
                  />
                )}
                <div className="absolute bottom-2 left-2 bg-black/90 py-0.5 px-1.5 rounded text-[8px] font-mono uppercase tracking-wider text-green-400">
                  {screenShareActive ? 'SCREEN MODE' : 'COL. VICTOR FEED'}
                </div>
              </div>

              {/* Attendance quick checker */}
              <div className="p-3 bg-zinc-900/50 rounded border border-zinc-900 text-xs font-mono">
                <span className="text-[9px] text-zinc-500 block uppercase mb-1">LIVE DETECTOR PANEL</span>
                <div className="flex justify-between text-zinc-300">
                  <span>Duty Cadets:</span>
                  <span className="text-white font-bold">120 Present</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Raise hands active:</span>
                  <span className="text-yellow-500 font-bold">{raisedCount}</span>
                </div>
              </div>
            </div>

            {/* Hand raising triggers */}
            <button
              onClick={handleRaiseHandToggle}
              className={`w-full py-2 px-4 rounded font-mono text-xs font-extrabold flex items-center justify-center gap-2 border transition duration-300 cursor-pointer uppercase ${
                handRaised 
                  ? 'bg-yellow-500 text-black border-yellow-400' 
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
            >
              <Hand className="h-4 w-4" />
              <span>{handRaised ? 'HAND RAISED ON DESK' : 'SUBMIT DIRECT QUESTION'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Right control: Realtime chat feed + Active lecture polls */}
      <div className="w-full xl:w-1/3 bg-zinc-950 border-l border-zinc-900 p-4 flex flex-col justify-between h-[520px] xl:h-auto">
        
        {/* Dynamic Poll view first */}
        {activeClass?.activePoll && (
          <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg mb-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-yellow-500 border-b border-yellow-500/10 pb-1.5 uppercase">
              <CheckCircle2 className="h-4 w-4" />
              <span>COMMAND POLLED INVENTORY </span>
            </div>
            
            <h5 className="text-xs text-zinc-200 font-semibold">{activeClass.activePoll.question}</h5>
            
            <div className="space-y-2">
              {activeClass.activePoll.options.map((opt, idx) => {
                const totalVotes = activeClass.activePoll!.votes.reduce((a, b) => a + b, 0);
                const pct = totalVotes > 0 ? Math.round((activeClass.activePoll!.votes[idx] / totalVotes) * 100) : 0;
                const hasVoted = activeClass.activePoll!.hasVoted;

                return (
                  <button
                    key={idx}
                    disabled={hasVoted}
                    onClick={() => onVotePoll(activeClass.id, idx)}
                    className="w-full text-left relative overflow-hidden rounded bg-zinc-900 hover:bg-zinc-850 p-2 text-xs text-zinc-300 border border-zinc-800/80 transition cursor-pointer"
                  >
                    {/* Visual meter percentage bar */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-yellow-500/10 transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative flex justify-between z-10 font-mono">
                      <span>{opt}</span>
                      <span className="font-bold text-yellow-500">{pct}% ({activeClass.activePoll!.votes[idx]})</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Live chat stream feed */}
        <div className="flex-1 flex flex-col min-h-0 bg-zinc-950">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 border-b border-zinc-900 pb-2 mb-2">
            <MessageSquare className="h-4 w-4 text-zinc-400" />
            <span>ENROLLMENT_CHAT_LOGGER</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 p-1 mb-2 max-h-[220px] xl:max-h-[380px]">
            {activeClass?.chatMessages.map((msg, index) => (
              <div key={index} className="text-xs space-y-0.5">
                <div className="flex justify-between font-mono">
                  <span className={`font-mono font-bold ${msg.role === 'Faculty' ? 'text-yellow-500' : 'text-zinc-400'}`}>
                    [{msg.role === 'Faculty' ? 'OFFICER' : 'CADET'}] {msg.sender}
                  </span>
                  <span className="text-[9px] text-zinc-600">{msg.time}</span>
                </div>
                <p className="p-2 py-1.5 bg-zinc-900/60 rounded text-zinc-200 border border-zinc-900/40">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Submission row */}
          <form onSubmit={handlePushMessage} className="flex gap-2">
            <input
              type="text"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Submit chat to squadron..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500"
            />
            <button
              type="submit"
              disabled={!chatText.trim()}
              className="p-2 px-4 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-mono font-bold uppercase rounded cursor-pointer transition disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
