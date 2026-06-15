"use client";

import React, { useState, useEffect } from "react";

interface BsodProps {
  onRebootComplete: () => void;
}

export default function Bsod({ onRebootComplete }: BsodProps) {
  const [stage, setStage] = useState<"BLUE_SCREEN" | "BIOS_BOOT">("BLUE_SCREEN");
  const [biosLines, setBiosLines] = useState<string[]>([]);

  // Capture Enter key to initiate the reboot cycle
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (stage === "BLUE_SCREEN" && e.code === "Enter") {
        e.preventDefault();
        setStage("BIOS_BOOT");
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [stage]);

  // Handle sequential text rendering during the hardware reboot
  useEffect(() => {
    if (stage !== "BIOS_BOOT") return;

    const bootSequence = [
      "Award Modular BIOS v4.51PG, An Energy Star Ally",
      "Copyright (C) 1984-2026, Award Software, Inc.",
      " ",
      "DELL PRECISION WORKSTATION MATRIX MAINBOARD INITIALIZATION",
      "PENTIUM II CPU @ 450MHz INTRINSIC CLOCK PULSE",
      "Memory Test : 262144K OK (ECC BUFFER ARRAY ALLOCATION NOMINAL)",
      "Award Plug and Play BIOS Extension v1.0A",
      "Detecting HDD Primary Master ... ST310240A (LBA, DMA 2, 10.2GB)",
      "Detecting HDD Primary Slave  ... None",
      "Detecting CD-ROM Secondary Master ... CRN-8241B (Ultra DMA 33)",
      " ",
      "CRITICAL DIAGNOSTIC: ESP32 MCU Telemetry Bus... RE-ALIGNED.",
      "CRITICAL DIAGNOSTIC: Tesla P40 VRAM Local Allocation... VENTED.",
      " ",
      "Starting Windows 98 Emergency Recovery Environment...",
      "Clearing corrupt volatile register sectors...",
      "Restoring pristine user space GUI layers..."
    ];

    bootSequence.forEach((line, idx) => {
      setTimeout(() => {
        setBiosLines((p) => [...p, line]);
        
        if (idx === bootSequence.length - 1) {
          setTimeout(() => {
            onRebootComplete();
          }, 1200);
        }
      }, idx * 220);
    });
  }, [stage, onRebootComplete]);

  // --- RENDER 1: AUTHENTIC WINDOWS 98 BSOD ---
  if (stage === "BLUE_SCREEN") {
    return (
      <div className="fixed inset-0 bg-[#0000aa] text-[#aaaaaa] font-mono text-sm md:text-base p-6 md:p-12 z-[9999] select-none uppercase cursor-none h-full w-full flex flex-col justify-between items-center box-border tracking-normal">
        <div className="w-full max-w-[720px] space-y-5 text-left">
          
          {/* Centered Vintage Title Banner */}
          <div className="w-full text-center mb-8">
            <span className="bg-[#aaaaaa] text-[#0000aa] px-4 py-0.5 font-bold tracking-widest text-base inline-block">
              Windows
            </span>
          </div>
          
          <p className="text-white font-bold">
            A fatal exception 0E has occurred at 017F:BFF9B3D4 in VXD VMM(01) + 
            0000A3D4. The current application thread structure has been 
            terminated due to catastrophic register state disintegration.
          </p>

          <p>
            * Error Code: <span className="text-white font-bold">IRQ_NOT_LESS_OR_EQUAL_TO_EXPECTED_PATIENCE</span>
            <br />
            * Vector Dump: <span className="text-white font-bold">0x00C41C31153 - CALCULUS_3_TRIPLE_INTEGRAL_OVERFLOW</span>
            <br />
            * IO Subsystem: <span className="text-white font-bold">PHYSICS_2_GAUSS_LAW_FLUX_DENSITY_MAXED</span>
            <br />
            * Hardware Fault: <span className="text-white font-bold">CHASSIS_HIGH_CENTERED_ON_OCALA_SAND_LINE</span>
            <br />
            * Embedded Lock: <span className="text-white font-bold">ESP32_TELEMETRY_ISR_INFINITE_LOOP_NO_WATCHDOG</span>
            <br />
            * Thermal Event: <span className="text-white font-bold">TESLA_P40_GPU_USED_AS_RESTAURANT_PLATE_WARMER</span>
          </p>

          <p className="text-white font-bold pt-2">
            The system core architecture state is structurally compromised.
          </p>
          
          <p className="space-y-3 normal-case leading-relaxed">
            *  Press <span className="text-white font-bold uppercase">ANY KEY</span> to realize that hitting random keys does absolutely nothing on a bricked 16-bit real-mode real-time interrupt handle.
            <br />
            *  Press <span className="text-white font-bold uppercase">ENTER</span> right now to execution-route a hard power reset vector. You will lose all uncompiled terminal buffer history lines, unrouted PCB trace coordinates, and raw mechanical torque calculations.
          </p>

        </div>

        {/* Bottom blinking text tray cursor prompt */}
        <div className="w-full text-center text-white font-bold tracking-widest text-xs md:text-sm animate-pulse pb-4">
          Press ENTER to cold-boot operating system _
        </div>
      </div>
    );
  }

  // --- RENDER 2: MS-DOS POST CHECK REBOOT ---
  return (
    <div className="fixed inset-0 bg-black text-gray-300 font-mono text-xs sm:text-sm p-6 sm:p-10 z-[9999] select-none w-full h-full overflow-hidden flex flex-col justify-start items-start gap-1.5 cursor-none uppercase">
      {biosLines.map((line, idx) => (
        <div key={idx} className="whitespace-pre-wrap leading-tight tracking-wider font-semibold text-left">
          {line}
        </div>
      ))}
    </div>
  );
}