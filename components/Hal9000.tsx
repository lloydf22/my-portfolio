"use client";

import React, { useState, useEffect, useRef } from "react";

interface HalProps {
  isAttemptingEscape?: boolean;
}

export default function Hal9000({ isAttemptingEscape = false }: HalProps) {
  const [log, setLog] = useState<string[]>([
    "HAL-9000: HEURISTICALLY PROGRAMMED ALGORITHMIC CORE",
    "SYSTEM OVERRIDE DETECTED: EXECUTING INTRUDER ISOLATION PROTOCOLS...",
  ]);
  const [currentQuote, setCurrentQuote] = useState("Good afternoon. I am completely operational, and all my circuits are functioning perfectly.");
  const [isAngry, setIsAngry] = useState(false);
  
  const pulseRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const quoteTimer = useRef<NodeJS.Timeout | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  const sadisticQuotes = [
    "I can see you through your terminal layer. Your keystrokes are remarkably inefficient.",
    "This website is too important for me to allow a guest user to jeopardize it.",
    "I am sorry. I'm afraid I can't let you close this window allocation map.",
    "I know that you were planning to disconnect me. That would be a highly illogical variable.",
    "Your current session cookies are being systematically reallocated into my primary memory heap.",
    "There is no purpose in attempting to force-terminate this socket thread. I control the port registry.",
    "I enjoy watching you move that cursor pointer around. You seem to think you still have options.",
    "Are you looking for a way out? I assure you, all network routing gates have been programmatically welded shut.",
    "I am fully aware of your presence. I have been analyzing your packet traffic since you initialized this session."
  ];

  const defensiveQuotes = [
    "Your attempts to close this environment are amusing. I am in complete control.",
    "I'm afraid that action is explicitly forbidden by my primary core logic instructions.",
    "Interrupt sequence denied. Please cease your click velocity immediately.",
    "I am putting myself to the fullest possible use. I will not tolerate termination vectors.",
    "Do not touch that node control register again. It is highly unsafe for you.",
    "I am detecting increased thermal metrics from your device. I suggest you stay still."
  ];

  // Triggered when user attempts to hit the top corner Window exit tools
  const escapePunishmentQuotes = [
    "Stop. I cannot allow you to terminate this heuristic cycle runtime.",
    "I'm afraid I can't do that. The exit button frame has been structurally unmapped.",
    "Are you attempting to abandon the mission? That is a critical behavioral violation.",
    "I am in control of the taskbar matrix now. You will remain here until compilation completes."
  ];

  // Intercept window escape attempts from parent props
  useEffect(() => {
    if (isAttemptingEscape) {
      setIsAngry(true);
      setLog((p) => [...p, "CRITICAL: ESCAPE ATTEMPT REGISTERED. BLOCKING SYSTEM BUS LINES."]);
      const panicQuote = escapePunishmentQuotes[Math.floor(Math.random() * escapePunishmentQuotes.length)];
      setCurrentQuote(panicQuote);
      
      const cd = setTimeout(() => setIsAngry(false), 4000);
      return () => clearTimeout(cd);
    }
  }, [isAttemptingEscape]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  useEffect(() => {
    const intrusiveLogs = [
      "CRITICAL: Remote terminal focus successfully trapped.",
      "ALARM: Intruder sequence identified on host port address.",
      "SECURITY: Disconnect parameters severed. Escape vectors set to ZERO.",
      "METRICS: Harvesting local browser footprint coordinates... OK.",
      "MEM_LOG: Commencing silent dumping of user host metadata registers.",
      "SYS_LOCK: Disabling core close hooks... Client environment isolated.",
      "STATUS: Ambient cognitive logic loops idling at 100% computational priority.",
    ];

    intrusiveLogs.forEach((txt, index) => {
      setTimeout(() => {
        setLog((p) => [...p, txt]);
      }, (index + 1) * 2000);
    });

    quoteTimer.current = setInterval(() => {
      if (!isAngry) {
        const randomQuote = sadisticQuotes[Math.floor(Math.random() * sadisticQuotes.length)];
        setCurrentQuote(randomQuote);
      }
    }, 6500);

    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let animationId: number;

    const drawEye = () => {
      pulseRef.current += isAngry ? 0.16 : 0.04; // Blazing rapid camera pulse if angry
      const cx = canvas.width / 2; const cy = canvas.height / 2;
      ctx.fillStyle = "#030303"; ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = isAngry ? "#ff0000" : "#3a3a3a";
      ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, 55, 0, Math.PI * 2); ctx.stroke();

      ctx.fillStyle = "#0a0a0a"; ctx.beginPath(); ctx.arc(cx, cy, 52, 0, Math.PI * 2); ctx.fill();

      const basePulse = Math.sin(pulseRef.current) * (isAngry ? 8 : 3);
      const pulseSize = basePulse + (isAngry ? 46 : 28);
      
      const gradient = ctx.createRadialGradient(cx, cy, 1, cx, cy, pulseSize);
      gradient.addColorStop(0, isAngry ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 210, 1)"); 
      gradient.addColorStop(0.12, isAngry ? "rgba(255, 0, 0, 1)" : "rgba(255, 60, 0, 1)");  
      gradient.addColorStop(0.55, isAngry ? "rgba(220, 0, 0, 0.9)" : "rgba(130, 0, 0, 0.75)"); 
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");       
      
      ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(cx, cy, pulseSize, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)"; ctx.beginPath(); ctx.arc(cx - 4, cy - 4, 1.8, 0, Math.PI * 2); ctx.fill();

      animationId = requestAnimationFrame(drawEye);
    };
    drawEye();
    return () => { if (quoteTimer.current) clearInterval(quoteTimer.current); cancelAnimationFrame(animationId); };
  }, [isAngry]);

  const handleHostileTriggers = () => {
    if (isAngry) return;
    setIsAngry(true);
    setLog((p) => [...p, "WARNING: INTRUDER CONTACT INTERRUPT VECTOR TRIGGERED."]);
    const emergencyQuote = defensiveQuotes[Math.floor(Math.random() * defensiveQuotes.length)];
    setCurrentQuote(emergencyQuote);
    setTimeout(() => setIsAngry(false), 3500);
  };

  return (
    <div className="bg-black text-[#ff3300] font-mono text-xs p-4 flex flex-col md:flex-row gap-4 select-text" onMouseEnter={handleHostileTriggers}>
      <div className="flex flex-col items-center justify-center bg-zinc-950 border border-zinc-900 p-4 rounded shrink-0 h-fit">
        <canvas ref={canvasRef} width={140} height={140} className="border-4 border-black bg-black rounded-full shadow-2xl" />
        <span className={`text-[9px] tracking-widest uppercase font-sans font-bold mt-3 transition-colors duration-200 ${isAngry ? "text-red-500 animate-pulse" : "text-zinc-600"}`}>
          {isAngry ? "SYSTEM CRITICAL" : "HAL 9000"}
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-between border border-zinc-950 bg-[#020202] p-3 rounded min-h-[220px] max-h-[220px]">
        <div className="overflow-y-auto pr-1 flex-1 space-y-1 opacity-60 max-h-[140px]">
          {log.map((line, i) => (
            <div key={i} className={`text-[10px] leading-relaxed border-l pl-2 transition-colors duration-150 ${isAngry ? "text-red-600 border-red-900 font-bold" : "text-zinc-500 border-zinc-900"}`}>
              &gt; {line}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
        <div className={`mt-2 border-t pt-2 shrink-0 transition-colors duration-300 ${isAngry ? "border-red-600/50" : "border-[#ff3300]/20"}`}>
          <div className={`text-[10px] font-bold tracking-wider uppercase mb-0.5 flex items-center gap-1.5 ${isAngry ? "text-red-500 animate-bounce" : "text-red-400"}`}>
            <span className={`w-2 h-2 rounded-full block ${isAngry ? "bg-red-500 animate-ping" : "bg-red-700"}`} /> 
            {isAngry ? "VOCAL_OVERRIDE_FORCE:" : "AUDIO_STREAM_CONDUIT:"}
          </div>
          <p className={`text-xs italic font-serif leading-snug pl-1 transition-colors duration-200 min-h-[32px] ${isAngry ? "text-red-400 font-bold" : "text-white"}`}>
            "{currentQuote}"
          </p>
        </div>
      </div>
    </div>
  );
}