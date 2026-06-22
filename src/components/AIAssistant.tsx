import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Volume2, VolumeX, Mic, Languages, Shield, ChevronDown, Award, Sparkles, AlertCircle } from 'lucide-react';
import { AIKnowledgeBase, AISettings } from '../types';

interface AIAssistantProps {
  settings: AISettings;
  onUpdateSettings: (s: AISettings) => void;
  courses: any[];
}

export default function AIAssistant({ settings, onUpdateSettings, courses }: AIAssistantProps) {
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant' | 'system'; text: string; time: string; voiceSynthUrl?: string }[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: "Jai Hind Cadet! I am Major Vikram, your AI Command Mentor and Academic Advisor at Yuva Defense Academy. What is your objective today? Ask me about exams, syllabus structure, fitness criteria, or course enrollments.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [humanTransferred, setHumanTransferred] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  
  // Voice synth simulator ref for the waveform visuals
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Audio frequency oscillator simulation when speaking
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let progress = 0;
    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.lineWidth = 2.5;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#B45309'); // gold-amber
      gradient.addColorStop(0.5, '#F59E0B');
      gradient.addColorStop(1, '#92400E');
      ctx.strokeStyle = gradient;

      for (let x = 0; x < canvas.width; x++) {
        // amplitude goes high when speaking or simulating audio
        const amplitude = isSpeaking ? Math.sin(progress + x * 0.05) * 12 + 6 * Math.sin(progress * 2.5 + x * 0.1) : Math.sin(x * 0.02) * 1.5;
        const y = canvas.height / 2 + amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      progress += isSpeaking ? 0.18 : 0.015;
      animationFrameRef.current = requestAnimationFrame(drawWave);
    };

    drawWave();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isSpeaking]);

  // Stop any playing sound
  const stopAudio = () => {
    setIsSpeaking(false);
  };

  const speakText = async (textToSpeak: string, customAudioBase64?: string) => {
    stopAudio();
    if (!voiceMode) return;
    setIsSpeaking(true);

    try {
      // If server returned live voice synthesized stream
      if (customAudioBase64) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext({ sampleRate: 24000 });
        audioContextRef.current = ctx;

        // Convert base64 back into buffer
        const binary = atob(customAudioBase64);
        const arrayBuffer = new ArrayBuffer(binary.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binary.length; i++) {
          view[i] = binary.charCodeAt(i);
        }

        // Float 16 bit PCM decoding manually or using basic decoder
        ctx.decodeAudioData(arrayBuffer, (buffer) => {
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.onended = () => setIsSpeaking(false);
          source.start();
        }, () => {
          // Play simulated speaker audio if native binary decoding blocks
          playFallbackBeeps(ctx, textToSpeak);
        });
        return;
      }

      // Speech fallback using standard speech synthesis if API keys are fallback
      const synth = window.speechSynthesis;
      if (synth) {
        synth.cancel();
        let langCode = 'en-IN';
        if (language === 'hi') langCode = 'hi-IN';
        if (language === 'te') langCode = 'te-IN';

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = langCode;
        utterance.rate = 1.0;
        utterance.pitch = 0.9; // Deep commanding male cadet pitch
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        synth.speak(utterance);
      } else {
        setTimeout(() => setIsSpeaking(false), 2000);
      }
    } catch (e) {
      console.warn("Speech synthesis blocked or errored:", e);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  const playFallbackBeeps = (ctx: AudioContext, text: string) => {
    const wordCount = text.split(" ").length;
    let time = ctx.currentTime;
    for (let i = 0; i < Math.min(wordCount, 12); i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(440 + Math.random() * 80, time);
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.linearRampToValueAtTime(0.001, time + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.12);
      time += 0.14;
    }
    setTimeout(() => setIsSpeaking(false), wordCount * 140);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setLoading(true);
    stopAudio();

    // Render User Message
    const userMessageId = `user-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: userMessageId,
      role: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    try {
      // Direct call to Express backup endpoint
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          systemPrompt: settings.systemPrompt,
          knowledgeContext: settings.knowledgeBase,
          chatHistory: messages.slice(-5), // Keep a small working conversation log
          voiceRequested: voiceMode
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessageId = `ai-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: assistantMessageId,
          role: 'assistant',
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        
        speakText(data.text, data.audio);
      } else {
        throw new Error("API call error status code");
      }
    } catch (err) {
      console.warn("Fell back to client-side logic stream:", err);
      // Clean offline state matcher
      let reply = "Jai Hind Cadet. I registered your notification. Your courses areNDA, CDS, and AFCAT. You will be assigned to Vikrant batch.";
      const query = userText.toLowerCase();

      if (query.includes("admission") || query.includes("join") || query.includes("fees")) {
        reply = "Admission criteria is listed in our Knowledge database. To enroll in NDA, navigate to admission panel or fee center to secure your QR gateway. Training begins from base camp on July 1st.";
      } else if (query.includes("syllabus") || query.includes("math") || query.includes("exam")) {
        reply = "NDA Math contains Trigonometry, Integrals, and Vector Math (300 marks). General GAT (600 marks) tests science and Indian geography. I will load optimal test worksheets for you.";
      } else if (query.includes("physical") || query.includes("run") || query.includes("pullup")) {
        reply = "Cadet physical requirements include completing 1.6km in 6.5 mins, 40 pushups, and clearing the horizontal beam obstacles. Track progress under the Core Workout tab.";
      } else if (query.includes("help") || query.includes("human") || query.includes("contact")) {
        reply = "Understood. Reaching command headquarters... Query transferred to Academy Commandant Col. Hardeep Singh (Retd.). He will revert shortly.";
        setHumanTransferred(true);
      }

      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      speakText(reply);
    } finally {
      setLoading(false);
    }
  };

  const handleMicInput = () => {
    // Quick browser speech input toggle
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser. Please type your command.");
      return;
    }
    try {
      const rec = new SpeechRecognition();
      rec.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      rec.start();
      setIsSpeaking(true);
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsSpeaking(false);
      };
      rec.onerror = () => setIsSpeaking(false);
      rec.onend = () => setIsSpeaking(false);
    } catch (err) {
      setIsSpeaking(false);
    }
  };

  // Preset quick commander buttons
  const promptPrompts = [
    { text: "NDA Syllabus Overview", icon: Award, prompt: "Explain the current NDA exam syllabus and marking scheme." },
    { text: "Physical Fitness Standards", icon: Shield, prompt: "What are the strict physical training standards needed for cadet ranks?" },
    { text: "Admission Eligibility Guide", icon: Sparkles, prompt: "What are the requirements to join Yuva Defence Academy program?" }
  ];

  return (
    <div className="w-full flex flex-col xl:flex-row gap-6 bg-black z-1 text-white p-4 sm:p-6 rounded-xl border border-zinc-800 shadow-2xl">
      
      {/* Visual Live CADET advisor screen */}
      <div className="w-full xl:w-2/5 rounded-xl bg-zinc-950 border border-zinc-900 p-5 flex flex-col justify-between relative overflow-hidden">
        {/* Radar grids */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.06)_0%,rgba(0,0,0,0.9)_90%)] pointer-events-none" />
        <div className="absolute top-2 right-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 text-[10px] font-mono py-0.5 px-2 rounded-full animate-pulse uppercase tracking-wider">
          LIVE AI RADENCE
        </div>

        <div>
          <div className="flex items-center gap-3">
            <div className="relative p-3 bg-yellow-600 rounded-lg flex justify-center items-center">
              <Bot className="h-6 w-6 text-black" />
              <div className="absolute inset-0 border border-yellow-500 rounded-lg animate-ping opacity-25" />
            </div>
            <div>
              <h3 className="font-bold tracking-tight text-yellow-500 font-sans text-lg">MAJOR VIKRAM</h3>
              <p className="text-xs font-mono text-zinc-400">Tactical AI Command Advisor</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 bg-zinc-900/60 rounded-lg border border-zinc-800 backdrop-blur">
              <h4 className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase mb-2">CADET BRIEFING RULES</h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-yellow-500 mt-0.5">✔</span>
                  <span>Supports text + real-time voice synthetic command feedback.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-yellow-500 mt-0.5">✔</span>
                  <span>Fully versed in UPSC, NDA & SSB technical standards.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-yellow-500 mt-0.5">✔</span>
                  <span>Understands English, Telugu and Hindi perfectly.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Animated Speech waves viz */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-zinc-500 uppercase tracking-widest">Voice Synthesis Freq</span>
            <span className="text-yellow-500/80 tracking-widest uppercase animate-pulse">
              {isSpeaking ? 'TRANSMITTING...' : 'IDLE SENSORS'}
            </span>
          </div>
          <div className="h-20 bg-zinc-900 border border-zinc-800/80 rounded-lg flex items-center justify-center relative p-1">
            <canvas ref={canvasRef} className="w-full h-full" width="300" height="80" />
            
            {isSpeaking && (
              <button 
                onClick={stopAudio}
                className="absolute inset-auto px-2 py-1 bg-red-600 hover:bg-red-700 text-[10px] font-mono tracking-widest text-white rounded shadow cursor-pointer uppercase font-bold"
              >
                Interrupt Audio
              </button>
            )}
          </div>
          
          {/* Quick Voice Settings */}
          <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
            <button
              onClick={() => setVoiceMode(!voiceMode)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded border transition ${
                voiceMode 
                  ? 'bg-yellow-500 text-black border-yellow-400 font-bold' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              {voiceMode ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span>SPEECH SYNTH: {voiceMode ? 'ACTIVE' : 'MUTED'}</span>
            </button>

            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-zinc-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 py-1 px-2 rounded outline-none focus:border-yellow-500"
              >
                <option value="en">English (IN)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>
          </div>
        </div>

        {humanTransferred && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs rounded-lg flex items-start gap-2 animate-bounce">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block">COMMAND ESCALATION ACTIVE</strong>
              <span>Complex queries routed securely. Commandant Col. Hardeep has been paged to respond.</span>
            </div>
          </div>
        )}

      </div>

      {/* Main chat stream logs */}
      <div className="flex-1 flex flex-col bg-zinc-950/80 border border-zinc-900 rounded-xl h-[520px] overflow-hidden">
        
        {/* Terminal Header */}
        <div className="bg-zinc-900/90 border-b border-zinc-800/80 py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-xs text-zinc-400 tracking-wider">COMMANDER_VIKRAM_V3.5.LOG</span>
          </div>
          <span className="text-[10px] font-mono text-yellow-500/70 uppercase">Cadet Interface Mode</span>
        </div>

        {/* Chat Logs Window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div className={`p-1.5 rounded h-8 w-8 flex justify-center items-center shrink-0 ${
                msg.role === 'user' ? 'bg-yellow-500 text-black' : 'bg-zinc-900 border border-yellow-500/25 text-yellow-500'
              }`}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={`p-4 rounded-lg text-sm leading-relaxed relative ${
                msg.role === 'user' 
                  ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-50 hover:bg-yellow-500/15 transition' 
                  : 'bg-zinc-900/60 border border-zinc-800 text-zinc-100 hover:bg-zinc-900/85 transition'
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className="block mt-2 text-[9px] font-mono text-zinc-500 text-right">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 max-w-[80%]">
              <div className="p-1.5 bg-zinc-950 border border-zinc-800 rounded h-8 w-8 flex justify-center items-center shrink-0">
                <Bot className="h-4 w-4 text-yellow-500 animate-spin" />
              </div>
              <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg text-sm text-zinc-500 flex items-center gap-2">
                <span>Deciphering defense protocol...</span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/50 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/50 animate-bounce delay-100" />
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/50 animate-bounce delay-200" />
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Commander Buttons */}
        <div className="p-2 bg-zinc-900/20 border-t border-zinc-900/70 flex overflow-x-auto gap-2 scrollbar-none">
          {promptPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(p.prompt);
              }}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/30 text-xs text-zinc-300 rounded shrink-0 transition flex items-center gap-1.5"
            >
              <p.icon className="h-3 w-3 text-yellow-500" />
              <span>{p.text}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="bg-zinc-900 border-t border-zinc-800 p-3 flex gap-2">
          <button
            type="button"
            onClick={handleMicInput}
            className="p-3 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-yellow-500/80 rounded transition hover:text-yellow-400 flex justify-center items-center cursor-pointer"
            title="Speak Naturally"
          >
            <Mic className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Instruct AI Admiral..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-500 placeholder-zinc-600 font-sans"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold text-sm tracking-wider rounded transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <span>SEND</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
