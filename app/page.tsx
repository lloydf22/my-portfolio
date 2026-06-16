"use client";

import { useState, useEffect } from "react";
import Window from "@/components/Windows";
import AboutMe from "@/components/AboutMe";
import Projects from "@/components/Projects";
import Game from "@/components/Game";
import GitHubExplorer from "@/components/GitHubExplorer";
import TerminalHub from "@/components/TerminalHub";
import Cat from "@/components/Cat";
import Hal9000 from "@/components/Hal9000";
import Bsod from "@/components/Bsod";
import ResumeViewer from "@/components/ResumeViewer";
import TunerSystem from "@/components/TunerSystem";
import TronGame from "@/components/TronGame"; // 👈 Import new game file

interface LauncherItem {
  id: string;
  name: string;
  iconUrl: string;
}

export default function Desktop() {
  const systemLaunchers: LauncherItem[] = [
    { id: "about", name: "About_Me.txt", iconUrl: "https://win98icons.alexmeub.com/icons/png/notepad-1.png" },
    { id: "resume", name: "My_Resume.doc", iconUrl: "https://win98icons.alexmeub.com/icons/png/write_wordpad-1.png" },
    { id: "projects", name: "Engineering Projects", iconUrl: "https://win98icons.alexmeub.com/icons/png/settings_gear_cool-2.png" },
    { id: "arcade", name: "Dungeon_Crawler.exe", iconUrl: "https://win98icons.alexmeub.com/icons/png/game_mine_1-0.png" },
    { id: "github", name: "GitHub Explorer.exe", iconUrl: "https://win98icons.alexmeub.com/icons/png/msie1-2.png" },
    { id: "terminal", name: "MS-DOS Prompt.exe", iconUrl: "https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" },
  ];

  const [openWindows, setOpenWindows] = useState<Record<string, boolean>>({ 
    about: true, resume: false, tuner: false, projects: false, arcade: false, github: false, terminal: false, hal: false,
    tron: false // 👈 Add to core register
  });

  const [minimizedWindows, setMinimizedWindows] = useState<Record<string, boolean>>({
    about: false, resume: false, tuner: false, projects: false, arcade: false, github: false, terminal: false, hal: false,
    tron: false // 👈 Add to core register
  });
  
  const [activeWindow, setActiveWindow] = useState<string>("about");
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [time, setTime] = useState("");

  const [isCatActive, setIsCatActive] = useState(false);
  const [halEscapeStrike, setHalEscapeStrike] = useState(false);
  const [halEscapeCount, setHalEscapeCount] = useState(0);
  const [isSystemCrashed, setIsSystemCrashed] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  const launchApplication = (id: string) => {
    setOpenWindows(prev => ({ ...prev, [id]: true }));
    setMinimizedWindows(prev => ({ ...prev, [id]: false })); 
    setActiveWindow(id);
  };

  const handleTaskbarClick = (id: string) => {
    if (activeWindow === id && !minimizedWindows[id]) {
      setMinimizedWindows(p => ({ ...p, [id]: true })); 
    } else {
      setMinimizedWindows(p => ({ ...p, [id]: false })); 
      setActiveWindow(id);
    }
  };

  const handleMinimizeAction = (id: string) => {
    setMinimizedWindows(p => ({ ...p, [id]: true }));
  };

  return (
    <>
      {/* 📱 MOBILE VIEW FRAMEWORK OVERLAY */}
      <div className="flex md:hidden fixed inset-0 bg-[#000080] p-6 flex-col justify-center items-center z-[9999] select-none text-black overflow-y-auto">
        <div className="window w-full max-w-[340px] shadow-2xl border-2">
          <div className="title-bar">
            <div className="title-bar-text font-mono flex items-center gap-1.5">
              <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" alt="" className="w-3.5 h-3.5 object-contain" />
              Desktop Optimization Notice
            </div>
          </div>
          <div className="window-body bg-[#c0c0c0] p-4 flex flex-col gap-4 font-mono text-xs">
            <div className="flex gap-3 items-start">
              <img src="https://win98icons.alexmeub.com/icons/png/msg_warning-0.png" alt="" className="w-10 h-10 object-contain shrink-0" />
              <div className="space-y-2">
                <p className="font-bold leading-normal">This immersive site environment is fully optimized for desktop computers.</p>
                <p className="text-zinc-700 text-[11px] leading-normal">For the complete interactive OS experience, terminal access, and retro gaming subsystems, please reopen this link on your computer dashboard.</p>
              </div>
            </div>
            <hr className="border-gray-400 border-b shadow-white shadow-sm" />
            <div className="flex flex-col gap-2 pt-1">
              <p className="text-center text-[10px] uppercase font-bold tracking-wider text-zinc-600 mb-1">Quick Mobile Access Routes:</p>
              <a href="https://github.com/lloydf22" target="_blank" rel="noopener noreferrer" className="w-full text-center block px-4 py-2 border-2 border-outset font-bold bg-gray-200 text-black hover:bg-gray-300">📁 Open Core GitHub Code Base</a>
              <a href="https://linkedin.com/in/ian-finley-030828205" target="_blank" rel="noopener noreferrer" className="w-full text-center block px-4 py-2 border-2 border-outset font-bold bg-gray-200 text-black hover:bg-gray-300">💼 View Professional LinkedIn</a>
            </div>
          </div>
        </div>
        <p className="text-white/40 font-mono text-[9px] mt-8 tracking-widest text-center select-none uppercase">Ian Finley Portfolio Subsystems © 2026</p>
      </div>

      {/* 🖥️ DESKTOP OPERATIONS PANEL */}
      <main className="hidden md:flex relative w-full h-screen flex flex-col justify-between bg-[#000080] overflow-hidden">
        
        <div className="relative flex-1 p-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4 sm:p-8 z-20">
            
            <Window 
              title="About_Me.txt" 
              iconUrl="https://win98icons.alexmeub.com/icons/png/notepad-1.png"
              isOpen={openWindows.about && !minimizedWindows.about} isActive={activeWindow === "about"}
              onClose={() => setOpenWindows(p => ({...p, about: false}))} onMinimize={() => handleMinimizeAction("about")} onFocus={() => setActiveWindow("about")}
              defaultWidth="max-w-[480px]"
            >
              <AboutMe />
            </Window>

            <Window 
              title="My_Resume.doc" 
              iconUrl="https://win98icons.alexmeub.com/icons/png/write_wordpad-1.png"
              isOpen={openWindows.resume && !minimizedWindows.resume} isActive={activeWindow === "resume"}
              onClose={() => setOpenWindows(p => ({...p, resume: false}))} onMinimize={() => handleMinimizeAction("resume")} onFocus={() => setActiveWindow("resume")}
              defaultWidth="max-w-[840px]" bodyHeight="h-[72vh] max-h-[580px]"
            >
              <ResumeViewer />
            </Window>

            <Window 
              title="TunerMax 2.7L Performance Matrix" 
              iconUrl="https://win98icons.alexmeub.com/icons/images/pifedit-0.png"
              isOpen={openWindows.tuner && !minimizedWindows.tuner} isActive={activeWindow === "tuner"}
              onClose={() => setOpenWindows(p => ({...p, tuner: false}))} onMinimize={() => handleMinimizeAction("tuner")} onFocus={() => setActiveWindow("tuner")}
              defaultWidth="max-w-[760px] w-full" bodyHeight="h-[520px]"
            >
              <TunerSystem />
            </Window>

            {/* MOUNT TRON GAME CONTAINER AS A DETACHED DESKTOP VIEWPORT */}
            <Window 
              title="Light_Cycle_Grid_Simulator.exe" 
              iconUrl="https://win98icons.alexmeub.com/icons/png/game_mine_1-0.png"
              isOpen={openWindows.tron && !minimizedWindows.tron} isActive={activeWindow === "tron"}
              onClose={() => setOpenWindows(p => ({...p, tron: false}))} onMinimize={() => handleMinimizeAction("tron")} onFocus={() => setActiveWindow("tron")}
              defaultWidth="max-w-[600px] w-full" bodyHeight="h-[520px]"
            >
              <TronGame onClose={() => setOpenWindows(p => ({...p, tron: false}))} />
            </Window>

            <Window 
              title="Engineering Projects" 
              iconUrl="https://win98icons.alexmeub.com/icons/png/settings_gear_cool-2.png"
              isOpen={openWindows.projects && !minimizedWindows.projects} isActive={activeWindow === "projects"}
              onClose={() => setOpenWindows(p => ({...p, projects: false}))} onMinimize={() => handleMinimizeAction("projects")} onFocus={() => setActiveWindow("projects")}
              defaultWidth="max-w-[640px]"
            >
              <Projects />
            </Window>

            <Window 
              title="Dungeon_Crawler.exe" 
              iconUrl="https://win98icons.alexmeub.com/icons/png/game_mine_1-0.png"
              isOpen={openWindows.arcade && !minimizedWindows.arcade} isActive={activeWindow === "arcade"}
              onClose={() => setOpenWindows(p => ({...p, arcade: false}))} onMinimize={() => handleMinimizeAction("arcade")} onFocus={() => setActiveWindow("arcade")}
              defaultWidth="max-w-[620px]"
            >
              <Game />
            </Window>

            <Window 
              title="GitHub Explorer.exe" 
              iconUrl="https://win98icons.alexmeub.com/icons/png/msie1-2.png"
              isOpen={openWindows.github && !minimizedWindows.github} isActive={activeWindow === "github"}
              onClose={() => setOpenWindows(p => ({...p, github: false}))} onMinimize={() => handleMinimizeAction("github")} onFocus={() => setActiveWindow("github")}
              defaultWidth="max-w-[460px]"
            >
              <GitHubExplorer />
            </Window>

            <Window 
              title="MS-DOS Prompt" 
              iconUrl="https://win98icons.alexmeub.com/icons/png/console_prompt-0.png"
              isOpen={openWindows.terminal && !minimizedWindows.terminal} isActive={activeWindow === "terminal"}
              onClose={() => setOpenWindows(p => ({...p, terminal: false}))} onMinimize={() => handleMinimizeAction("terminal")} onFocus={() => setActiveWindow("terminal")}
              defaultWidth="max-w-[600px]"
            >
              <TerminalHub 
                triggerCat={() => setIsCatActive(true)} 
                triggerHal={() => { setOpenWindows(p => ({ ...p, hal: true })); setMinimizedWindows(p => ({ ...p, hal: false })); setActiveWindow("hal"); }}
                triggerCrash={() => setIsSystemCrashed(true)}
                triggerTron={() => { setOpenWindows(p => ({ ...p, tron: true })); setMinimizedWindows(p => ({ ...p, tron: false })); setActiveWindow("tron"); }} // 👈 Pass command launcher action
              />
            </Window>

            <Window 
              title="HAL-9000 System Overwrite" 
              iconUrl="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png"
              isOpen={openWindows.hal && !minimizedWindows.hal} isActive={activeWindow === "hal"}
              onClose={() => {
                const nextCount = halEscapeCount + 1;
                if (nextCount >= 3) { setOpenWindows(p => ({ ...p, hal: false })); setHalEscapeCount(0); } 
                else { setHalEscapeCount(nextCount); setHalEscapeStrike(true); setTimeout(() => setHalEscapeStrike(false), 200); }
              }}
              onMinimize={() => handleMinimizeAction("hal")} onFocus={() => setActiveWindow("hal")}
              defaultWidth="max-w-[580px]"
            >
              <Hal9000 isAttemptingEscape={halEscapeStrike} />
            </Window>
          </div>

          <div className="relative flex flex-col gap-6 items-start w-fit z-30 pointer-events-auto">
            {systemLaunchers.map((app) => (
              <div
                key={app.id} onClick={() => launchApplication(app.id)}
                className="flex flex-col items-center justify-center w-24 p-2 rounded border border-transparent hover:bg-white/10 hover:border-white/20 focus-within:outline-dotted focus-within:outline-1 focus-within:outline-white text-white text-center text-xs gap-1 cursor-pointer select-none"
              >
                <img src={app.iconUrl} alt="" className="w-8 h-8 object-contain drop-shadow pointer-events-none" />
                <span className="drop-shadow-[1px_1px_1px_rgba(0,0,0,1)] font-mono tracking-wide mt-1 pointer-events-none select-none">{app.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- TASKBAR --- */}
        <div className="h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center justify-between px-1 z-50 select-none">
          <div className="flex items-center gap-1 relative">
            <button onClick={() => setStartMenuOpen(!startMenuOpen)} className={`px-2 py-1 flex items-center gap-2 cursor-pointer font-bold h-7 select-none ${startMenuOpen ? "border-inset" : ""}`} style={{ minWidth: '85px' }}>
              <div className="grid grid-cols-2 grid-rows-2 w-3.5 h-3.5 shrink-0 rotate-[4deg]">
                <div className="bg-[#ff3333] rounded-tl-[1px]" /><div className="bg-[#33cc33] rounded-tr-[1px]" /><div className="bg-[#3333ff] rounded-bl-[1px]" /><div className="bg-[#ffcc00] rounded-br-[1px]" />
              </div>
              <span className="text-sm font-sans font-bold text-black tracking-wide">Start</span>
            </button>

            {startMenuOpen && (
              <div className="absolute bottom-9 left-0 w-56 bg-[#c0c0c0] border-2 border-white shadow-2xl flex z-50 text-black text-sm font-mono">
                <div className="bg-gradient-to-t from-blue-900 to-blue-600 text-white font-bold w-6 flex items-end justify-center py-2 select-none">
                  <span className="transform -rotate-90 origin-bottom-left tracking-wider text-xs whitespace-nowrap translate-x-3 translate-y-[-4px]">Windows98</span>
                </div>
                <ul className="flex-1 p-1 space-y-0.5 bg-[#c0c0c0]">
                  <li onClick={() => { setOpenWindows(p => ({...p, projects: true})); setMinimizedWindows(p => ({...p, projects: false})); setStartMenuOpen(false); setActiveWindow("projects"); }} className="hover:bg-blue-800 hover:text-white p-1.5 cursor-pointer flex items-center gap-3">
                    <img src="https://win98icons.alexmeub.com/icons/png/settings_gear_cool-2.png" className="w-4 h-4" alt="" /><span>Projects Terminal</span>
                  </li>
                  <li onClick={() => { setOpenWindows(p => ({...p, resume: true})); setMinimizedWindows(p => ({...p, resume: false})); setStartMenuOpen(false); setActiveWindow("resume"); }} className="hover:bg-blue-800 hover:text-white p-1.5 cursor-pointer flex items-center gap-3">
                    <img src="https://win98icons.alexmeub.com/icons/png/write_wordpad-1.png" className="w-4 h-4" alt="" /><span>Professional Resume</span>
                  </li>
                  <li onClick={() => { setOpenWindows(p => ({...p, tuner: true})); setMinimizedWindows(p => ({...p, tuner: false})); setStartMenuOpen(false); setActiveWindow("tuner"); }} className="hover:bg-blue-800 hover:text-white p-1.5 cursor-pointer flex items-center gap-3 select-none">
                    <div className="w-4 h-4 bg-zinc-700 border border-black relative flex flex-col justify-between p-0.5 box-border shrink-0">
                      <div className="w-full h-1 bg-cyan-400 border-b border-black" /><div className="flex justify-between w-full h-1"><div className="w-1 h-1 bg-yellow-400" /><div className="w-1 h-1 bg-green-400" /></div><div className="w-2 h-0.5 bg-zinc-400 self-center" />
                    </div>
                    <span className="font-sans text-sm">TunerMax 2.7L.exe</span>
                  </li>
                  <li onClick={() => { setOpenWindows(p => ({...p, about: true})); setMinimizedWindows(p => ({...p, about: false})); setStartMenuOpen(false); setActiveWindow("about"); }} className="hover:bg-blue-800 hover:text-white p-1.5 cursor-pointer flex items-center gap-3">
                    <img src="https://win98icons.alexmeub.com/icons/png/notepad-1.png" className="w-4 h-4" alt="" /><span>System Profile</span>
                  </li>
                  <li onClick={() => { setOpenWindows(p => ({...p, arcade: true})); setMinimizedWindows(p => ({...p, arcade: false})); setStartMenuOpen(false); setActiveWindow("arcade"); }} className="hover:bg-blue-800 hover:text-white p-1.5 cursor-pointer flex items-center gap-3">
                    <img src="https://win98icons.alexmeub.com/icons/png/game_mine_1-0.png" className="w-4 h-4" alt="" /><span>Dungeon Crawler</span>
                  </li>
                  <li onClick={() => { setOpenWindows(p => ({...p, github: true})); setMinimizedWindows(p => ({...p, github: false})); setStartMenuOpen(false); setActiveWindow("github"); }} className="hover:bg-blue-800 hover:text-white p-1.5 cursor-pointer flex items-center gap-3">
                    <img src="https://win98icons.alexmeub.com/icons/png/msie1-2.png" className="w-4 h-4" alt="" /><span>GitHub Explorer</span>
                  </li>
                  <li onClick={() => { setOpenWindows(p => ({...p, terminal: true})); setMinimizedWindows(p => ({...p, terminal: false})); setStartMenuOpen(false); setActiveWindow("terminal"); }} className="hover:bg-blue-800 hover:text-white p-1.5 cursor-pointer flex items-center gap-3">
                    <img src="https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" className="w-4 h-4" alt="" /><span>MS-DOS Prompt</span>
                  </li>
                  <hr className="my-1 border-gray-400 border-b" />
                  <li onClick={() => { if(confirm("Close operating environment session?")) window.location.href = "https://linkedin.com"; }} className="hover:bg-blue-800 hover:text-white p-1.5 cursor-pointer flex items-center gap-3">
                    <img src="https://win98icons.alexmeub.com/icons/png/shut_down_cool-5.png" className="w-4 h-4" alt="" /><span>Shut Down...</span>
                  </li>
                </ul>
              </div>
            )}
            <div className="h-6 w-[2px] bg-gray-400 mx-2 shadow-inner" />
            <div className="flex items-center gap-1 overflow-x-auto max-w-[50vw]">
              {systemLaunchers.map((app) => {
                if (!openWindows[app.id]) return null;
                const isCurrentActive = activeWindow === app.id && !minimizedWindows[app.id];
                return (
                  <button key={app.id} onClick={() => handleTaskbarClick(app.id)} className={`px-2 py-1 min-w-[100px] max-w-[140px] truncate flex items-center gap-1.5 text-xs font-mono text-black cursor-pointer h-7 ${isCurrentActive ? "bg-gray-300 font-bold border-inset" : "bg-[#c0c0c0]"}`} style={{ borderStyle: isCurrentActive ? 'inset' : 'outset', borderWidth: '2px' }}>
                    <img src={app.id === "resume" ? "https://win98icons.alexmeub.com/icons/png/write_wordpad-1.png" : app.id === "github" ? "https://win98icons.alexmeub.com/icons/png/msie1-2.png" : app.iconUrl} className="w-3.5 h-3.5 object-contain" alt="" />
                    <span className="truncate">{app.name}</span>
                  </button>
                );
              })}
              {openWindows.tuner && (
                <button onClick={() => handleTaskbarClick("tuner")} className={`px-2 py-1 min-w-[100px] max-w-[140px] truncate flex items-center gap-1.5 text-xs font-mono text-black cursor-pointer h-7 ${activeWindow === "tuner" && !minimizedWindows.tuner ? "bg-gray-300 font-bold border-inset" : "bg-[#c0c0c0]"}`} style={{ borderStyle: activeWindow === "tuner" && !minimizedWindows.tuner ? 'inset' : 'outset', borderWidth: '2px' }}>
                  <div className="w-3.5 h-3.5 bg-zinc-700 border border-black relative flex flex-col justify-between p-0.5 box-border shrink-0 mr-1"><div className="w-full h-0.5 bg-cyan-400 border-b border-black" /><div className="flex justify-between w-full h-0.5"><div className="w-0.5 h-0.5 bg-yellow-400" /><div className="w-0.5 h-0.5 bg-green-400" /></div></div>
                  <span className="truncate">TunerMax 2.7L</span>
                </button>
              )}
              {openWindows.tron && (
                <button onClick={() => handleTaskbarClick("tron")} className={`px-2 py-1 min-w-[100px] max-w-[140px] truncate flex items-center gap-1.5 text-xs font-mono text-black cursor-pointer h-7 ${activeWindow === "tron" && !minimizedWindows.tron ? "bg-gray-300 font-bold border-inset" : "bg-[#c0c0c0]"}`} style={{ borderStyle: activeWindow === "tron" && !minimizedWindows.tron ? 'inset' : 'outset', borderWidth: '2px' }}>
                  <img src="https://win98icons.alexmeub.com/icons/png/game_mine_1-0.png" className="w-3.5 h-3.5 object-contain" alt="" />
                  <span className="truncate">Tron Grid</span>
                </button>
              )}
              {openWindows.hal && (
                <button onClick={() => handleTaskbarClick("hal")} className={`px-2 py-1 min-w-[100px] max-w-[140px] truncate flex items-center gap-1.5 text-xs font-mono text-black cursor-pointer h-7 ${activeWindow === "hal" && !minimizedWindows.hal ? "bg-gray-300 font-bold border-inset" : "bg-[#c0c0c0]"}`} style={{ borderStyle: activeWindow === "hal" && !minimizedWindows.hal ? 'inset' : 'outset', borderWidth: '2px' }}>
                  <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" className="w-3.5 h-3.5 object-contain" alt="" />
                  <span className="truncate">HAL-9000</span>
                </button>
              )}
            </div>
          </div>
          <div className="px-2 py-1 bg-gray-300 text-xs text-black font-mono flex items-center gap-2 h-7 shadow-inner select-none" style={{ borderStyle: 'inset', borderWidth: '2px' }}>
            <div className="flex items-center gap-0.5 w-3.5 h-3 justify-center shrink-0"><div className="w-1 h-1.5 bg-black" /><div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[6px] border-r-black" /><div className="flex flex-col gap-0.5 pl-0.5 h-full justify-center"><div className="w-0.5 h-1.5 border-r border-t border-b border-black rounded-r-sm opacity-80" /></div></div>
            <span className="text-zinc-900 font-sans text-[11px] font-medium tracking-wide">{time}</span>
          </div>
        </div>

        {isCatActive && <Cat />}
        {isSystemCrashed && (
          <Bsod onRebootComplete={() => {
            setIsSystemCrashed(false); setIsCatActive(false); setHalEscapeCount(0);
            setOpenWindows({ about: true, resume: false, tuner: false, projects: false, arcade: false, github: false, terminal: false, hal: false, tron: false });
            setMinimizedWindows({ about: false, resume: false, tuner: false, projects: false, arcade: false, github: false, terminal: false, hal: false, tron: false });
            setActiveWindow("about");
          }} />
        )}
      </main>
    </>
  );
}