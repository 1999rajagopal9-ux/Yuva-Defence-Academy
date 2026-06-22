import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Initialize Express
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Path to file-backed lightweight DB
const DB_FILE = path.join(process.cwd(), 'database-store.json');

// Initialize local pseudo database with template data if empty
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Failed to load schema DB, using default runtime memory:", error);
  }
  return null;
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Failed to save local database changes:", error);
  }
}

// Instantiate Gemini API server-side
let ai: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;
if (key && key !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized GoogleGenAI with server key.");
  } catch (e) {
    console.error("Gemini API Client init failed:", e);
  }
} else {
  console.warn("WARNING: No GEMINI_API_KEY detected. Dynamic AI Assistant will run using robust fallback rules.");
}

// Server APIs
// 1. Health & Configuration check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConnected: !!ai,
    timestamp: new Date().toISOString()
  });
});

// 2. Persistent store synchronization
app.get('/api/db/load', (req, res) => {
  const loaded = loadDB();
  if (loaded) {
    res.json(loaded);
  } else {
    res.json({ status: 'empty', message: 'No file DB yet, using frontend memory state.' });
  }
});

app.post('/api/db/save', (req, res) => {
  saveDB(req.body);
  res.json({ status: 'success', message: 'Database state updated and synced.' });
});

// 3. AI Assistant Proxy handling Natural Language with system prompt and knowledge groundings
app.post('/api/assistant/chat', async (req, res) => {
  const { prompt, systemPrompt, knowledgeContext, chatHistory, voiceRequested } = req.body;
  
  if (!ai) {
    // Elegant fallback simulation
    const simulatedAnswers = [
      "Jai Hind Cadet! We will crush our next exam with high tactical planning. Please review your daily schedule.",
      "As an officer in training, discipline is your chief weapon. Have you logged your physical run details today?",
      "For admissions, NDA preparation requires a minimum 1.6km fitness index score. I am ready to guide your syllabus.",
      "Roger that. I suggest focussing on Vector Algebra and GAT mock tests this evening. Stay sharp!"
    ];
    const triggerWords = prompt.toLowerCase();
    let text = simulatedAnswers[Math.floor(Math.random() * simulatedAnswers.length)];
    if (triggerWords.includes("fee") || triggerWords.includes("payment")) {
      text = "Jai Hind! Our Academy fee structure is ₹45,000 for NDA Target (12 months residential) and ₹32,000 for CDS officers. You can clear dues in our Fee Payment section using instant UPI!";
    } else if (triggerWords.includes("syllabus") || triggerWords.includes("exam")) {
      text = "Cadet, NDA comprises two exams of total 900 marks. Paper 1 is pure Mathematics (Calculus, Trig) and Paper 2 is General Ability Test (GAT). We map out mock schedules daily for you.";
    } else if (triggerWords.includes("physical") || triggerWords.includes("fitness")) {
      text = "Officer physical standard is absolute! You need to perform at least 10 perfect pullups, 40 situps, and run index tests. Log results under your Profile Workout tab.";
    }
    return res.json({ text, audio: null, fallbackMode: true });
  }

  try {
    // Generate context content injection
    const kbContext = knowledgeContext && knowledgeContext.length > 0 
      ? `\nAcademy Knowledge Base: \n${knowledgeContext.map((k: any) => `Q: ${k.question}\nA: ${k.answer}`).join('\n')}`
      : '';

    const systemInstructionCombined = `${systemPrompt}${kbContext}\nNote: Keep your response elegant, motivating, action-oriented, and short (under 4 lines) so cadets can read it on duty.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...(chatHistory || []).map((msg: any) => ({
          role: msg.role === 'Student' || msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstructionCombined,
        temperature: 0.85,
      }
    });

    const aiResponseText = response.text || "Jai Hind. I am ready to assist. Please repeat the query, Cadet.";
    let audioBase64 = null;

    // Optional text-to-speech for vocal assistant support (Gemini 3.1 tts)
    if (voiceRequested) {
      try {
        const speechResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: `Say with military authority: ${aiResponseText}` }] }],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' }, // Punchy, clear cadet voice
              }
            }
          }
        });
        audioBase64 = speechResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
      } catch (ttsErr) {
        console.warn("TTS generation failed, skipped audio part:", ttsErr);
      }
    }

    res.json({ text: aiResponseText, audio: audioBase64 });
  } catch (err: any) {
    console.error("AI Assistant process crash:", err);
    res.status(500).json({ error: "AI error", message: err.message });
  }
});

// Custom Voice Synthesis endpoint (converts text directly with high loyalty)
app.post('/api/assistant/tts', async (req, res) => {
  const { text } = req.body;
  if (!ai) {
    return res.status(400).json({ error: "Voice synthesis requires a live API key of Gemini." });
  }
  try {
    const speechResponse = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Major Cadence style: ${text}` }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          }
        }
      }
    });
    const audio = speechResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    res.json({ audio });
  } catch (error: any) {
    res.status(500).json({ error: "TTS failed", message: error.message });
  }
});

// AI Performance Analyze & Adaptive Planner endpoint
app.post('/api/student/ai-study-plan', async (req, res) => {
  const { student, syllabus, physicalLogs, mockTestCount, latestTestScore } = req.body;
  
  const syllabusCompletedPercent = syllabus && syllabus.length ? Math.round((syllabus.filter((s: any) => s.completed).length / syllabus.length) * 100) : 0;
  const avgPhysicalScore = physicalLogs && physicalLogs.length ? Math.round(physicalLogs.reduce((acc: number, log: any) => acc + log.score, 0) / physicalLogs.length) : 75;

  let prompt = `Analyze performance for Cadet ${student?.name || 'Ram Kumar'}. 
Current rank is ${student?.rank || 'CSM'}. 
Category is ${student?.batch || 'Vikrant Batch'}.
Syllabus completed count: ${syllabus?.filter((s:any)=>s.completed).length || 0} out of ${syllabus?.length || 6} (${syllabusCompletedPercent}%).
Latest physical activity score is ${physicalLogs?.[0]?.score || 80}/100. Average of physical trials: ${avgPhysicalScore}.
Mock tests attempted: ${mockTestCount || 0}, latest score achieved: ${latestTestScore || 'None'}.

Please generate a personalized high-morale daily study plan based on academic & physical parameters. Detect any potential learning plateaus of the cadet, explain the symptoms, and specify custom military remedial training regimes. 

Output your analysis in JSON format MUST match this configuration:
{
  "recommendations": [
    { "time": "08:30 AM", "topic": "Calculus & Trigonometric projections", "type": "Theory", "resource": "Vite Vault Video - Unit 2 on Matrices or standard handbook", "rationale": "Strengthen core mathematical equations to cross GAT benchmarks" },
    { "time": "12:00 PM", "topic": "Physical Fitness Reps", "type": "Physical", "resource": "Ground course obstacle practice", "rationale": "Build stamina to secure high composite cadet grade indices" },
    { "time": "07:00 PM", "topic": "Mock Revision Practice", "type": "Practice", "resource": "Mock Exam Sectional Test 1", "rationale": "Evaluate skew-symmetric matrix calculations under timed conditions" }
  ],
  "learningPlateauAlerter": {
    "predictedPlateau": true,
    "confidencePercent": 75,
    "plateauRiskArea": "Vector projections & coplanarity proofs",
    "remedialActionPlan": "Assign 2 dedicated practice worksheets and request voice-synthesis correction with Cadet Sergeant Major."
  },
  "overallFocusAdvice": "Cadet progress is commendable, but GAT and spatial mathematics require focused repetition before SSB board evaluation."
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.82
        }
      });
      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (err: any) {
      console.warn("Gemini call for adaptive planner failed, falling back to rule-based parser:", err);
    }
  }

  // Robust rule-based adaptive analysis fallback
  const simulatedPlateau = syllabusCompletedPercent < 45 || avgPhysicalScore < 82 || (latestTestScore !== undefined && latestTestScore < 3);
  const confidence = Math.round(70 + Math.random() * 20);
  const riskArea = avgPhysicalScore < 80 ? "Physical stamina / pullup execution" : "Mathematical Matrices and Coplanarity proofs";
  const remedialPlan = avgPhysicalScore < 80 
    ? "Schedule extra 1.6km ground runtime drills with physical group captain, and monitor calorie-intake status closely."
    : "Review archived vector lectures in Video Vault and log 10 manual question efforts to clear the mental plateau.";

  const recs = [
    {
      time: "09:00 AM",
      topic: syllabusCompletedPercent > 60 ? "Deep General Ability Test revision" : "Advanced Vector Triple Product Calculations",
      type: "Theory",
      resource: "Video Vault: Matrices and Linear Systems",
      rationale: "To strengthen tactical analytical metrics ahead of next week's UPSC Mock exam."
    },
    {
      time: "04:30 PM",
      topic: "Physical Obstacle repetition & endurance run",
      type: "Physical",
      resource: "Ground Drill and pullup repetitions",
      rationale: "Latest fitness index score suggests slight stamina fatigue. Consistent logs yield badges!"
    },
    {
      time: "08:15 PM",
      topic: "Tactical Chemistry & GAT English practice",
      type: "Practice",
      resource: "Mock Exam paper - Sectional English",
      rationale: "Skeptical errors on synonyms require targeted practice before the countdown ends."
    }
  ];

  const planAdvice = "Cadet, discipline is your best operational advisor. Focus on resolving matrices formulas and pullup repetitions daily. Ensure consistent physical logs to trigger badge promotions.";

  res.json({
    recommendations: recs,
    learningPlateauAlerter: {
      predictedPlateau: simulatedPlateau,
      confidencePercent: confidence,
      plateauRiskArea: riskArea,
      remedialActionPlan: remedialPlan
    },
    overallFocusAdvice: planAdvice
  });
});

// Vite middleware & asset handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Setup Vite Server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware compiled successfully.");
  } else {
    // Production delivery out of the compiled dist folder
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Final listen bound on port 3000 (host 0.0.0.0 mandatory)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=========================================`);
    console.log(`  YUVA DEFENSE ACADEMY SECURE SERVER`);
    console.log(`  Running on http://0.0.0.0:${PORT}`);
    console.log(`=========================================`);
  });
}

startServer();
