import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, 
  Award, 
  HelpCircle, 
  RefreshCw, 
  Users, 
  PhoneCall, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  TrendingUp
} from "lucide-react";

import { Question, JokerState, GameState } from "./types";
import { QUESTIONS_POOL } from "./questions";
import { soundManager } from "./components/SoundManager";
import { AuditoriyaChart } from "./components/AuditoriyaChart";
import { Confetti } from "./components/Confetti";

// Constant monetary value levels matching "Who Wants to Be a Millionaire" style
const LEVEL_VALUES = [
  0,        // Level 0 (Initial)
  100000,   // Level 1
  200000,   // Level 2
  500000,   // Level 3
  1000000,  // Level 4
  2000000,  // Level 5 (Guaranteed)
  3000000,  // Level 6
  5000000,  // Level 7
  7000000,  // Level 8
  10000000, // Level 9
  15000000, // Level 10 (Guaranteed)
  20000000, // Level 11
  25000000, // Level 12
  30000000, // Level 13
  35000000, // Level 14
  40000000, // Level 15 (Final Prize!)
];

// Reversed list for display in the ladder
const DISPLAY_LADDER = [...LEVEL_VALUES].map((amount, idx) => ({
  level: idx,
  amount,
  guaranteed: idx === 5 || idx === 10 || idx === 15
})).filter(l => l.level > 0).reverse();

export default function App() {
  // Navigation Screens: "intro" | "rules" | "playing" | "summary"
  const [screen, setScreen] = useState<"intro" | "rules" | "playing" | "summary">("intro");
  
  // Game Play States
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [isLocking, setIsLocking] = useState<boolean>(false);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showLadderMobile, setShowLadderMobile] = useState<boolean>(false);

  // Joker States
  const [jokers, setJokers] = useState<JokerState>({
    fiftyFifty: true,
    friendCall: true,
    audiencePoll: true
  });
  const [eliminatedOptions, setEliminatedOptions] = useState<("A" | "B" | "C" | "D")[]>([]);
  const [friendAdvice, setFriendAdvice] = useState<string | null>(null);
  const [audienceVotes, setAudienceVotes] = useState<{ A: number; B: number; C: number; D: number } | null>(null);

  // Exit & Results States
  const [gameResult, setGameResult] = useState<{
    status: "win" | "fail" | "walked_away";
    wonAmount: number;
    failedAtLevel?: number;
  } | null>(null);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper formatting for money (e.g. 40 000 000 so'm)
  const formatMoney = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
  };

  // Safe exit calculations
  const getGuaranteedAmount = (failedLvl: number): number => {
    if (failedLvl >= 11) {
      return 15000000; // Passed level 10
    } else if (failedLvl >= 6) {
      return 2000000;  // Passed level 5
    }
    return 0;
  };

  // Get a random question for the specific level
  const selectQuestionForLevel = (level: number): Question => {
    const pool = QUESTIONS_POOL.filter(q => q.level === level);
    if (pool.length === 0) return QUESTIONS_POOL[0];
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  };

  // Initialize a new level question
  const loadLevel = (level: number) => {
    const q = selectQuestionForLevel(level);
    setActiveQuestion(q);
    setCurrentLevel(level);
    setSelectedAnswer(null);
    setIsLocking(false);
    setIsAnswerChecked(false);
    setIsCorrect(null);
    setTimeLeft(20);
    setFriendAdvice(null);
    setAudienceVotes(null);
    setEliminatedOptions([]);
  };

  // Start the entire game
  const handleStartGame = () => {
    if (!isMuted) soundManager.playClick();
    loadLevel(1);
    setJokers({
      fiftyFifty: true,
      friendCall: true,
      audiencePoll: true
    });
    setGameResult(null);
    setScreen("playing");
  };

  // Stop/Pause current timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Handles countdown logic
  useEffect(() => {
    if (screen !== "playing" || isLocking || isAnswerChecked) {
      stopTimer();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          handleTimeOut();
          return 0;
        }
        // Play tick sound to build intense TV show atmosphere
        if (!isMuted) {
          soundManager.playTick(prev <= 6 ? 0.12 : 0.05);
        }
        return prev - 1;
      });
    }, 1000);

    return () => stopTimer();
  }, [screen, isLocking, isAnswerChecked, isMuted, currentLevel]);

  // Handles Time Out (Auto Reward based on milestones)
  const handleTimeOut = () => {
    if (!isMuted) soundManager.playWrong();
    setIsAnswerChecked(true);
    setIsCorrect(false);
    
    const money = getGuaranteedAmount(currentLevel);
    setGameResult({
      status: "fail",
      wonAmount: money,
      failedAtLevel: currentLevel
    });
    
    setTimeout(() => {
      setScreen("summary");
    }, 2500);
  };

  // User submits an answer
  const handleAnswerSelect = (option: "A" | "B" | "C" | "D") => {
    if (isLocking || isAnswerChecked) return;
    
    if (!isMuted) soundManager.playClick();
    setSelectedAnswer(option);
    setIsLocking(true); // Locks other buttons, pauses timer

    // Suspense delay of 1.5 seconds like in real game show
    setTimeout(() => {
      if (!activeQuestion) return;
      const correct = activeQuestion.correctAnswer === option;
      setIsAnswerChecked(true);
      setIsCorrect(correct);
      setIsLocking(false);

      if (correct) {
        if (!isMuted) soundManager.playCorrect();
        
        // If they successfully solved the 15th question, they win!
        if (currentLevel === 15) {
          if (!isMuted) soundManager.playVictory();
          setGameResult({
            status: "win",
            wonAmount: LEVEL_VALUES[15]
          });
          setTimeout(() => {
            setScreen("summary");
          }, 3000);
        }
      } else {
        if (!isMuted) soundManager.playWrong();
        const money = getGuaranteedAmount(currentLevel);
        setGameResult({
          status: "fail",
          wonAmount: money,
          failedAtLevel: currentLevel
        });
        setTimeout(() => {
          setScreen("summary");
        }, 3000);
      }
    }, 1500);
  };

  // Handles proceeding to next level after a correct answer
  const handleNextLevel = () => {
    if (!isMuted) soundManager.playClick();
    if (currentLevel < 15) {
      loadLevel(currentLevel + 1);
    }
  };

  // Walk Away (Take the money)
  const handleWalkAway = () => {
    if (isLocking || isAnswerChecked) return;
    if (!isMuted) soundManager.playClick();
    
    // The money earned so far is for the previously completed level
    const money = LEVEL_VALUES[currentLevel - 1];
    setGameResult({
      status: "walked_away",
      wonAmount: money
    });
    setScreen("summary");
  };

  // JOKER: 50/50 (removes two incorrect options)
  const useFiftyFifty = () => {
    if (!jokers.fiftyFifty || !activeQuestion || isLocking || isAnswerChecked) return;
    if (!isMuted) soundManager.playJoker();

    const correct = activeQuestion.correctAnswer;
    const options: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
    const incorrect = options.filter(o => o !== correct);
    
    // Pick two random wrong options to eliminate
    const shuffled = [...incorrect].sort(() => Math.random() - 0.5);
    const toEliminate = shuffled.slice(0, 2);

    setEliminatedOptions(toEliminate);
    setJokers(prev => ({ ...prev, fiftyFifty: false }));
  };

  // JOKER: Phone a Friend (Do'stga qo'ng'iroq)
  const useFriendCall = () => {
    if (!jokers.friendCall || !activeQuestion || isLocking || isAnswerChecked) return;
    if (!isMuted) soundManager.playJoker();

    const correct = activeQuestion.correctAnswer;
    const friends = [
      { name: "Sardor (Frontend Dasturchi)", style: "har doim xotirjam va aniq tushuntiruvchi do'st" },
      { name: "Jasur (Senior Engineer)", style: "klaviatura kombinatsiyalari va Python ustasi" },
      { name: "Malika (Grafik Dizayner)", style: "Canva interfeysi va andozalari bo'yicha mutaxassis" }
    ];
    
    const friend = friends[Math.floor(Math.random() * friends.length)];
    const correctnessText = activeQuestion.explanation.toLowerCase();
    
    // Friend confidence varies by level
    let advice = "";
    if (currentLevel <= 5) {
      advice = `"${friend.name} (${friend.style}): Salom do'stim! Bu savol juda oson. To'g'ri javob mutlaqo **${correct}** varianti. Chunki ${correctnessText}. Hech ikkilanmasdan belgilashing mumkin!"`;
    } else if (currentLevel <= 10) {
      advice = `"${friend.name} (${friend.style}): Salom! Shoshma, fikrlab olay... Ha, deyarli 90% ishonch bilan ayta olamanki, bu **${correct}** javobi. Men aynan shu mavzuni yaqinda o'rgangan edim. ${correctnessText}."`;
    } else {
      advice = `"${friend.name} (${friend.style}): Salom! Oh, bu haqiqatan ham diqqat talab qiladigan savol ekan. Menimcha, javob **${correct}** bo'lishi kerak. Chunki ${correctnessText}. Omad yor bo'lsin!"`;
    }

    setFriendAdvice(advice);
    setJokers(prev => ({ ...prev, friendCall: false }));
  };

  // JOKER: Audience Poll (Auditoriya so'rovi)
  const useAudiencePoll = () => {
    if (!jokers.audiencePoll || !activeQuestion || isLocking || isAnswerChecked) return;
    if (!isMuted) soundManager.playJoker();

    const correct = activeQuestion.correctAnswer;
    
    // Allocate votes: higher weight to correct answer
    let correctWeight = 70; // Easy
    if (currentLevel > 5 && currentLevel <= 10) correctWeight = 55; // Medium
    if (currentLevel > 10) correctWeight = 42; // Hard

    const randCorrect = Math.floor(correctWeight + Math.random() * 10);
    const remainder = 100 - randCorrect;
    
    // Distribute remainder randomly among 3 options
    const r1 = Math.floor(Math.random() * (remainder - 5));
    const r2 = Math.floor(Math.random() * (remainder - r1 - 2));
    const r3 = remainder - r1 - r2;

    const incorrectVotes = [r1, r2, r3];
    const votes: Record<string, number> = {};
    
    let wrongIndex = 0;
    ["A", "B", "C", "D"].forEach(opt => {
      if (opt === correct) {
        votes[opt] = randCorrect;
      } else {
        votes[opt] = incorrectVotes[wrongIndex++];
      }
    });

    setAudienceVotes(votes as { A: number; B: number; C: number; D: number });
    setJokers(prev => ({ ...prev, audiencePoll: false }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Background Starry Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Global Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 py-3 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-md shadow-amber-500/20">
            <TrendingUp className="w-5 h-5 text-slate-950" />
          </div>
          <span className="font-sans font-extrabold text-sm md:text-base tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
            BILIM JANGI — 40M
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            id="toggle-mute-btn"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-slate-800/60 hover:bg-slate-800 rounded-full text-slate-300 hover:text-amber-400 transition"
            title="Ovozni o'chirish/yoqish"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          {screen === "playing" && (
            <button
              id="mobile-ladder-toggle-btn"
              onClick={() => setShowLadderMobile(!showLadderMobile)}
              className="md:hidden px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-md border border-slate-700 text-amber-400 flex items-center gap-1"
            >
              <span>Zinapoya</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${showLadderMobile ? "rotate-90" : ""}`} />
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: INTRO */}
          {screen === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto"
            >
              <div className="mb-6 relative">
                {/* Glowing emblem */}
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl scale-125 animate-pulse" />
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400 flex items-center justify-center relative shadow-2xl">
                  <span className="text-4xl md:text-5xl font-black text-amber-400 font-mono tracking-tighter">40M</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
                Bilim Jangi <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 drop-shadow-sm">
                  — 40 Million So'm —
                </span>
              </h1>
              
              <p className="text-slate-300 text-sm md:text-base mb-8 max-w-lg leading-relaxed">
                "Kim boy bo'lishni xohlaydi" shousining klaviatura tezkor tugmalari, Scratch vizual dasturlash tili, Python sintaksisi hamda Canva grafik platformasiga mo'ljallangan maxsus talqini! 
                15 ta qiziqarli savolga to'g'ri javob bering va 40 000 000 so'm virtual yutuq egasiga aylaning.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
                <button
                  id="rules-btn"
                  onClick={() => {
                    if (!isMuted) soundManager.playClick();
                    setScreen("rules");
                  }}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 text-sm font-semibold rounded-xl text-slate-300 hover:text-amber-300 transition-all flex items-center justify-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  Qoidalar va Ma'lumot
                </button>
                
                <button
                  id="start-game-btn"
                  onClick={handleStartGame}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 text-slate-950 text-sm font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-2 group"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  O'yinni Boshlash
                </button>
              </div>

              <div className="mt-12 text-xs text-slate-500 font-mono border-t border-slate-900 pt-4 w-full">
                Virtual o'yin • Haqiqiy pul yutilmaydi va sarflanmaydi
              </div>
            </motion.div>
          )}

          {/* SCREEN 2: RULES */}
          {screen === "rules" && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-center p-6 max-w-xl mx-auto"
            >
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <HelpCircle className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl md:text-2xl font-bold text-amber-300">O'yin Qoidalari</h2>
                </div>

                <div className="space-y-4 text-slate-300 text-xs md:text-sm leading-relaxed mb-8">
                  <p>
                    📚 <strong className="text-slate-100">Viktorina mavzulari:</strong> Savollar 4 ta qiziqarli sohadan (Kompyuter tezkor tugmalari, Scratch bloklari va ob'ektlari, Python boshlang'ich sintaksisi va Canva platformasi interfeysi) aralashtirib beriladi.
                  </p>
                  <p>
                    ⏱️ <strong className="text-slate-100">Vaqt chegarasi:</strong> Har bir savolga javob berish uchun <span className="text-amber-400 font-bold">20 soniya</span> beriladi. Vaqt tugashi ham to'plangan yutuq bilan o'yinni yakunlaydi.
                  </p>
                  <p>
                    🛡️ <strong className="text-slate-100">Kafolatlangan summalar:</strong> 
                    <br/>- 5-savoldan o'tganda: <span className="text-amber-400 font-bold">2 000 000 so'm</span>.
                    <br/>- 10-savoldan o'tganda: <span className="text-amber-400 font-bold">15 000 000 so'm</span>.
                    <br/>Xato javob berilsa, ushbu kafolatlangan summalar sizda saqlanib qolinadi!
                  </p>
                  <p>
                    🃏 <strong className="text-slate-100">Yordamchilar (Jokerlar):</strong> Sizda 3 ta foydali yordamchi bor:
                    <br/>- <strong>50/50:</strong> 2 ta noto'g'ri variant olib tashlanadi.
                    <br/>- <strong>Do'stga qo'ng'iroq:</strong> Tajribali yordamchidan foydali ipuclari va tushuntirish olasiz.
                    <br/>- <strong>Auditoriya so'rovi:</strong> Zaldagi tomoshabinlar bergan ovozlar foizini ko'rasiz.
                  </p>
                  <p>
                    💰 <strong className="text-slate-100">O'yinni yakunlash:</strong> Istalgan vaqtda keyingi savolga o'tmasdan, "Pulni olib o'yinni yakunlash" tugmasi orqali yig'ilgan summani qo'lga kiritishingiz mumkin.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    id="back-to-intro-btn"
                    onClick={() => {
                      if (!isMuted) soundManager.playClick();
                      setScreen("intro");
                    }}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 font-semibold text-sm rounded-xl text-slate-300 transition"
                  >
                    Orqaga
                  </button>
                  <button
                    id="rules-start-game-btn"
                    onClick={handleStartGame}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 font-bold text-sm text-slate-950 rounded-xl transition shadow-lg shadow-amber-500/10"
                  >
                    Tushunarli, Boshlaymiz!
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN 3: PLAYING */}
          {screen === "playing" && activeQuestion && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 grid grid-cols-1 md:grid-cols-12 max-w-7xl w-full mx-auto p-4 md:p-6 gap-6 relative"
            >
              
              {/* LEFT/MAIN GAME ZONE (8 columns on desktop) */}
              <div className="md:col-span-8 flex flex-col justify-between gap-6 min-h-[500px]">
                
                {/* Timer and Joker Controls bar */}
                <div className="flex justify-between items-center gap-4 bg-slate-900/40 p-3 md:p-4 rounded-xl border border-slate-800/80 backdrop-blur-sm">
                  
                  {/* Joker buttons */}
                  <div className="flex items-center gap-2">
                    {/* 50/50 */}
                    <button
                      id="joker-fiftyfifty-btn"
                      onClick={useFiftyFifty}
                      disabled={!jokers.fiftyFifty || isLocking || isAnswerChecked}
                      className={`p-2.5 md:px-4 md:py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                        jokers.fiftyFifty 
                          ? "bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-400/80 hover:text-amber-400" 
                          : "bg-slate-900/20 border-slate-900/60 text-slate-600 cursor-not-allowed"
                      }`}
                      title="50/50 yordamchisi"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-bold hidden md:inline">50 / 50</span>
                    </button>

                    {/* Friend Call */}
                    <button
                      id="joker-friend-btn"
                      onClick={useFriendCall}
                      disabled={!jokers.friendCall || isLocking || isAnswerChecked}
                      className={`p-2.5 md:px-4 md:py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                        jokers.friendCall 
                          ? "bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-400/80 hover:text-amber-400" 
                          : "bg-slate-900/20 border-slate-900/60 text-slate-600 cursor-not-allowed"
                      }`}
                      title="Do'stga qo'ng'iroq"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span className="text-xs font-bold hidden md:inline">Do'st</span>
                    </button>

                    {/* Audience Poll */}
                    <button
                      id="joker-audience-btn"
                      onClick={useAudiencePoll}
                      disabled={!jokers.audiencePoll || isLocking || isAnswerChecked}
                      className={`p-2.5 md:px-4 md:py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                        jokers.audiencePoll 
                          ? "bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-400/80 hover:text-amber-400" 
                          : "bg-slate-900/20 border-slate-900/60 text-slate-600 cursor-not-allowed"
                      }`}
                      title="Auditoriya so'rovi"
                    >
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-bold hidden md:inline">Zal</span>
                    </button>
                  </div>

                  {/* Circular Timer Display */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        {/* Underlay */}
                        <circle 
                          cx="24" 
                          cy="24" 
                          r="20" 
                          className="stroke-slate-800 fill-none" 
                          strokeWidth="3.5"
                        />
                        {/* Interactive dynamic ring */}
                        <motion.circle 
                          cx="24" 
                          cy="24" 
                          r="20" 
                          className={`fill-none transition-colors duration-300 ${
                            timeLeft <= 5 
                              ? "stroke-rose-500 animate-pulse" 
                              : timeLeft <= 10 
                                ? "stroke-amber-400" 
                                : "stroke-emerald-400"
                          }`}
                          strokeWidth="3.5"
                          strokeDasharray={2 * Math.PI * 20}
                          animate={{
                            strokeDashoffset: (2 * Math.PI * 20) * (1 - timeLeft / 20)
                          }}
                          transition={{ duration: 0.5, ease: "linear" }}
                        />
                      </svg>
                      {/* Timer center seconds text */}
                      <span className={`absolute text-sm font-mono font-bold ${
                        timeLeft <= 5 
                          ? "text-rose-500 animate-ping" 
                          : timeLeft <= 10 
                            ? "text-amber-400" 
                            : "text-slate-200"
                      }`}>
                        {timeLeft}
                      </span>
                    </div>

                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Qolgan Vaqt</span>
                      <span className="text-xs font-semibold text-slate-200">20 soniya</span>
                    </div>
                  </div>
                </div>

                {/* Joker overlays (Audience votes chart / Friend dialogue block) */}
                <div className="relative">
                  {/* Friend Call response */}
                  {friendAdvice && (
                    <motion.div
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-indigo-950/70 border border-indigo-500/30 rounded-xl p-4 text-xs md:text-sm text-indigo-200 backdrop-blur-md relative mb-4"
                    >
                      <button 
                        onClick={() => setFriendAdvice(null)} 
                        className="absolute top-2 right-2 text-indigo-400 hover:text-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <p className="font-semibold text-indigo-300 mb-1">📞 Telefon aloqasi o'rnatildi:</p>
                      <p className="italic leading-relaxed">{friendAdvice}</p>
                    </motion.div>
                  )}

                  {/* Audience poll charts */}
                  {audienceVotes && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-4"
                    >
                      <AuditoriyaChart votes={audienceVotes} correctAnswer={activeQuestion.correctAnswer} />
                    </motion.div>
                  )}
                </div>

                {/* ACTIVE QUESTION BOARD */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden shadow-xl min-h-[160px] flex flex-col justify-between">
                    
                    {/* Level and Category Tag label */}
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                          Savol {currentLevel} / 15
                        </span>
                        <span className={`text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full border ${
                          activeQuestion.category === "PYTHON" 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                            : activeQuestion.category === "SCRATCH"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : activeQuestion.category === "CANVA"
                                ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                                : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                        }`}>
                          {activeQuestion.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded-md">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Yutuq: {formatMoney(LEVEL_VALUES[currentLevel])}</span>
                      </div>
                    </div>

                    {/* Question Statement */}
                    <h3 className="text-base md:text-xl font-medium text-slate-100 leading-relaxed font-sans mb-4">
                      {activeQuestion.question}
                    </h3>

                    {/* Visual separation */}
                    <div className="w-16 h-1 bg-amber-500/20 rounded-full" />
                  </div>
                </div>

                {/* 4 MULTIPLE CHOICE ANSWERS (Grid system) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                  {(["A", "B", "C", "D"] as ("A" | "B" | "C" | "D")[]).map((option) => {
                    const optionText = activeQuestion.options[option];
                    const isEliminated = eliminatedOptions.includes(option);
                    const isSelected = selectedAnswer === option;
                    
                    // Style determinators
                    let btnClass = "border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-amber-500/50 text-slate-200";
                    let prefixClass = "bg-slate-800 text-amber-400 border-slate-700";

                    if (isEliminated) {
                      return <div key={option} className="h-[52px] md:h-[60px] opacity-0 pointer-events-none" />; // invisible placeholder to keep grid layout intact
                    }

                    if (isSelected) {
                      if (!isAnswerChecked) {
                        // Flashing suspense state before checking
                        btnClass = "border-amber-400 bg-amber-500/10 text-amber-300 ring-2 ring-amber-500/30";
                        prefixClass = "bg-amber-400 text-slate-950 border-amber-300";
                      } else {
                        // Revealed checked state
                        if (isCorrect) {
                          btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400 ring-2 ring-emerald-500/30";
                          prefixClass = "bg-emerald-500 text-slate-950 border-emerald-400";
                        } else {
                          btnClass = "border-rose-500 bg-rose-500/10 text-rose-400 ring-2 ring-rose-500/30 animate-shake";
                          prefixClass = "bg-rose-500 text-slate-950 border-rose-400";
                        }
                      }
                    } else if (isAnswerChecked && option === activeQuestion.correctAnswer) {
                      // Correct answer revealed if user answered wrong
                      btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20";
                      prefixClass = "bg-emerald-500 text-slate-950 border-emerald-400";
                    }

                    return (
                      <button
                        key={option}
                        id={`option-${option}-btn`}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={isLocking || isAnswerChecked}
                        className={`group p-3 md:p-4 rounded-xl border text-left text-xs md:text-sm font-semibold transition-all duration-300 flex items-center gap-3 relative overflow-hidden h-[52px] md:h-[60px] cursor-pointer ${btnClass}`}
                      >
                        {/* Option prefix e.g. "A" */}
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center border shrink-0 transition-colors ${prefixClass}`}>
                           {option}
                        </span>

                        {/* Option content text */}
                        <span className="truncate pr-4">{optionText}</span>
                        
                        {/* Small decorative glow overlay on active option */}
                        {isSelected && (
                          <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${
                            !isAnswerChecked 
                              ? "bg-amber-400" 
                              : isCorrect 
                                ? "bg-emerald-500" 
                                : "bg-rose-500"
                          }`} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* BOTTOM EXPLANATION & WALK AWAY BUTTONS */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/60 pt-4 mt-2">
                  
                  {/* Explanation panel if checked */}
                  <div className="flex-1 w-full min-h-[40px]">
                    <AnimatePresence>
                      {isAnswerChecked && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 text-[11px] md:text-xs text-slate-300"
                        >
                          <span className={`font-bold uppercase ${isCorrect ? "text-emerald-400" : "text-amber-400"} mr-2`}>
                            {isCorrect ? "✓ To'g'ri javob!" : "✓ To'g'ri javob ko'rsatildi!"}
                          </span>
                          <span>{activeQuestion.explanation}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Control options (Walk away or Next level) */}
                  <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <button
                      id="walk-away-btn"
                      onClick={handleWalkAway}
                      disabled={isLocking || isAnswerChecked || currentLevel === 1}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        isLocking || isAnswerChecked || currentLevel === 1
                          ? "bg-slate-900/10 border-slate-900/60 text-slate-600 cursor-not-allowed"
                          : "bg-slate-900/40 border-amber-500/20 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/40"
                      }`}
                    >
                      Pulni olib chiqish
                    </button>

                    {isAnswerChecked && isCorrect && currentLevel < 15 && (
                      <button
                        id="next-level-btn"
                        onClick={handleNextLevel}
                        className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/10 flex items-center gap-1 animate-pulse"
                      >
                        <span>Keyingi Savol</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>

              </div>

              {/* RIGHT SIDEBAR: MONEY LADDER */}
              <div className={`md:col-span-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm flex flex-col justify-between ${
                showLadderMobile 
                  ? "fixed inset-x-4 bottom-20 top-20 z-50 bg-slate-950 border-amber-500/30 shadow-2xl block md:block" 
                  : "hidden md:flex"
              }`}>
                
                {/* Mobile Ladder Header */}
                <div className="flex md:hidden justify-between items-center mb-4 pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">Yutuqlar Zinapoyasi</span>
                  <button 
                    onClick={() => setShowLadderMobile(false)} 
                    className="p-1 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Ladder Items list */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 py-1 max-h-[460px] md:max-h-none">
                  {DISPLAY_LADDER.map((item) => {
                    const isActive = currentLevel === item.level;
                    const isPassed = currentLevel > item.level;
                    
                    // Style classes
                    let itemBg = "bg-transparent text-slate-400 hover:bg-slate-900/20";
                    let labelColor = "text-slate-500";
                    let valueColor = "text-slate-300 font-medium";

                    if (isActive) {
                      itemBg = "bg-gradient-to-r from-amber-500/20 to-indigo-500/10 border border-amber-500/50 text-amber-200 ring-1 ring-amber-500/20 shadow-md";
                      labelColor = "text-amber-400 font-bold";
                      valueColor = "text-amber-300 font-extrabold";
                    } else if (isPassed) {
                      itemBg = "bg-slate-900/30 text-emerald-400/80 line-through decoration-emerald-500/20";
                      labelColor = "text-emerald-500/50";
                      valueColor = "text-emerald-400/60";
                    } else if (item.guaranteed) {
                      itemBg = "bg-indigo-950/20 text-indigo-300/90 hover:bg-indigo-950/30 border border-indigo-500/10";
                      labelColor = "text-indigo-400/80 font-semibold";
                      valueColor = "text-indigo-300 font-semibold";
                    }

                    return (
                      <div
                        key={item.level}
                        className={`flex items-center justify-between px-3.5 py-1.5 md:py-2 rounded-xl text-xs transition-all ${itemBg}`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Round point badge or tick marker */}
                          <div className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border transition-all ${
                            isActive
                              ? "bg-amber-400 border-amber-300 text-slate-950"
                              : isPassed
                                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                : item.guaranteed
                                  ? "bg-indigo-900/40 border-indigo-500 text-indigo-300"
                                  : "bg-slate-950 border-slate-800 text-slate-500"
                          }`}>
                            {item.level}
                          </div>
                          
                          <span className={`font-mono text-[11px] uppercase tracking-wider ${labelColor}`}>
                            {item.guaranteed ? "KAFOLATLANGAN" : `Bosqich ${item.level}`}
                          </span>
                        </div>

                        <span className={`font-mono text-xs ${valueColor}`}>
                          {formatMoney(item.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Balance display at footer */}
                <div className="border-t border-slate-800/80 pt-4 mt-4">
                  <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Hozirgi Kafolatlangan Summa</span>
                      <span className="text-sm font-bold text-amber-400 font-mono">
                        {formatMoney(getGuaranteedAmount(currentLevel))}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Erishilgan Yutuq</span>
                      <span className="text-sm font-bold text-slate-200 font-mono">
                        {formatMoney(LEVEL_VALUES[currentLevel - 1])}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* SCREEN 4: SUMMARY & GAME OVER / GRAND VICTORY */}
          {screen === "summary" && gameResult && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto relative min-h-[500px]"
            >
              {/* Confetti element to celebrate their win! */}
              <Confetti />

              <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-8 backdrop-blur-md relative overflow-hidden shadow-2xl w-full flex flex-col items-center">
                
                {/* Celebratory Icon display */}
                <div className="mb-6">
                  {gameResult.status === "win" ? (
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                      className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 text-5xl shadow-lg shadow-amber-500/30"
                    >
                      🏆
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-400/60 flex items-center justify-center text-amber-400 text-4xl shadow-lg shadow-amber-500/20"
                    >
                      🎉
                    </motion.div>
                  )}
                </div>

                {/* Always Celebratory & Positive Heading */}
                <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 tracking-tight mb-2 font-sans uppercase">
                  Ajoyib Ishtirok!
                </h2>

                <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed max-w-sm">
                  {gameResult.status === "win"
                    ? "Siz barcha 15 ta savolga mukammal javob berib, mutloq g'oliblik marrasini zabt etdingiz!"
                    : gameResult.status === "walked_away"
                      ? "Siz o'yinni o'z vaqtida yakunlab, to'plangan yutuqni muvaffaqiyatli qo'lga kiritdingiz!"
                      : `Siz ${gameResult.failedAtLevel}-savolgacha muvaffaqiyatli yetib keldingiz va kafolatlangan marradagi yutuq egasiga aylandingiz!`}
                </p>

                {/* Prize Amount Display */}
                <div className="w-full bg-slate-950/80 rounded-2xl p-6 border border-slate-800 mb-8 relative shadow-inner">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">
                    Siz yutib olgan jami summa:
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 font-mono tracking-tighter animate-pulse">
                    {formatMoney(gameResult.wonAmount)}
                  </div>
                </div>

                {/* Final advice or commentary */}
                <p className="text-xs text-slate-400 italic mb-8 max-w-sm">
                  {gameResult.status === "win"
                    ? "Siz haqiqiy master-klass ko'rsatdingiz! Bilimlaringiz 40 000 000 so'm virtual mukofotga to'liq loyiqdir!"
                    : gameResult.wonAmount > 10000000
                      ? "Siz ajoyib natija qayd etdingiz va bilimdonligingizni to'liq namoyon qila oldingiz."
                      : "Sizda juda yaxshi salohiyat bor! Qayta o'ynash orqali bilimingizni yanada sinab ko'rishingiz mumkin."}
                </p>

                {/* Restart Buttons */}
                <div className="flex gap-2 w-full">
                  <button
                    id="restart-to-menu-btn"
                    onClick={() => {
                      if (!isMuted) soundManager.playClick();
                      setScreen("intro");
                    }}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm rounded-xl transition"
                  >
                    Bosh Sahifa
                  </button>
                  <button
                    id="play-again-btn"
                    onClick={handleStartGame}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-amber-500/15 flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Qayta O'ynash
                  </button>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Global Footer Credits */}
      <footer className="py-4 text-center text-[11px] text-slate-600 border-t border-slate-900 bg-slate-950 relative z-10 font-mono">
        <div>Bilim Jangi — 40 Million © 2026 • Barcha huquqlar himoyalangan</div>
        <div className="text-slate-700 mt-1">Interaktiv O'zbekcha Viktorina Platformasi</div>
      </footer>

    </div>
  );
}
