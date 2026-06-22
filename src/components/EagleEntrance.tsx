import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, ChevronRight, Volume2, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EagleEntranceProps {
  onDismiss: () => void;
  quote: { text: string; author: string };
}

export default function EagleEntrance({ onDismiss, quote }: EagleEntranceProps) {
  const [eagleStage, setEagleStage] = useState(0); // 0: sky, 1: swooping, 2: landing, 3: full presentation
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play a military horn / cinematic swell using Web Audio API to bypass asset dependency
  const playCinematicSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      
      // Deep bass drum impact
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(65, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.8);
      gain1.gain.setValueAtTime(0.8, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 1.2);

      // Heroic synth swell (perfect fourth chord for military tone)
      const frequencies = [130, 195, 260, 390];
      frequencies.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(f * 1.01, ctx.currentTime + 2.0);
        
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
        
        // low-pass filter to sound premium
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.6);
      });
    } catch (e) {
      console.warn("Web Audio swell blocked by browser gesture rules.");
    }
  };

  useEffect(() => {
    // Stage transition markers for the Eagle swooping
    const timer1 = setTimeout(() => {
      setEagleStage(1);
      playCinematicSound();
    }, 1000);
    const timer2 = setTimeout(() => setEagleStage(2), 2200);
    const timer3 = setTimeout(() => setEagleStage(3), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-between overflow-hidden select-none font-sans text-white">
      {/* Cinematic Military Scanlines & Dark Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,26,59,0.45)_0%,rgba(0,0,0,1)_85%)] z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.45)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,6px_100%] z-1 opacity-40 pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Top Banner controls */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-yellow-500 animate-pulse" />
          <span className="text-xs tracking-widest font-mono text-zinc-400">MISSION CONTROL STATUS: ONLINE</span>
        </div>
        <button
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            playCinematicSound();
          }}
          className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-xs tracking-wider rounded text-yellow-500/80 hover:text-yellow-400 hover:bg-zinc-800 transition"
        >
          <Volume2 className="h-4 w-4" />
          <span>SOUND: {soundEnabled ? 'ACTIVE' : 'MUTED'}</span>
        </button>
      </header>

      {/* Main Eagle Canvas Stage */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 max-w-4xl mx-auto text-center">
        
        {/* Animated Flying Eagle SVG Container */}
        <div className="relative h-56 w-full flex justify-center items-center">
          <AnimatePresence>
            {eagleStage < 3 && (
              <motion.div
                key="swooping-eagle"
                initial={{ scale: 0.1, y: -250, rotate: -15, opacity: 0 }}
                animate={
                  eagleStage === 1
                    ? { scale: 1.8, y: 30, rotate: 0, opacity: 1, filter: 'brightness(1.4)' }
                    : eagleStage === 2
                    ? { scale: 0.9, y: 0, rotate: 0, opacity: 0.9, filter: 'drop-shadow(0 0 15px rgba(234,179,8,0.3))' }
                    : { scale: 0.1, y: -250, opacity: 0 }
                }
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 45, damping: 10 }}
                className="absolute"
              >
                {/* 3D vector styled Eagle with majestic glowing flight geometry */}
                <svg
                  width="220"
                  height="160"
                  viewBox="0 0 220 160"
                  fill="none"
                  className="text-yellow-500 drop-shadow-[0_0_25px_rgba(234,179,8,0.7)]"
                >
                  <polygon points="110,135 110,60 170,10 190,40" fill="url(#goldGradient1)" />
                  <polygon points="110,135 110,60 50,10 30,40" fill="url(#goldGradient2)" />
                  <polygon points="110,50 110,145 130,135 110,50" fill="#CA8A04" />
                  <polygon points="110,50 110,145 90,135 110,50" fill="#A16207" />
                  {/* Tail and wings accents */}
                  <path d="M 110 50 L 150 15 L 210 5 L 140 60 Z" fill="url(#goldGradient1)" className="animate-pulse" />
                  <path d="M 110 50 L 70 15 L 10 5 L 80 60 Z" fill="url(#goldGradient2)" className="animate-pulse" />
                  <defs>
                    <linearGradient id="goldGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FEF08A" />
                      <stop offset="50%" stopColor="#EAB308" />
                      <stop offset="100%" stopColor="#854D0E" />
                    </linearGradient>
                    <linearGradient id="goldGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FEF08A" />
                      <stop offset="50%" stopColor="#EAB308" />
                      <stop offset="100%" stopColor="#854D0E" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Golden Eagle Badge standing victorious at center of portal */}
          {eagleStage === 3 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex flex-col items-center"
            >
              <div className="relative p-6 rounded-full bg-zinc-950/90 border border-yellow-500/40 shadow-[0_0_50px_rgba(234,179,8,0.15)] flex justify-center items-center">
                <Flame className="h-14 w-14 text-yellow-500 animate-bounce" />
                <div className="absolute inset-0 rounded-full border border-yellow-500/10 animate-ping" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Title Group - 3D Military Accent typography */}
        <div className="mt-2 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={eagleStage >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight select-none uppercase"
            style={{
              background: 'linear-gradient(to bottom, #FFFFFF 30%, #D4AF37 55%, #854D0E 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.8)) drop-shadow(0 0 10px rgba(133,77,14,0.3))'
            }}
          >
            YUVA DEFENSE ACADEMY
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={eagleStage >= 2 ? { opacity: 0.82 } : {}}
            transition={{ delay: 0.4 }}
            className="text-xs sm:text-sm font-mono tracking-[0.25em] text-zinc-300 font-semibold"
          >
            ★ INDIAS PREMIER COMMAND CADET EDUCATION BOARD ★
          </motion.p>
        </div>

        {/* Daily Motivation quote panel with glowing gold border */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={eagleStage === 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mt-8 relative max-w-2xl mx-auto p-5 rounded-lg bg-zinc-900/70 border border-yellow-500/30 backdrop-blur-md shadow-2xl"
        >
          <div className="absolute -top-3 left-6 px-3 py-0.5 bg-yellow-500 text-[10px] font-mono tracking-widest uppercase font-bold text-black rounded">
            MOTIVATION BRIEFING
          </div>
          <p className="text-sm sm:text-base italic font-serif text-yellow-100/90 leading-relaxed">
            "{quote.text}"
          </p>
          <p className="mt-2 text-xs font-mono tracking-widest text-zinc-400 uppercase text-right font-semibold">
            — {quote.author}
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={eagleStage === 3 ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <button
            onClick={() => {
              playCinematicSound();
              setTimeout(onDismiss, 200);
            }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 border border-yellow-400 text-black font-semibold text-sm tracking-[0.15em] uppercase rounded shadow-[0_0_30px_rgba(234,179,8,0.4)] cursor-pointer hover:shadow-[0_0_45px_rgba(234,179,8,0.7)] transition duration-300 ease-out active:scale-95"
          >
            <span>ACCESS ACADEMY COMMAND PORTAL</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            <div className="absolute inset-0 rounded bg-white opacity-0 group-hover:opacity-10 transition pointer-events-none" />
          </button>
        </motion.div>

      </main>

      {/* Bottom Legal / Military Standard labels */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500 gap-2 pointer-events-none">
        <span>SECURITY ENCRYPTED: SHA-256</span>
        <span>JAI HIND — RECRUITMENT CAMPAIGN 2026</span>
        <span>SECTOR: DELTA COMMAND</span>
      </footer>
    </div>
  );
}
