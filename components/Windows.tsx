"use client";

import React, { useState } from "react";

interface WindowProps {
  title: string;
  iconUrl: string;
  isOpen: boolean;
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  children: React.ReactNode;
  defaultWidth?: string;
  bodyHeight?: string; // New height specification handler
}

export default function Window({
  title,
  iconUrl,
  isOpen,
  isActive,
  onClose,
  onFocus,
  onMinimize,
  children,
  defaultWidth = "max-w-[500px]",
  bodyHeight = "h-auto" // Defaults to auto if not defined
}: WindowProps) {
  const [snarkyHelp, setSnarkyHelp] = useState<string | null>(null);

  const funnyDeveloperRemarks = [
    "We have a walking cat, an interactive dungeon crawler, and a rogue heuristic AI on this stack. You think I had time to write a help file?",
    "Instruction Manual: Click around until something breaks, then run 'cls' in the terminal. That's essentially my entire debugging process.",
    "ERROR 404: Helpful instructions missing. The help system was structurally unmapped to make room for more cat animations.",
    "Help Document Status: Currently stuck in an infinite loop inside an ESP32 Interrupt Service Routine. Please check back after graduation.",
    "If you find any bugs, just assume they are highly advanced, intentional Easter eggs. It saves us both a lot of paperwork.",
    "I'd write a full system guide, but I have a Physics 2 lab report due and a custom motorcycle dashboard PCB to route.",
    "Pro Tip: If HAL-9000 refuses to close, clicking the button harder won't help. He feeds on that kinetic energy."
  ];

  if (!isOpen) return null;

  const triggerHelpAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    const randomRemark = funnyDeveloperRemarks[Math.floor(Math.random() * funnyDeveloperRemarks.length)];
    setSnarkyHelp(randomRemark);
  };

  return (
    <div
      onMouseDown={onFocus}
      className={`window pointer-events-auto w-full shadow-2xl absolute ${defaultWidth}`}
      style={{
        zIndex: isActive ? 40 : 30,
      }}
    >
      {/* Window Title Bar */}
      <div className={`title-bar ${isActive ? "" : "inactive"} select-none`}>
        <div className="title-bar-text flex items-center gap-2 font-mono">
          <img src={iconUrl} className="w-4 h-4 object-contain" alt="" />
          {title}
        </div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={(e) => { e.stopPropagation(); onMinimize(); }} />
          <button aria-label="Maximize" />
          <button aria-label="Close" onClick={(e) => { e.stopPropagation(); onClose(); }} />
        </div>
      </div>

      {/* Aesthetic Toolbar Menu */}
      <div className="flex bg-[#c0c0c0] text-black text-xs font-mono px-1 py-0.5 border-b border-gray-400 gap-3 select-none">
        <span className="hover:underline cursor-pointer">File</span>
        <span className="hover:underline cursor-pointer">Edit</span>
        <span className="hover:underline cursor-pointer" onClick={triggerHelpAlert}>Help</span>
      </div>

      {/* Internal View Workspace Body - Dynamic height restriction with forced scroll parameters */}
      <div 
        className={`window-body bg-white m-1 border-2 border-inset overflow-y-auto text-black ${bodyHeight}`}
      >
        {children}
      </div>

      {/* --- BACKDROP CLICK OVERLAY DIALOG INTERCEPT --- */}
      {snarkyHelp && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-[500] pointer-events-auto cursor-default" onClick={() => setSnarkyHelp(null)}>
          <div className="window min-w-[280px] max-w-[320px] shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="title-bar select-none">
              <div className="title-bar-text font-mono">System Message</div>
              <div className="title-bar-controls">
                <button aria-label="Close" onClick={() => setSnarkyHelp(null)} />
              </div>
            </div>
            <div className="window-body font-mono text-xs flex gap-3 p-3 text-black">
              <img src="https://win98icons.alexmeub.com/icons/png/msg_warning-0.png" alt="" className="w-8 h-8 object-contain shrink-0" />
              <p className="pt-0.5 leading-normal select-text">{snarkyHelp}</p>
            </div>
            <div className="flex justify-end px-3 pb-3 bg-[#c0c0c0]">
              <button className="px-4 py-0.5 font-mono text-xs text-black cursor-pointer" onClick={() => setSnarkyHelp(null)}>OK</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}