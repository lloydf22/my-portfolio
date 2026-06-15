"use client";

import React, { useState, useRef, useEffect } from "react";

interface TerminalProps {
  triggerCat: () => void;
  triggerHal: () => void;
  triggerCrash: () => void;
}

interface LogLine {
  text: string;
  type: "input" | "output" | "error" | "system";
}

export default function TerminalHub({ triggerCat, triggerHal, triggerCrash }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<LogLine[]>([
    { text: "Microsoft(R) Windows 98", type: "system" },
    { text: "(C)Copyright Microsoft Corp 1981-1998.", type: "system" },
    { text: "System memory allocation registers checks: OK.", type: "system" },
    { text: "Type 'help' to view available system subsystem commands.", type: "output" },
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keep terminal text scrolled to the absolute bottom automatically
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Clean ref-based container target focus engine
  const handleContainerFocus = () => {
    inputRef.current?.focus();
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const tokens = trimmedInput.toLowerCase().split(" ");
    const cmd = tokens[0];

    // Log the user's input line exactly as written
    const newHistory = [...history, { text: `C:\\WINDOWS>${trimmedInput}`, type: "input" as const }];

    switch (cmd) {
      case "help":
        newHistory.push(
          { text: "--- AVAILABLE COMMAND CORE UTILITIES ---", type: "system" },
          { text: "HELP       - Displays current system diagnostic directory utilities.", type: "output" },
          { text: "SYSINFO    - Queries core CPU architecture and platform footprints.", type: "output" },
          { text: "DIR        - Lists current executable directory file manifests.", type: "output" },
          { text: "CLS        - Clears the terminal environment buffer arrays.", type: "output" },
          { text: "NEOFETCH   - Renders a stylized ASCII hardware profile.", type: "output" },
          { text: "CAT        - Initializes custom cat.sys structural desktop drivers.", type: "system" },
          { text: "HAL9000    - Establishes connection terminal to heuristic AI frame.", type: "system" },
          { text: "CRASH      - Force-terminates core kernel memory allocation maps.", type: "error" }
        );
        break;

      case "cls":
        setHistory([]);
        setInput("");
        return;

      case "sysinfo":
        newHistory.push(
          { text: "HOST SYSTEM: Ian Lloyd Finley Workstation Node", type: "output" },
          { text: "ARCHITECTURE: Computer Engineering Core Matrix (FIU Online)", type: "output" },
          { text: "MATRICES COMPLETED: Calculus I-III, Differential Equations", type: "output" },
          { text: "CURRENT LAB FLIGHTS: Physics 2, Embedded Systems Programming", type: "output" },
          { text: "GRADUATION TARGET: Spring 2027", type: "output" }
        );
        break;

      case "dir":
        newHistory.push(
          { text: " Volume in drive C has no label.", type: "output" },
          { text: " Directory of C:\\WINDOWS", type: "output" },
          { text: "", type: "output" },
          { text: "06/15/2026  12:00p      <DIR>          .", type: "output" },
          { text: "06/15/2026  12:00p      <DIR>          ..", type: "output" },
          { text: "06/15/2026  08:24a                 480 About_Me.txt", type: "output" },
          { text: "06/15/2026  11:15a               2,456 Engineering_Projects.dir", type: "output" },
          { text: "06/15/2026  03:40p                 892 Cosmic_Bound.exe", type: "output" },
          { text: "06/15/2026  04:12p                 128 GitHub_Explorer.exe", type: "output" },
          { text: "               4 File(s)          3,956 bytes", type: "output" }
        );
        break;

      case "neofetch":
        newHistory.push({
          text: `
 .-\`\"\"\"\`-.      ian@fiu-workstation
/   _   _   \\     -------------------
|  (o) (o)  |     OS: Windows 98 SE Core Emulator
|   \\   /   |     KERNEL: Next.js v14 Runtime Stack
\\    \`-\`    /     CPU: Dell Precision 5820 Unit
 \`._______.\`      GPU: Tesla P40 Acceleration Array
                  MEMORY: 24GB VRAM LLM Local Allocation
          `,
          type: "system"
        });
        break;

      case "cat":
        triggerCat(); 
        newHistory.push(
          { text: "Loading CAT.SYS network frameworks...", type: "system" },
          { text: "Acknowledge handshake... Pixel array companion spawned successfully.", type: "output" }
        );
        break;

      case "hal9000":
        triggerHal(); 
        newHistory.push(
          { text: "WARNING: BROADCASTING REMOTE INTERRUPT SIGNAL VECTOR...", type: "error" },
          { text: "Connection successfully hijacked by heuristic subsystem layer.", type: "system" }
        );
        break;

      case "crash":
        triggerCrash(); 
        return; 

      default:
        newHistory.push({ 
          text: `Bad command or file name: '${cmd}'. Type 'help' for command registers.`, 
          type: "error" 
        });
        break;
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div 
      className="bg-black text-[#00ff00] font-mono text-sm p-3 h-full flex flex-col min-h-[360px] cursor-text overflow-y-auto selection:bg-zinc-700"
      onClick={handleContainerFocus}
    >
      {/* Scrollable Command Line Terminal Output Window Track */}
      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        {history.map((line, idx) => (
          <div 
            key={idx} 
            className={`whitespace-pre-wrap leading-relaxed select-text ${
              line.type === "input" ? "text-white" : 
              line.type === "error" ? "text-red-500 font-bold" : 
              line.type === "system" ? "text-cyan-400" : "text-[#00ff00]"
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Active Input Console Line (Forced text-white safety constraints added) */}
      <form onSubmit={handleCommandSubmit} className="flex items-center mt-2 border-t border-gray-900 pt-2 select-none">
        <span className="text-white shrink-0">C:\WINDOWS&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm pl-1 focus:ring-0 focus:outline-none caret-white"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          maxLength={50}
          style={{
            color: "#ffffff", // Structural fallback style protection forces layout rendering
            background: "transparent",
            boxShadow: "none"
          }}
        />
      </form>
    </div>
  );
}