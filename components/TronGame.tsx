"use client";

import React, { useState, useEffect } from "react";

interface TronGameProps {
  onClose: () => void;
}

interface GameState {
  player: { x: number; y: number };
  ai: { x: number; y: number };
  // TRACKING MAP: Stores coordinate strings mapped directly to who generated them
  trails: Record<string, "player" | "ai">; 
  status: string;
  statusColor: string;
  isLoopRunning: boolean;
}

export default function TronGame({ onClose }: TronGameProps) {
  const gridWidth = 32;
  const gridHeight = 18;

  const [gameState, setGameState] = useState<GameState>({
    player: { x: 5, y: 9 },
    ai: { x: 26, y: 9 },
    trails: { "5,9": "player", "26,9": "ai" }, // Register initial starting tiles
    status: "GRID_ACTIVE",
    statusColor: "text-cyan-400",
    isLoopRunning: true,
  });

  const [playerDir, setPlayerDir] = useState<{ x: number; y: number }>({ x: 1, y: 0 });
  const [aiDir, setAiDir] = useState<{ x: number; y: number }>({ x: -1, y: 0 });

  useEffect(() => {
    if (!gameState.isLoopRunning) return;

    const frameTick = setInterval(() => {
      setGameState((prevState) => {
        const nextPlayerPos = {
          x: prevState.player.x + playerDir.x,
          y: prevState.player.y + playerDir.y,
        };

        // AI Logic
        let nextAiDir = aiDir;
        const directions = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        
        const currentAiNextX = prevState.ai.x + nextAiDir.x;
        const currentAiNextY = prevState.ai.y + nextAiDir.y;
        const aiNeedsToTurn = 
          currentAiNextX < 0 || currentAiNextX >= gridWidth || 
          currentAiNextY < 0 || currentAiNextY >= gridHeight || 
          prevState.trails[`${currentAiNextX},${currentAiNextY}`] !== undefined;

        if (aiNeedsToTurn || Math.random() < 0.15) {
          const safeRoutes = directions.filter((d) => {
            const tx = prevState.ai.x + d.x;
            const ty = prevState.ai.y + d.y;
            return (
              tx >= 0 && tx < gridWidth && 
              ty >= 0 && ty < gridHeight && 
              prevState.trails[`${tx},${ty}`] === undefined &&
              !(d.x === -nextAiDir.x && d.y === -nextAiDir.y)
            );
          });
          
          if (safeRoutes.length > 0) {
            nextAiDir = safeRoutes[Math.floor(Math.random() * safeRoutes.length)];
            setAiDir(nextAiDir);
          }
        }

        const nextAiPos = {
          x: prevState.ai.x + nextAiDir.x,
          y: prevState.ai.y + nextAiDir.y,
        };

        const pKey = `${nextPlayerPos.x},${nextPlayerPos.y}`;
        const aKey = `${nextAiPos.x},${nextAiPos.y}`;

        // Verify collisions against the key map
        const playerCrashed = 
          nextPlayerPos.x < 0 || nextPlayerPos.x >= gridWidth || 
          nextPlayerPos.y < 0 || nextPlayerPos.y >= gridHeight || 
          prevState.trails[pKey] !== undefined;

        const aiCrashed = 
          nextAiPos.x < 0 || nextAiPos.x >= gridWidth || 
          nextAiPos.y < 0 || nextAiPos.y >= gridHeight || 
          prevState.trails[aKey] !== undefined;

        const headOnCollision = nextPlayerPos.x === nextAiPos.x && nextPlayerPos.y === nextAiPos.y;

        if (headOnCollision || (playerCrashed && aiCrashed)) {
          return {
            ...prevState,
            status: "💥 KINETIC COLLISION: MUTUAL DESTRUCTION",
            statusColor: "text-yellow-500 animate-pulse",
            isLoopRunning: false,
          };
        } else if (playerCrashed) {
          return {
            ...prevState,
            status: "💀 PLAYER JET CRASHED: AI PROGRAM WINS",
            statusColor: "text-red-500",
            isLoopRunning: false,
          };
        } else if (aiCrashed) {
          return {
            ...prevState,
            status: "🏆 AI LIGHT TRAIL INTERCEPTED: YOU WIN!",
            statusColor: "text-green-400 font-bold",
            isLoopRunning: false,
          };
        }

        // Write explicit trail ownership records
        const updatedTrails = { ...prevState.trails };
        updatedTrails[pKey] = "player";
        updatedTrails[aKey] = "ai";

        return {
          ...prevState,
          player: nextPlayerPos,
          ai: nextAiPos,
          trails: updatedTrails,
        };
      });
    }, 110);

    return () => clearInterval(frameTick);
  }, [gameState.isLoopRunning, playerDir, aiDir]);

  // Keyboard Hooks
  useEffect(() => {
    const handleKeyInputs = (e: KeyboardEvent) => {
      if (!gameState.isLoopRunning) return;
      switch (e.key.toLowerCase()) {
        case "w": case "arrowup":
          if (playerDir.y !== 1) setPlayerDir({ x: 0, y: -1 });
          break;
        case "s": case "arrowdown":
          if (playerDir.y !== -1) setPlayerDir({ x: 0, y: 1 });
          break;
        case "a": case "arrowleft":
          if (playerDir.x !== 1) setPlayerDir({ x: -1, y: 0 });
          break;
        case "d": case "arrowright":
          if (playerDir.x !== -1) setPlayerDir({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener("keydown", handleKeyInputs);
    return () => window.removeEventListener("keydown", handleKeyInputs);
  }, [gameState.isLoopRunning, playerDir]);

  const resetGridArena = () => {
    setPlayerDir({ x: 1, y: 0 });
    setAiDir({ x: -1, y: 0 });
    setGameState({
      player: { x: 5, y: 9 },
      ai: { x: 26, y: 9 },
      trails: { "5,9": "player", "26,9": "ai" },
      status: "GRID_ACTIVE",
      statusColor: "text-cyan-400",
      isLoopRunning: true,
    });
  };

  return (
    <div className="bg-[#0b0c10] text-white font-mono p-4 w-full h-[480px] flex flex-col justify-between items-center box-border border-2 border-black select-none">
      
      <div className="w-full flex justify-between font-bold text-[10px] text-[#00ffff] border-b border-[#00ffff]/20 pb-1.5 uppercase tracking-wider shrink-0">
        <span>📟 NODE: TRON_LIGHT_CYCLE_SECTOR</span>
        <span className={`font-mono text-[11px] ${gameState.statusColor}`}>{gameState.status}</span>
      </div>

      <div 
        className="grid bg-black border-2 border-[#00ffff]/30 rounded my-2 p-0.5 w-full max-w-[560px]"
        style={{
          gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
          aspectRatio: `${gridWidth}/${gridHeight}`
        }}
      >
        {Array.from({ length: gridHeight }).map((_, y) => (
          Array.from({ length: gridWidth }).map((_, x) => {
            const isPlayer = gameState.player.x === x && gameState.player.y === y;
            const isAi = gameState.ai.x === x && gameState.ai.y === y;
            const coordinateKey = `${x},${y}`;
            
            // Look up ownership explicitly from the dictionary state
            const trailOwner = gameState.trails[coordinateKey];

            let cellColor = "bg-zinc-950/20";
            if (isPlayer) cellColor = "bg-cyan-400 scale-105 border border-white shadow-lg shadow-cyan-400/50";
            else if (isAi) cellColor = "bg-orange-500 scale-105 border border-white shadow-lg shadow-orange-500/50";
            else if (trailOwner === "player") {
              cellColor = "bg-cyan-950/70 border-[0.5px] border-cyan-900";
            } else if (trailOwner === "ai") {
              cellColor = "bg-orange-950/70 border-[0.5px] border-orange-900";
            }

            return <div key={`${x}-${y}`} className={`aspect-square ${cellColor}`} />;
          })
        ))}
      </div>

      <div className="w-full flex gap-3 justify-between items-center text-[#c0c0c0] pt-2 border-t border-zinc-900 text-[10px] uppercase font-sans shrink-0">
        <span className="tracking-wide">🎮 Controls: W,A,S,D / Arrow Keys</span>
        <div className="flex gap-2 font-mono">
          <button onClick={resetGridArena} className="px-2.5 py-1 text-[10px] bg-zinc-800 text-white font-bold border border-outset border-zinc-600 cursor-pointer active:border-inset hover:bg-zinc-700">🔄 Cycle Re-Crank</button>
          <button onClick={onClose} className="px-2.5 py-1 text-[10px] bg-red-950 text-red-400 font-bold border border-outset border-red-900 cursor-pointer active:border-inset hover:bg-red-900 hover:text-white">⏹️ Abort Grid</button>
        </div>
      </div>
    </div>
  );
}