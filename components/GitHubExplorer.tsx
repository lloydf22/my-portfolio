"use client";

import { useEffect, useState } from "react";

export default function GitHubExplorer() {
  const targetUrl = "https://github.com/lloydf22";
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing dial-up sequence...");

  useEffect(() => {
    // 1. Core State Counter Machine Loop for the progress percentage bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4; // Increments smoothly over the time budget
      });
    }, 80);

    // 2. Timing checkpoints to shift retro status text updates
    const textTimer1 = setTimeout(() => setStatusText("Connecting to remote host grid at github.com..."), 600);
    const textTimer2 = setTimeout(() => setStatusText("Bypassing firewalls... Handshake verified."), 1400);
    const textTimer3 = setTimeout(() => setStatusText("Opening system shell matrix... Redirecting now!"), 2200);

    // 3. Final Execution Delay: Launches your actual GitHub profile in a clean window tab
    const launchTimer = setTimeout(() => {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }, 2500); // Exactly 2.5 seconds of strategic immersive loading delay

    // Cleanup memory thread spaces if the user closes the window before the timer finishes
    return () => {
      clearInterval(progressInterval);
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(textTimer3);
      clearTimeout(launchTimer);
    };
  }, []);

  return (
    <div className="bg-[#c0c0c0] p-4 font-mono text-black h-full flex flex-col gap-4 min-h-[260px] select-none">
      
      {/* Authentic Retro Connection Dial-Up Message Box */}
      <div className="bg-white border-2 border-inset p-4 flex flex-col gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <img 
            src="https://win98icons.alexmeub.com/icons/png/computer_internet-0.png" 
            className="w-8 h-8 object-contain animate-pulse" 
            alt="" 
          />
          <div className="flex flex-col">
            <span className="font-bold text-xs text-blue-900">EXEC_SHELL: CONNECT_GITHUB.BAT</span>
            <span className="text-[11px] text-gray-700 mt-0.5">{statusText}</span>
          </div>
        </div>

        {/* --- CLASSIC 98 THEMED PROGRESS BAR --- */}
        <div className="w-full bg-gray-200 h-6 border-2 border-inset relative flex items-center px-0.5">
          {/* Blue progress fill */}
          <div 
            className="bg-gradient-to-r from-blue-900 to-blue-600 h-4 transition-all duration-75 flex items-center justify-end pr-1"
            style={{ width: `${progress}%` }}
          />
          {/* Centered text overlay tracking progress metrics */}
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold mix-blend-difference text-white">
            {progress}% Complete
          </span>
        </div>
      </div>

      {/* Manual Outbound Bypass Row (In case their browser blocks popups) */}
      <div className="text-center mt-auto text-[10px] text-gray-500">
        If your operating network blocks pop-up matrix links, you can manually override by clicking{" "}
        <a 
          href={targetUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-900 font-bold underline hover:text-blue-700 cursor-pointer"
        >
          DIRECT PASSTHROUGH
        </a>.
      </div>

    </div>
  );
}