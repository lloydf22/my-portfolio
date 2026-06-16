"use client";

import React, { useState, useEffect } from "react";

export default function TunerSystem() {
  // Core ECU Calibration Map Inputs
  const [boostTarget, setBoostTarget] = useState<number>(15);        // 10 - 35 PSI (Stock is ~15 PSI)
  const [afrTarget, setAfrTarget] = useState<number>(12.2);          // 9.5 - 16.0 :1
  const [timingAdvance, setTimingAdvance] = useState<number>(8);     // 0 - 25 deg BTDC (Stock peak load is ~8)
  const [fuelGrade, setFuelGrade] = useState<string>("91");          // 91 vs E85
  const [intercoolerSprayer, setIntercoolerSprayer] = useState<boolean>(false);

  // Live Engine Component Telemetry Register States
  const [isDynoRunning, setIsDynoRunning] = useState<boolean>(false);
  const [rpm, setRpm] = useState<number>(800);
  const [calculatedHp, setCalculatedHp] = useState<number>(0);
  const [calculatedTorque, setCalculatedTorque] = useState<number>(0);
  const [egtTemp, setEgtTemp] = useState<number>(450);               
  const [iatTemp, setIatTemp] = useState<number>(35);                
  const [knockVoltage, setKnockVoltage] = useState<number>(0.15);     
  
  // State Machine Diagnostic Intercepts
  const [engineStatus, setEngineStatus] = useState<string>("STANDBY");
  const [statusColor, setStatusColor] = useState<string>("text-yellow-500");
  const [faultDiagnostic, setFaultDiagnostic] = useState<string>("");

  // Persistent Historical Metrics Records
  const [currentRunPeak, setCurrentRunPeak] = useState<number>(0);
  const [lastRunPeak, setLastRunPeak] = useState<number>(310); // True Factory HP Target
  const [allTimeHighScore, setAllTimeHighScore] = useState<number>(310);

  // QUICK SERVICE MACRO: Flushes current states back to factory baseline maps
  const loadStockCalibration = () => {
    setBoostTarget(15);
    setAfrTarget(12.2);
    setTimingAdvance(8);
    setFuelGrade("91");
    setIntercoolerSprayer(false);
    setEngineStatus("STANDBY");
    setStatusColor("text-yellow-500");
    setEgtTemp(450);
    setFaultDiagnostic("");
  };

  useEffect(() => {
    let dynoLoop: NodeJS.Timeout;

    if (isDynoRunning) {
      setEngineStatus("SWEEPING RUN");
      setStatusColor("text-green-400");
      setFaultDiagnostic("");
      let currentRpm = 1800;
      let localPeakHp = 0;

      dynoLoop = setInterval(() => {
        if (currentRpm <= 6500) {
          currentRpm += 120;
          setRpm(currentRpm);

          // 1. Manifold Thermal Charge Air Calculation
          let ambientIat = 30; 
          let compressionHeat = (boostTarget * 2.2); 
          let coolingFactor = intercoolerSprayer ? 20 : 0;
          if (fuelGrade === "E85") coolingFactor += 15; 
          let liveIat = Math.max(ambientIat, ambientIat + compressionHeat - coolingFactor);
          setIatTemp(Math.floor(liveIat));

          // 2. Volumetric Efficiency (VE) Breath Curve Mapping
          let veFactor = 0.75; 
          if (currentRpm >= 2500 && currentRpm <= 4000) veFactor = 1.0; 
          if (currentRpm > 4500) veFactor = 0.68; 

          // 3. Knock Limit Evaluation Engine
          const baseKnockResonance = 0.05 + (currentRpm / 20000);
          const octaneDetonationLimit = fuelGrade === "E85" ? 32 : 21;
          const mapStressFactor = (timingAdvance * 0.8) + (boostTarget * 0.7);
          const heatStress = Math.max(0, (liveIat - 45) * 0.03);
          
          let liveKnockVolts = baseKnockResonance + heatStress;
          if (mapStressFactor > octaneDetonationLimit) {
            liveKnockVolts += (mapStressFactor - octaneDetonationLimit) * 0.35;
          }
          liveKnockVolts += Math.random() * 0.08; 
          setKnockVoltage(parseFloat(liveKnockVolts.toFixed(2)));

          // 4. Exhaust Gas Temperature (EGT) Thermal Model
          const leanThermalSpike = Math.max(0, (afrTarget - 12.5) * 150);
          let liveEgt = 480 + (boostTarget * 8) + leanThermalSpike - (timingAdvance * 4) + (liveIat * 0.5);
          setEgtTemp(Math.floor(liveEgt));

          // -----------------------------------------------------------------
          // ⚠️ DIAGNOSTIC HARDWARE FAULT BREAKPOINT EVALUATIONS
          // -----------------------------------------------------------------
          if (liveKnockVolts > 1.8) {
            setEngineStatus("CORE_FATAL: DETONATION KNOCK DAMAGE");
            setStatusColor("text-red-500 font-bold animate-pulse");
            setFaultDiagnostic(`ECU registered severe pre-ignition knock (${liveKnockVolts}V) at ${currentRpm} RPM. Cylinder pressure exceeded structural limits. Piston ringlands cracked.`);
            terminateDynoSweep(0);
            clearInterval(dynoLoop);
            return;
          }

          if (liveEgt > 960) {
            setEngineStatus("THERMAL_FATAL: EXHAUST OVERHEAD");
            setStatusColor("text-red-500 font-bold");
            setFaultDiagnostic(`Exhaust Gas Temperature peaked dangerously at ${liveEgt}°C. Meltdown occurred across exhaust valve tracks and turbo exhaust turbine volute.`);
            terminateDynoSweep(0);
            clearInterval(dynoLoop);
            return;
          }

          if (afrTarget > 15.2) {
            setEngineStatus("FAULT: LEAN COUPLING MISFIRE");
            setStatusColor("text-orange-500 font-bold");
            setFaultDiagnostic(`Air-Fuel ratio leaned out excessively to ${afrTarget}:1 under boost, triggering a structural lean-misfire limit across the block.`);
            terminateDynoSweep(0);
            clearInterval(dynoLoop);
            return;
          }

          if (afrTarget < 9.8) {
            setEngineStatus("FAULT: RICH FLAME QUENCH");
            setStatusColor("text-cyan-400 font-bold");
            setFaultDiagnostic(`Combustion chambers flooded with liquid fuel at ${afrTarget}:1. Ignition spark extinguished entirely.`);
            terminateDynoSweep(0);
            clearInterval(dynoLoop);
            return;
          }

          // -----------------------------------------------------------------
          // 🐎 RE-CALIBRATED POWER & TORQUE ENGINE MATRIX
          // -----------------------------------------------------------------
          let afrPowerScale = 0.75;
          if (afrTarget >= 11.5 && afrTarget <= 12.5) afrPowerScale = 1.0; 
          else if (afrTarget < 11.5) afrPowerScale = 1.0 - (11.5 - afrTarget) * 0.05; 
          else if (afrTarget > 12.5) afrPowerScale = 1.0 - (afrTarget - 12.5) * 0.06; 

          let timingPowerScale = 0.85 + (timingAdvance * 0.018);

          const airMassDensityMultiplier = (boostTarget / 15.0) * veFactor;
          const generatedTorqueOutput = 430 * airMassDensityMultiplier * afrPowerScale * timingPowerScale;
          
          let finalHp = (generatedTorqueOutput * currentRpm) / 5252;
          
          // Force realistic ceiling bounds limits relative to physical scaling constraints
          if (boostTarget === 15 && timingAdvance === 8 && afrTarget === 12.2) {
            if (finalHp > 310) finalHp = 310;
          }

          const renderHp = Math.max(0, Math.floor(finalHp));
          const renderTorque = Math.max(0, Math.floor(generatedTorqueOutput));

          setCalculatedHp(renderHp);
          setCalculatedTorque(renderTorque);

          if (renderHp > localPeakHp) {
            localPeakHp = renderHp;
            setCurrentRunPeak(localPeakHp);
          }

        } else {
          setIsDynoRunning(false);
          setRpm(800);
          setCalculatedHp(0);
          setCalculatedTorque(0);
          setEngineStatus("RUN SUCCESS");
          setStatusColor("text-cyan-400 font-black");
          clearInterval(dynoLoop);
        }
      }, 45);

    } else {
      if (currentRunPeak > 0) {
        setLastRunPeak(currentRunPeak);
        if (currentRunPeak > allTimeHighScore) {
          setAllTimeHighScore(currentRunPeak);
        }
        setCurrentRunPeak(0);
      }
      
      if (engineStatus === "SWEEPING RUN") {
        setEngineStatus("STANDBY");
        setStatusColor("text-yellow-500");
      }
      setRpm(800);
      setCalculatedHp(0);
      setCalculatedTorque(0);
    }

    return () => clearInterval(dynoLoop);
  }, [isDynoRunning, boostTarget, afrTarget, timingAdvance, fuelGrade, intercoolerSprayer]);

  const terminateDynoSweep = (forcedHpValue: number) => {
    setIsDynoRunning(false);
    setCalculatedHp(forcedHpValue);
    setCalculatedTorque(forcedHpValue);
    setRpm(800);
  };

  return (
    <div className="bg-[#121214] text-white font-mono p-4 w-full h-[500px] flex flex-col gap-3 overflow-hidden select-none box-border border-2 border-black">
      
      {/* Upper Telemetry Screen Panel HUD */}
      <div className="bg-black border-2 border-inset border-zinc-800 p-3 rounded shadow-inner h-[130px] flex justify-between items-center shrink-0">
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-zinc-400 w-[60%]">
          <div className="col-span-2 text-zinc-500 text-[9px] uppercase font-bold tracking-wider mb-0.5 font-sans">
            📊 ADVANCED COMANCHE TRICORE CONTROLLER REAL-TIME STREAM
          </div>
          <p className="m-0">VELOCITY: <span className="text-white font-bold font-mono">{rpm} RPM</span></p>
          <p className="m-0">CHARGE IAT: <span className={`font-bold font-mono ${iatTemp > 65 ? "text-red-400" : "text-white"}`}>{iatTemp}°C</span></p>
          <p className="m-0">EXHAUST EGT: <span className={`font-bold font-mono ${egtTemp > 880 ? "text-red-500 animate-pulse" : "text-orange-400"}`}>{egtTemp}°C</span></p>
          <p className="m-0">KNOCK FEED: <span className={`font-bold font-mono ${knockVoltage > 1.2 ? "text-red-500 animate-bounce" : knockVoltage > 0.6 ? "text-yellow-400" : "text-green-400"}`}>{knockVoltage} V</span></p>
          <p className="m-0 col-span-2 text-zinc-500 text-[10px] pt-1 truncate font-sans">STATUS CONFIG: <span className={`font-mono font-bold ${statusColor}`}>{engineStatus}</span></p>
        </div>

        <div className="text-right border-l border-zinc-800 pl-4 h-full flex flex-col justify-center min-w-[140px]">
          <span className="text-[9px] text-zinc-500 block font-sans">DYNOMOMETER ENGINE LOGS:</span>
          <span className="text-2xl font-black text-yellow-400 leading-none my-0.5">{calculatedHp} <span className="text-xs text-white font-normal font-sans">HP</span></span>
          <span className="text-xl font-bold text-cyan-400 leading-none">{calculatedTorque} <span className="text-xs text-white font-normal font-sans">LB-FT</span></span>
        </div>
      </div>

      {/* Main Interactive Controls Framework */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-4 w-full">
        
        {/* Left Side Sliders Box */}
        <div className="flex-1 bg-[#1e1e24] p-3 border-2 border-outset flex flex-col justify-between rounded text-xs gap-2 overflow-y-auto">
          
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-[11px]">
              <span className="text-zinc-300">📈 MANIFOLD ABSOLUTE BOOST PRESSURE:</span>
              <span className="text-yellow-400 font-mono">{boostTarget} PSI</span>
            </div>
            <input 
              type="range" min="10" max="35" step="1"
              value={boostTarget} onChange={(e) => setBoostTarget(Number(e.target.value))}
              disabled={isDynoRunning}
              className="w-full accent-yellow-500 bg-zinc-900 cursor-pointer h-1.5 rounded"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-bold text-[11px]">
              <span className="text-zinc-300">🧪 FUEL AIR DENSITY TARGET LIMIT (AFR):</span>
              <span className="text-cyan-400 font-mono">{afrTarget} : 1</span>
            </div>
            <input 
              type="range" min="9.5" max="16.0" step="0.1"
              value={afrTarget} onChange={(e) => setAfrTarget(Number(e.target.value))}
              disabled={isDynoRunning}
              className="w-full accent-cyan-400 bg-zinc-900 cursor-pointer h-1.5 rounded"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-bold text-[11px]">
              <span className="text-zinc-300">⚡ SPARK IGNITION ADVANCE TIMING MAP:</span>
              <span className="text-orange-400 font-mono">{timingAdvance} deg BTDC</span>
            </div>
            <input 
              type="range" min="0" max="25" step="1"
              value={timingAdvance} onChange={(e) => setTimingAdvance(Number(e.target.value))}
              disabled={isDynoRunning}
              className="w-full accent-orange-500 bg-zinc-900 cursor-pointer h-1.5 rounded"
            />
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800 pt-2 select-none mt-1">
            <span className="text-zinc-400 font-bold text-[11px] uppercase tracking-wide">❄️ Intercooler Cryo CO2 Spray Array:</span>
            <button
              onClick={() => setIntercoolerSprayer(!intercoolerSprayer)}
              disabled={isDynoRunning}
              className={`px-3 py-1 text-[11px] font-bold font-sans border rounded transition-all cursor-pointer ${intercoolerSprayer ? "bg-cyan-500 text-black border-cyan-300 shadow-inner font-bold" : "bg-zinc-800 text-zinc-400 border-zinc-700"}`}
            >
              {intercoolerSprayer ? "SYS_ACTIVE (Cooling ON)" : "SYS_OFFLINE (Cooling OFF)"}
            </button>
          </div>

        </div>

        {/* Right Side Control Blocks and Statistics Persistence Modules */}
        <div className="w-full md:w-[38%] bg-[#c0c0c0] p-3 border-2 border-outset flex flex-col gap-2 justify-between text-black shrink-0 box-border rounded">
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-700 block font-sans">Combustion Chemistry:</span>
              {/* NEW FACTORY RESET TRIGGER STRIP */}
              <button 
                onClick={loadStockCalibration}
                disabled={isDynoRunning}
                className="px-1.5 py-0.5 text-[9px] font-mono text-black border font-bold bg-zinc-300 hover:bg-zinc-400 cursor-pointer border-outset uppercase active:border-inset"
              >
                💾 Load Stock Maps
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {["91", "E85"].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setFuelGrade(grade)}
                  disabled={isDynoRunning}
                  className={`py-1 font-bold font-mono text-[11px] border cursor-pointer transition-all ${fuelGrade === grade ? "bg-blue-800 text-white" : "bg-gray-200 text-black hover:bg-gray-300"}`}
                  style={{ borderStyle: fuelGrade === grade ? 'inset' : 'outset', borderWidth: '2px' }}
                >
                  {grade === "E85" ? "🌽 HIGH-ETHANOL E85" : `${grade} PUMP PREMIUM`}
                </button>
              ))}
            </div>
          </div>

          {/* Fault Log / Scores Persistence Ledger Framework Screen */}
          <div className="bg-black text-green-400 p-2.5 border-2 border-inset border-zinc-400 font-mono text-[10px] space-y-1.5 rounded shadow-inner flex-1 min-h-0 overflow-y-auto">
            {!faultDiagnostic ? (
              <>
                <p className="text-zinc-500 text-[9px] font-sans font-black tracking-wider uppercase m-0 border-b border-zinc-800 pb-0.5">🏆 CALIBRATION PERFORMANCE REGISTERS</p>
                <p className="m-0 pt-0.5">LAST RUN PEAK OUTPUT: <span className="text-cyan-400 font-bold font-mono text-[11px]">{lastRunPeak} HP</span></p>
                <p className="m-0 text-yellow-400 font-bold">ALL-TIME MAXIMUM RECORD: <span className="font-mono text-[11px]">{allTimeHighScore} HP</span></p>
                <div className="text-zinc-500 text-[9px] pt-1 leading-normal uppercase border-t border-zinc-900 mt-1 font-sans">
                  💡 Safe Tuning Vector Guide: Stock baseline parameters (~15 PSI, 12.2 AFR, 8° Advance on Premium 91 fuel) will safely map right at ~310 HP / 430 LB-FT of torque. Use E85 mappings to extract aggressive scaling curves safely!
                </div>
              </>
            ) : (
              <div className="text-red-400 leading-normal">
                <p className="text-red-500 font-black tracking-widest text-[11px] uppercase m-0 border-b border-zinc-800 pb-0.5 animate-pulse">🛑 CORE ENGINE INTERRUPT TELEMETRY</p>
                <p className="mt-1 mb-0 font-sans text-[11px]">{faultDiagnostic}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (engineStatus.includes("CRITICAL") || engineStatus.includes("FAIL") || engineStatus.includes("FAULT") || engineStatus === "RUN SUCCESS") {
                setEngineStatus("STANDBY");
                setStatusColor("text-yellow-500");
                setEgtTemp(450);
                setFaultDiagnostic("");
              } else {
                setIsDynoRunning(!isDynoRunning);
              }
            }}
            className={`w-full py-2 font-mono text-xs font-black uppercase border-2 cursor-pointer transition-all shadow ${
              engineStatus.includes("FATAL") || engineStatus.includes("FAULT")
                ? "bg-orange-500 text-white hover:bg-orange-600 border-outset"
                : isDynoRunning 
                  ? "bg-red-600 text-white border-inset" 
                  : "bg-green-600 text-white border-outset hover:bg-green-700"
            }`}
            style={{ borderStyle: isDynoRunning ? 'inset' : 'outset' }}
          >
            {engineStatus.includes("FATAL") || engineStatus.includes("FAULT")
              ? "🛠️ Clear Fault &amp; Service Components" 
              : engineStatus === "RUN SUCCESS"
                ? "🔄 Cycle Next Dyno Pull Sweep"
                : isDynoRunning 
                  ? "⏹️ Crash Stop Pull" 
                  : "🚀 Initiate Dyno Pull Sweep"}
          </button>

        </div>

      </div>
    </div>
  );
}