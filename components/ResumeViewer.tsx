"use client";

import React from "react";

export default function ResumeViewer() {
  return (
    <div className="bg-[#c0c0c0] text-black font-sans text-xs flex flex-col w-full">
      
      {/* MS Word 97 Styled Ribbon Bar Layer */}
      <div className="flex flex-col border-b border-gray-400 bg-[#c0c0c0] p-1 gap-1 select-none shrink-0 border-inset">
        <div className="flex gap-4 px-2 py-0.5 text-xs text-gray-800">
          <span className="hover:underline cursor-pointer">File</span>
          <span className="hover:underline cursor-pointer">Edit</span>
          <span className="hover:underline cursor-pointer">View</span>
          <span className="hover:underline cursor-pointer">Insert</span>
          <span className="hover:underline cursor-pointer">Format</span>
          <span className="hover:underline cursor-pointer">Tools</span>
        </div>
        <div className="flex items-center gap-2 px-1 py-1 border-t border-gray-300">
          <select className="bg-white border border-gray-400 font-mono text-[11px] px-1 h-5 w-28 outline-none" disabled>
            <option>Times New Roman</option>
          </select>
          <select className="bg-white border border-gray-400 font-mono text-[11px] px-1 h-5 w-12 outline-none" disabled>
            <option>10</option>
          </select>
          <div className="flex items-center border border-gray-400 bg-gray-200 px-1 gap-1.5 h-5 font-serif font-bold text-xs text-gray-600">
            <span className="px-1 cursor-default">B</span>
            <span className="px-1 cursor-default italic">I</span>
            <span className="px-1 cursor-default underline">U</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-400 mx-1" />
          <span className="text-[10px] text-gray-500 font-mono italic">Ian_Finley_Resume.doc (Read-Only)</span>
        </div>
      </div>

      {/* Page Workspace Frame Wrapper - Fixed pb-12 maintains charcoal gray deep past the document bounds */}
      <div className="bg-gray-600 p-4 pb-12 flex flex-col items-center w-full min-h-full">
        
        {/* The Mock A4 Letter Page Document */}
        <div className="w-full max-w-[700px] bg-white shadow-2xl p-6 md:p-10 text-black select-text text-left font-serif leading-relaxed min-h-[1050px] shrink-0 box-border">
          
          {/* Header Contact Block */}
          <div className="text-center space-y-1 border-b-2 border-black pb-4">
            <h1 className="text-2xl font-bold font-sans tracking-wide text-zinc-900 uppercase">Ian Finley</h1>
            <p className="text-xs font-sans tracking-wider text-zinc-600">
              Palm Coast, FL | (760) 518-1285 | lloydf22@gmail.com | linkedin.com/in/ian-finley-030828205
            </p>
            <p className="text-xs font-sans font-bold text-blue-900 tracking-widest uppercase pt-1">
              Technical &amp; Diagnostic Profile
            </p>
          </div>

          {/* Section: Professional Technical Profile Summary */}
          <div className="mt-5">
            {/* table-fixed layout forces text columns to wrap within their exact boundaries */}
            <table className="w-full table-fixed border-collapse font-sans text-xs text-zinc-800">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="font-bold w-[160px] py-1.5 pr-2 align-top text-blue-900 select-none">Systems &amp; IT Infrastructure:</td>
                  <td className="py-1.5 align-top break-words whitespace-normal text-justify pr-2">Full-stack website development, hardware provisioning, localized server architecture management, and client-side systems administration.</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="font-bold w-[160px] py-1.5 pr-2 align-top text-blue-900 select-none">Mechanical &amp; Electrical:</td>
                  <td className="py-1.5 align-top break-words whitespace-normal text-justify pr-2">Comprehensive experience in component-level teardowns, inspecting fluid/mechanical assemblies, and tracing complex diagnostic logic loops.</td>
                </tr>
                <tr>
                  <td className="font-bold w-[160px] py-1.5 pr-2 align-top text-blue-900 select-none">Instrumentation &amp; Tools:</td>
                  <td className="py-1.5 align-top break-words whitespace-normal text-justify pr-2">Hands-on experience with digital multimeters, oscilloscopes, precision hand tools, pressure gauges, and computerized diagnostic equipment.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section: Technical Hardware & IT Experience */}
          <div className="mt-6">
            <h2 className="text-sm font-sans font-bold uppercase tracking-wider bg-gray-100 px-1 border-l-4 border-blue-900 text-blue-900 select-none">
              Technical Hardware &amp; IT Experience
            </h2>
            
            {/* Experience item 1 */}
            <div className="mt-3">
              <div className="flex justify-between font-sans text-xs font-bold text-zinc-800">
                <span>IT &amp; SYSTEMS ADMINISTRATOR | Defense Technical Recruiting, LLC</span>
                <span>2021 - Present</span>
              </div>
              <p className="text-[11px] font-sans italic text-zinc-500">Remote / Palm Coast, FL</p>
              <ul className="list-disc pl-5 mt-1 text-xs text-zinc-800 space-y-1 text-justify">
                <li><strong>Full-Stack Development &amp; Deployment:</strong> Architected, built, and maintained the company website, optimization layouts, and server-side deployment modules to streamline recruitment funnels.</li>
                <li><strong>Hardware Provisioning &amp; Maintenance:</strong> Managed internal hardware lifecycle, configured secure network routing, optimized local systems architectures, and performed root-cause diagnostics on malfunctioning workstation gear.</li>
                <li><strong>Systems Engineering Support:</strong> Provided comprehensive tech support solutions, establishing zero-downtime operational baselines for essential software toolchains.</li>
              </ul>
            </div>

            {/* Experience item 2 */}
            <div className="mt-4">
              <div className="flex justify-between font-sans text-xs font-bold text-zinc-800">
                <span>AUTOMOTIVE TECHNICIAN / MECHANIC | Christian Brothers Automotive</span>
                <span>2018 - 2020</span>
              </div>
              <p className="text-[11px] font-sans italic text-zinc-500">Monument, CO</p>
              <ul className="list-disc pl-5 mt-1 text-xs text-zinc-800 space-y-1 text-justify">
                <li><strong>System Teardowns &amp; Reconditioning:</strong> Performed deep mechanical and electrical diagnostics, component-level disassemblies, and rebuilds on high-pressure fluid systems, braking assemblies, and complex engines.</li>
                <li><strong>Blueprint &amp; Schematic Navigation:</strong> Evaluated architectural wiring diagrams, mechanical blueprints, and technical factory manuals to isolate root-cause system drops and fluid-flow restrictions.</li>
                <li><strong>Calibration &amp; Testing:</strong> Calibrated electronic sensors, tested mechanical systems to operational baselines, and certified equipment safety before returning units to active service.</li>
              </ul>
            </div>
          </div>

          {/* Section: Hardware Diagnostic & Embedded Systems Developer */}
          <div className="mt-6">
            <h2 className="text-sm font-sans font-bold uppercase tracking-wider bg-gray-100 px-1 border-l-4 border-blue-900 text-blue-900 select-none">
              Hardware Diagnostic &amp; Embedded Systems Development
            </h2>

            <div className="mt-3">
              <ul className="list-disc pl-5 text-xs text-zinc-800 space-y-2 text-justify">
                <li><strong>Physical System Calibration &amp; Telemetry (MotoBuddy):</strong> Built custom embedded motorcycle telemetry companion utilizing IMU and GPS layers; successfully configured raw data inputs, balanced physical sensor calibration matrix loops, and debugged volatile hardware states.</li>
                <li><strong>Precision Hardware Integration (AI-Portal HUD):</strong> Assembled a unique head-up display using an ESP32-S3 microcontroller and custom transparent display panels; calculated tight optical alignment tolerances and executed precise structural integration based entirely on component datasheets.</li>
                <li><strong>Component-Level Circuit Repair (Hardware Recovery):</strong> Conducted a physical teardown and hardware-level repair on an Acer laptop motherboard following a drop impact; traced multi-layer board trace lines with a digital multimeter to isolate a broken backlight power loop, safely restoring full functionality.</li>
              </ul>
            </div>
          </div>

          {/* Section: Education & Training */}
          <div className="mt-6">
            <h2 className="text-sm font-sans font-bold uppercase tracking-wider bg-gray-100 px-1 border-l-4 border-blue-900 text-blue-900 select-none">
              Education &amp; Training
            </h2>
            <div className="mt-2 flex justify-between font-sans text-xs font-bold text-zinc-800">
              <span>FLORIDA INTERNATIONAL UNIVERSITY (FIU Online)</span>
              <span>Expected Graduation: Spring 2027</span>
            </div>
            <p className="text-xs font-sans italic text-zinc-600">Bachelor of Science in Computer Engineering</p>
            <p className="text-xs font-sans text-zinc-800 mt-1">
              <strong>Core Skill Development Focus:</strong> Advanced Circuit Logic, Signal Path Tracing, Physics for Engineers (Mechanics, Wave Motion, and Systems Analysis).
            </p>
          </div>

          {/* Section: Additional Employment */}
          <div className="mt-6 border-t border-gray-300 pt-3">
            <div className="flex justify-between font-sans text-xs font-bold text-zinc-800">
              <span>SERVER | Golden Lion Cafe</span>
              <span>2025 - Present</span>
            </div>
            <p className="text-[11px] font-sans italic text-zinc-500">Flagler Beach, FL</p>
            <p className="text-xs text-zinc-800 mt-0.5 text-justify">
              Manage high-volume shift logistics and maintain rapid problem-solving capabilities under intense pressure conditions while coordinating floor operations with cross-functional staff.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}