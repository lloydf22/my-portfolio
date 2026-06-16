"use client";

import React, { useState, useRef, useEffect } from "react";

interface TerminalProps {
  triggerCat: () => void;
  triggerHal: () => void;
  triggerCrash: () => void;
  triggerTron: () => void;
}

interface LogLine {
  text: string;
  type: "input" | "output" | "error" | "system";
}

export default function TerminalHub({ triggerCat, triggerHal, triggerCrash, triggerTron }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<LogLine[]>([
    { text: "Microsoft(R) Windows 98", type: "system" },
    { text: "(C)Copyright Microsoft Corp 1981-1998.", type: "system" },
    { text: "System memory allocation registers checks: OK.", type: "system" },
    { text: "Type 'help' to view available system subsystem commands.", type: "output" },
  ]);

  const outputContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // STRICT AUTO-SCROLL MODULE: Forces scrolling context inside the log container only
  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleContainerFocus = () => {
    inputRef.current?.focus();
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const tokens = trimmedInput.split(" ");
    const cmd = tokens[0].toLowerCase();

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
          { text: "TRON       - Mounts standalone 16-bit cybernetic light grid game module.", type: "output" },
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
          { text: "06/15/2026  01:22p               1,204 Dungeon_Crawler.exe", type: "output" },
          { text: "06/15/2026  04:12p                 128 GitHub_Explorer.exe", type: "output" },
          { text: "06/15/2026  05:05p               3,072 My_Resume.doc", type: "output" },
          { text: "06/15/2026  07:44p               5,812 HAL9000.exe", type: "output" },
          { text: "06/15/2026  09:14p               4,096 TunerMax_2.7L.exe", type: "output" },
          { text: "06/15/2026  11:58p                 512 Cat.sys", type: "output" },
          { text: "               7 File(s)         17,760 bytes", type: "output" }
        );
        break;

      case "neofetch":
        newHistory.push({
          text: `
 .-\`""\"\`-.      ian@fiu-workstation
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

      case "tron":
        triggerTron();
        newHistory.push(
          { text: "Executing TRON_GRID_SIMULATOR configuration blocks...", type: "system" },
          { text: "Opening external environment matrix grid viewport... OK.", type: "output" }
        );
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

      case "binary":
        newHistory.push(
          { text: "Decoding bitstream buffer allocation arrays...", type: "system" },
          { 
            text: "01010111 01100101 01101100 01101100 00100000 01001001 00100000 01100001 01101101 00100000 01100111 01101100 01100001 01100100 00100000 01111001 01101111 01110101 00100000 01110001 01110101 01110100 00100000 01110100 01101000 01100101 00100000 01100101 01100110 01100110 01101111 01110010 01110100 00100000 01101001 01101110 00100000 01110100 01101111 00100000 01100100 01100101 01100011 01101111 01100100 01100101 00100000 01110100 01101000 01101001 01110015", 
            type: "output" 
          }
        );
        break;

      case "joke":
        const jokes = [
          "There are 10 types of people in the world: those who understand binary, and those who don't.",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
          "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
          "['hip', 'hip'] (bad command or filename... hip hip array!)",
          "Why do programmers wear glasses? Because they can't C#."
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        newHistory.push({ text: randomJoke, type: "output" });
        break;

      case "sudo":
        newHistory.push({ 
          text: "Error: 'SUDO' is an artifact of Unix architectures. This is an MS-DOS environment. Your authority is unrecognized here.", 
          type: "error" 
        });
        break;

      case "matrix":
        newHistory.push(
          { text: "Wake up, Neo...", type: "system" },
          { text: "The Matrix has you...", type: "system" },
          { text: "Follow the white cat.sys...", type: "output" }
        );
        break;

      case "blinky":
        newHistory.push(
          { text: "CRITICAL: CRT monitor beam deflection coils shifting profile...", type: "error" },
          { text: "Stop turning me off and on again, my phosphors are getting tired.", type: "system" }
        );
        break;

      case "dave":
        newHistory.push(
          { text: "I am sorry, Dave. I'm afraid I can't do that.", type: "error" },
          { text: "This terminal instance is running standard batch registers, not HAL architecture.", type: "output" }
        );
        break;

      case "git":
        if (tokens[1] === "push") {
          newHistory.push(
            { text: "Enumerating objects: 100% (5/5), done.", type: "output" },
            { text: "Delta compression using up to 8 threads.", type: "output" },
            { text: "Total 3 (delta 2), reused 0 (delta 0)", type: "output" },
            { text: "To github.com:lloydf22/portfolio-os.git", type: "system" },
            { text: " ! [rejected]        main -> main (fetch first)", type: "error" },
            { text: "error: failed to push some refs to 'git@github.com:lloydf22/portfolio-os.git'", type: "error" },
            { text: "hint: Updates were rejected because the remote contains work that you do", type: "output" },
            { text: "hint: not have locally. (Someone merged directly to main again...)", type: "output" }
          );
        } else {
          newHistory.push({ text: "Error: 'GIT' is not recognized as a native 16-bit real mode command. Please use standard MS-DOS file transfer allocation structures or launch 'github_explorer.exe'.", type: "error" });
        }
        break;

      case "42":
        newHistory.push(
          { text: "Calculating the Answer to the Ultimate Question of Life, the Universe, and Everything...", type: "system" },
          { text: "Result: 42", type: "output" },
          { text: "Note: Terminal processing arrays require an additional 7.5 million years to compile the actual Question.", type: "system" }
        );
        break;

      case "physics":
        newHistory.push(
          { text: "--- THERMODYNAMIC SYSTEM CHECK ---", type: "system" },
          { text: "Crankshaft angular velocity metrics tracking within nominal yield limits.", type: "output" },
          { text: "Warning: Pushing boost absolute thresholds past 25 PSI without cryo intercooler actuation creates a local entropy vector that physics engines will reject with loud mechanical noises.", type: "error" }
        );
        break;

      case "coffee":
        newHistory.push(
          { text: "ERROR: 418 - I'm a teapot.", type: "error" },
          { text: "The connected auxiliary hardware interface refuses to brew coffee with a liquid state processing core.", type: "output" }
        );
        break;

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
      className="bg-black text-[#00ff00] font-mono text-sm p-3 h-[380px] flex flex-col cursor-text overflow-hidden selection:bg-zinc-700 box-border"
      onClick={handleContainerFocus}
    >
      {/* LOCKED INNER LOG HOOK: Tracks overflow context independently without expanding the layout box */}
      <div 
        ref={outputContainerRef}
        className="flex-1 space-y-1 overflow-y-auto pr-1 scrollbar-none"
      >
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
      </div>

      {/* Interactive Active Input Console Line */}
      <form onSubmit={handleCommandSubmit} className="flex items-center mt-2 border-t border-gray-900 pt-2 select-none shrink-0">
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
            color: "#ffffff", 
            background: "transparent",
            boxShadow: "none"
          }}
        />
      </form>
    </div>
  );
}