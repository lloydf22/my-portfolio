"use client";

import React, { useState } from "react";

interface ProjectItem {
  id: string;
  title: string;
  tag: string;
  date: string;
  description: string;
  tech: string[];
  specs: Record<string, string>;
}

export default function Projects() {
  const [activeProject, setActiveProject] = useState<string>("motobuddy");

  const engineeringPortfolio: ProjectItem[] = [
    {
      id: "motobuddy",
      title: "MotoBuddy Telemetry Core",
      tag: "Embedded Systems / PCB Design",
      date: "2026",
      description: "A custom physical telemetry logging device and digital companion for dual-sport motorcycles. Utilizes an ESP32 host microcontroller to aggregate raw IMU motion coordinates and GPS spatial data streams. Features a custom PCB trace-routed circuit layer with hardened power regulators to survive harsh off-road tracking conditions.",
      tech: ["ESP32", "C++ / FreeRTOS", "KiCad", "GPS/IMU Sensor Fusion"],
      specs: {
        "MCU Host": "ESP32-WROOM-32E (Dual-Core @ 240MHz)",
        "Sensor Array": "MPU6050 Accelerometer/Gyro + NEO-M8N GPS",
        "Storage Matrix": "SPI MicroSD Card Raw Binary Frame Logging",
        "Power Stage": "Automotive 12V down to 3.3V Buck-Regulator Layer"
      }
    },
    {
      id: "xr650l",
      title: "XR650L Digital Dual-Sport Dash",
      tag: "Hardware Integration / Firmware",
      date: "2026",
      description: "A ruggedized, custom digital instrumentation cluster engineered specifically for a restored 1996 Honda XR650L. Intercepts mechanical tire rotations and raw engine pulse points via custom-built signal conditioning circuits. Replaces fragile stock hardware with a sunlight-readable UI map optimized for trail riding, sand paths, and street transit.",
      tech: ["Embedded C", "Optocoupler Isolation", "SPI Displays", "3D Prototyping"],
      specs: {
        "Target Platform": "1996 Honda XR650L Dual-Sport",
        "Display System": "Ultra-Bright Anti-Glare SPI LCD Panel",
        "Signal Isolation": "Optocoupled Transistor Loop for Ignition RPM",
        "Enclosure Matrix": "Resin 3D Printed Weatherproof Shell Case"
      }
    },
    {
      id: "lineup",
      title: "LineUp Restaurant Full-Suite Ecosystem",
      tag: "Full-Stack Software Architecture",
      date: "2025",
      description: "A comprehensive, enterprise-grade hospitality management system. Features an active terminal Point-of-Sale (POS) cashier window, a low-latency Kitchen Display System (KDS) order pipeline, an interactive employee portal for team workflows, an admin analytics module for financial logging, and a backend management terminal framework.",
      tech: ["Next.js / React", "Firebase v10", "Firestore DB", "Cloud Functions"],
      specs: {
        "Data Pipeline": "Firebase Snapshot Listeners (Instant KDS Push)",
        "Database Matrix": "Firestore NoSQL Document Model Architecture",
        "Admin Analytics": "Cloud Functions for Aggregating Revenue Metrics",
        "Access Controls": "Firebase Auth with Role-Based Claim Structures"
      }
    }
  ];

  const selected = engineeringPortfolio.find((p) => p.id === activeProject) || engineeringPortfolio[0];

  return (
    <div className="bg-[#c0c0c0] p-2 text-black font-mono text-xs flex flex-col h-full min-h-[400px]">
      
      {/* Vintage Explorer Tab Rows */}
      <div className="flex border-b border-gray-400 gap-1 select-none overflow-x-auto shrink-0">
        {engineeringPortfolio.map((proj) => {
          const isActive = proj.id === activeProject;
          return (
            <button
              key={proj.id}
              onClick={() => setActiveProject(proj.id)}
              className={`px-3 py-1 text-xs truncate border-t border-x rounded-t-sm focus:outline-none transition-all cursor-pointer font-sans ${
                isActive
                  ? "bg-white font-bold border-gray-600 -mb-[1px] z-10"
                  : "bg-gray-300 border-gray-400 text-gray-600 hover:bg-gray-200"
              }`}
              style={{ borderBottom: isActive ? "1px solid white" : "none" }}
            >
              {proj.id === "motobuddy" ? "📁 MotoBuddy.sys" : proj.id === "xr650l" ? "📁 XR650L_Dash.bin" : "📁 LineUp_Suite.app"}
            </button>
          );
        })}
      </div>

      {/* Main File Contents Interface Block */}
      <div className="flex-1 bg-white border-2 border-inset border-gray-600 p-3 overflow-y-auto flex flex-col md:flex-row gap-4">
        
        {/* Left Side: Details Metadata */}
        <div className="flex-1 space-y-3 select-text">
          <div>
            <h2 className="text-base font-bold text-blue-900 border-b border-gray-300 pb-1 font-sans">
              {selected.title}
            </h2>
            <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-2">
              <span>{selected.tag}</span> | <span>Timeline: {selected.date}</span>
            </div>
          </div>

          <p className="leading-relaxed text-gray-800 text-xs text-justify">
            {selected.description}
          </p>

          <div>
            <span className="font-bold text-gray-700 block mb-1">Compiled Framework Tech Stack:</span>
            <div className="flex flex-wrap gap-1.5">
              {selected.tech.map((t, idx) => (
                <span key={idx} className="bg-gray-200 text-gray-800 border border-gray-400 px-1.5 py-0.5 text-[10px] rounded shadow-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: System Operational Spec Box */}
        <div className="w-full md:w-[220px] bg-gray-100 border border-gray-400 p-2 shrink-0 select-text flex flex-col justify-start">
          <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white px-1.5 py-0.5 font-bold tracking-wider text-[10px] uppercase font-sans mb-2">
            System Hardware Specs
          </div>
          <div className="space-y-2.5">
            {Object.entries(selected.specs).map(([key, value], idx) => (
              <div key={idx} className="border-b border-gray-200 pb-1.5 last:border-none">
                <span className="text-[10px] text-zinc-500 block uppercase font-sans tracking-wide">
                  {key}
                </span>
                <span className="text-black font-bold text-[11px] block mt-0.5 leading-tight">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}