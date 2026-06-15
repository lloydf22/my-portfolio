"use client";

import React, { useEffect, useRef, useState } from "react";

const CANVAS_SIZE = 320;
const TILE_SIZE = 32; 
const SPEED = 3;

interface Enemy {
  x: number;
  y: number;
  dir: number; // 0: Up, 1: Right, 2: Down, 3: Left
  isDead: boolean;
}

interface Crate {
  x: number;
  y: number;
  isBroken: boolean;
}

interface RoomData {
  grid: number[][]; 
  enemies: Enemy[];
  crates: Crate[];
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(3);
  const [gameState, setGameState] = useState<"PLAYING" | "GLITCHING" | "GAME_OVER" | "VICTORY">("PLAYING");

  const roomX = useRef<number>(1);
  const roomY = useRef<number>(0); 

  const pX = useRef<number>(144);
  const pY = useRef<number>(250);
  const pDir = useRef<number>(0); 
  const isAttacking = useRef<boolean>(false);
  const attackFrame = useRef<number>(0);

  // Track coordinates to safely fall back to if tagged by a monster
  const lastSafeX = useRef<number>(144);
  const lastSafeY = useRef<number>(250);

  const keys = useRef<{ [key: string]: boolean }>({});
  const animationRef = useRef<number>(0);
  const glitchTimer = useRef<number>(0);

  const dungeonMap = useRef<Record<string, RoomData>>({
    // Start Area: Safe straight hallway leading up
    "1,0": {
      grid: [
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
      enemies: [], crates: []
    },
    // Intersection T-Junction Fork Choice Room
    "1,1": {
      grid: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
      ],
      enemies: [
        { x: 110, y: 80, dir: 1, isDead: false },
        { x: 200, y: 80, dir: 3, isDead: false }
      ], 
      crates: []
    },
    // Left Secret Loop: Trap dead-end branching lane with breakable crates
    "0,1": {
      grid: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
      enemies: [
        { x: 140, y: 110, dir: 0, isDead: false },
        { x: 200, y: 80, dir: 2, isDead: false }
      ],
      crates: [
        { x: 48, y: 48, isBroken: false },
        { x: 48, y: 80, isBroken: false }
      ]
    },
    // Right Pathway leading up to the final treasure chamber
    "2,1": {
      grid: [
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
      enemies: [{ x: 100, y: 80, dir: 1, isDead: false }],
      crates: [{ x: 260, y: 80, isBroken: false }]
    },
    // Final Sanctum Room: Holds the Gold Treasure chalice goal block
    "2,2": {
      grid: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
      ],
      enemies: [
        { x: 80, y: 140, dir: 1, isDead: false },
        { x: 240, y: 140, dir: 3, isDead: false }
      ],
      crates: []
    }
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD", "KeyW", "KeyS", "Space"].includes(e.code)) {
        e.preventDefault(); keys.current[e.code] = true;
      }
      if (e.code === "Space" && !isAttacking.current && gameState === "PLAYING") {
        isAttacking.current = true; attackFrame.current = 8;
      }
    };
    const up = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;

    const checkWallCollision = (grid: number[][], x: number, y: number, radius: number = 6) => {
      const checkPoints = [
        { x: x - radius, y: y - radius },
        { x: x + radius, y: y - radius },
        { x: x - radius, y: y + radius },
        { x: x + radius, y: y + radius }
      ];
      for (const pt of checkPoints) {
        const gridC = Math.floor(pt.x / TILE_SIZE);
        const gridR = Math.floor(pt.y / TILE_SIZE);
        if (gridC < 0 || gridC > 9 || gridR < 0 || gridR > 9) continue; 
        if (grid[gridR][gridC] === 1) return true;
      }
      return false;
    };

    const gameLoop = () => {
      const activeKey = `${roomX.current},${roomY.current}`;
      const currentRoom = dungeonMap.current[activeKey];
      if (!currentRoom) return;

      // --- ADVANCED CRT MONITOR TERMINAL STATIC GLITCH MODE ---
      if (gameState === "GLITCHING") {
        glitchTimer.current++;

        // 1. Render true programmatic analog noise static buffer array
        const noiseData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
        const data = noiseData.data;
        for (let i = 0; i < data.length; i += 4) {
          const noiseValue = Math.floor(Math.random() * 255);
          data[i] = noiseValue;     // Red
          data[i+1] = noiseValue;   // Green
          data[i+2] = noiseValue;   // Blue
          data[i+3] = 255;          // Opacity Alpha Channel
        }
        ctx.putImageData(noiseData, 0, 0);

        // 2. Inject horizontal tearing lines
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        for (let j = 0; j < CANVAS_SIZE; j += Math.floor(Math.random() * 30) + 10) {
          ctx.fillRect(0, j + Math.sin(glitchTimer.current), CANVAS_SIZE, Math.floor(Math.random() * 4) + 1);
        }

        if (glitchTimer.current > 40) {
          setGameState("GAME_OVER");
        } else {
          animationRef.current = requestAnimationFrame(gameLoop);
        }
        return;
      }

      // 1. FLOOR & MAP RENDERING
      ctx.fillStyle = "#111111"; ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const tile = currentRoom.grid[r][c];
          const tx = c * TILE_SIZE; const ty = r * TILE_SIZE;
          if (tile === 1) {
            ctx.fillStyle = "#3a3a42"; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = "#222228"; ctx.strokeRect(tx, ty, TILE_SIZE, TILE_SIZE);
          } else if (tile === 2) {
            ctx.fillStyle = "#ffd700"; ctx.fillRect(tx + 6, ty + 6, TILE_SIZE - 12, TILE_SIZE - 12);
          } else {
            ctx.fillStyle = "#1a1a1f"; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          }
        }
      }

      // 2. RENDERING WOOD CRATES
      currentRoom.crates.forEach((crate) => {
        if (crate.isBroken) return;
        ctx.fillStyle = "#8b5a2b"; ctx.fillRect(crate.x - 10, crate.y - 10, 20, 20);
        ctx.strokeStyle = "#5c3a1a"; ctx.strokeRect(crate.x - 10, crate.y - 10, 20, 20);
      });

      // 3. PLAYER PHYSICS VECTOR LOOPS
      let dx = 0; let dy = 0;
      if (keys.current["ArrowUp"] || keys.current["KeyW"]) { dy = -SPEED; pDir.current = 0; }
      else if (keys.current["ArrowRight"] || keys.current["KeyD"]) { dx = SPEED; pDir.current = 1; }
      else if (keys.current["ArrowDown"] || keys.current["KeyS"]) { dy = SPEED; pDir.current = 2; }
      else if (keys.current["ArrowLeft"] || keys.current["KeyA"]) { dx = -SPEED; pDir.current = 3; }

      const nextPX = pX.current + dx;
      const nextPY = pY.current + dy;

      if (!checkWallCollision(currentRoom.grid, nextPX, nextPY)) {
        pX.current = nextPX; pY.current = nextPY;
      }

      // 4. WEAPON SWING ATTACK HITBOX REGISTERS
      let wx = pX.current; let wy = pY.current;
      if (isAttacking.current && attackFrame.current > 0) {
        attackFrame.current--;
        ctx.fillStyle = "#00ffff"; 
        if (pDir.current === 0) { wy -= 18; ctx.fillRect(wx - 2, wy, 4, 14); }
        if (pDir.current === 1) { wx += 8;  ctx.fillRect(wx, wy - 2, 14, 4); }
        if (pDir.current === 2) { wy += 8;  ctx.fillRect(wx - 2, wy, 4, 14); }
        if (pDir.current === 3) { wx -= 18; ctx.fillRect(wx, wy - 2, 14, 4); }
        
        currentRoom.crates.forEach((crate) => {
          if (!crate.isBroken && Math.hypot(wx - crate.x, wy - crate.y) < 18) {
            crate.isBroken = true; setScore((p) => p + 50); 
            setHearts((h) => Math.min(3, h + 1)); 
          }
        });
      } else { isAttacking.current = false; }

      // 5. ENEMY PHYSICS CONTROLLER (NOW ENFORCING WALL BOUNDARIES)
      currentRoom.enemies.forEach((enemy) => {
        if (enemy.isDead) return;

        let edx = 0; let edy = 0;
        const enemySpeed = 1.0;

        if (Math.random() < 0.02) enemy.dir = Math.floor(Math.random() * 4);
        if (enemy.dir === 0) edy = -enemySpeed;
        if (enemy.dir === 1) edx = enemySpeed;
        if (enemy.dir === 2) edy = enemySpeed;
        if (enemy.dir === 3) edx = -enemySpeed;

        const nextEX = enemy.x + edx;
        const nextEY = enemy.y + edy;

        if (!checkWallCollision(currentRoom.grid, nextEX, nextEY, 6)) {
          enemy.x = nextEX; enemy.y = nextEY;
        } else {
          enemy.dir = Math.floor(Math.random() * 4); // Pivot instantly on hit
        }

        ctx.fillStyle = "#9400d3"; ctx.fillRect(enemy.x - 6, enemy.y - 6, 12, 12); 

        if (isAttacking.current && Math.hypot(wx - enemy.x, wy - enemy.y) < 16) {
          enemy.isDead = true; setScore((p) => p + 200); 
        }

        // MONSTER CONTACT TARGET DAMAGE LOOP
        if (Math.hypot(pX.current - enemy.x, pY.current - enemy.y) < 12) {
          // Bounce right back safely to the specific cached doorway pathway anchor
          pX.current = lastSafeX.current;
          pY.current = lastSafeY.current;
          
          setHearts((h) => {
            const next = h - 1;
            if (next <= 0) {
              setGameState("GLITCHING");
              glitchTimer.current = 0;
            }
            return next;
          });
        }
      });

      // 6. WINNING CHALICE BLOCK DETECTION
      if (currentRoom.grid[Math.floor(pY.current / TILE_SIZE)]?.[Math.floor(pX.current / TILE_SIZE)] === 2) {
        setScore((p) => p + 1000); setGameState("VICTORY"); return;
      }

      // 7. RIGID ROOM DOORWAY OVERRIDE TRANSITION ENGINE
      // Explicitly calculates pathway safe center points to completely eradicate wall spawning loops
      let roomChanged = false;
      if (pY.current < 4) { roomY.current++; pY.current = CANVAS_SIZE - 24; roomChanged = true; }
      else if (pY.current > CANVAS_SIZE - 4) { roomY.current--; pY.current = 24; roomChanged = true; }
      else if (pX.current > CANVAS_SIZE - 4) { roomX.current++; pX.current = 24; roomChanged = true; }
      else if (pX.current < 4) { roomX.current--; pX.current = CANVAS_SIZE - 24; roomChanged = true; }

      if (roomChanged) {
        const nextKey = `${roomX.current},${roomY.current}`;
        
        // --- EXPLICIT DOOR PATHWAY LANDING TRACKS ---
        if (nextKey === "1,0") { pX.current = 144; } // Entrance hallway path alignment
        else if (nextKey === "1,1") {
          // T-Junction: Align based on coming from bottom corridor or side passages
          if (pY.current > CANVAS_SIZE - 40) { pX.current = 144; } // Coming from below
          else { pY.current = 80; } // Coming from Left or Right channels
        }
        else if (nextKey === "0,1") { pX.current = CANVAS_SIZE - 24; pY.current = 80; } // Safe path slot for secret room
        else if (nextKey === "2,1") { pX.current = 24; pY.current = 80; }               // Safe path slot for right approach
        else if (nextKey === "2,2") { pX.current = 144; pY.current = CANVAS_SIZE - 24; } // Safe center path spot for boss cell
        
        // Lock this verified location down as our new relative respawn sanctuary
        lastSafeX.current = pX.current;
        lastSafeY.current = pY.current;
      }

      // 8. RENDER PLAYER CORE CHAMPION MODEL
      ctx.fillStyle = "#ffd700"; ctx.beginPath(); ctx.arc(pX.current, pY.current, 7, 0, Math.PI * 2); ctx.fill();

      // 9. TORCHLIGHT RADIAL LANTERN CONE SHROUD
      const torchGradient = ctx.createRadialGradient(pX.current, pY.current, 10, pX.current, pY.current, 65);
      torchGradient.addColorStop(0, "rgba(0,0,0,0)");      
      torchGradient.addColorStop(0.4, "rgba(0,0,0,0.25)");  
      torchGradient.addColorStop(1, "rgba(0,0,0,0.98)");   
      ctx.fillStyle = torchGradient; ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      if (gameState === "PLAYING") { animationRef.current = requestAnimationFrame(gameLoop); }
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState]);

  const resetGame = () => {
    Object.keys(dungeonMap.current).forEach((key) => {
      dungeonMap.current[key].enemies.forEach(e => e.isDead = false);
      dungeonMap.current[key].crates.forEach(c => c.isBroken = false);
    });
    roomX.current = 1; roomY.current = 0;
    pX.current = 144; pY.current = 250; pDir.current = 0;
    lastSafeX.current = 144; lastSafeY.current = 250;
    setScore(0); setHearts(3); setGameState("PLAYING");
  };

  return (
    <div className="bg-black p-3 font-mono text-white flex flex-col items-center justify-center w-full min-h-[420px] select-none">
      
      {/* Top Telemetry Display */}
      <div className="w-full flex justify-between px-2 mb-2 text-xs text-red-500 border-b border-gray-900 pb-1 font-bold">
        <span>VITAL_REG: {Array(hearts).fill("❤️").join("") || "☠️"}</span>
        <span className="text-yellow-400">SCORE: {score}</span>
      </div>

      {/* Main Playing Frame Canvas Space */}
      <div className="relative border-4 border-[#c0c0c0] bg-black shadow-inner flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="block" />

        {/* --- DYNAMIC RETRO GAME OVER PANEL WITH BROKEN HEART DESIGN --- */}
        {gameState === "GAME_OVER" && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-3 p-4">
            
            {/* Custom styled pixel-grid layout representation of a broken heart symbol art */}
            <div className="text-red-500 text-5xl font-mono select-none font-bold animate-pulse leading-none mb-1">
              💔
            </div>
            
            <h2 className="text-red-600 font-bold text-base tracking-widest uppercase select-none">SYSTEM FAILURE</h2>
            <p className="text-gray-500 text-[10px] text-center max-w-[180px] select-none">Core metrics flatlined. Connection severed.</p>
            
            <div className="flex flex-col gap-2 w-44 mt-3">
              <button 
                onClick={resetGame} 
                className="px-4 py-1.5 bg-[#c0c0c0] hover:bg-gray-300 border-2 border-white text-black font-bold text-xs cursor-pointer active:border-inset shadow-sm"
                style={{ borderStyle: 'outset', borderWidth: '2px' }}
              >
                RETRY CYCLE
              </button>
            </div>
          </div>
        )}

        {/* Victory End Screen Panel */}
        {gameState === "VICTORY" && (
          <div className="absolute inset-0 bg-blue-900/90 flex flex-col items-center justify-center gap-3 p-4">
            <h2 className="text-yellow-400 font-bold text-xl tracking-widest">🏆 MISSION COMPLETION 🏆</h2>
            <p className="text-white text-xs max-w-[220px]">Chalice retrieved. +1,000 baseline score bonus register applied successfully!</p>
            <div className="text-green-400 text-sm font-bold border border-green-500 p-1 bg-black">FINAL SCORE: {score}</div>
            <button onClick={resetGame} className="mt-2 px-4 py-1 bg-yellow-500 text-black font-bold text-xs border border-white cursor-pointer">RUN CYCLE AGAIN</button>
          </div>
        )}
      </div>

      <div className="text-center mt-3 text-[10px] text-gray-500 max-w-[280px] leading-relaxed">
        Steer character vectors using <span className="text-gray-300 font-bold">W/A/S/D / Arrows</span>. Press <span className="text-cyan-400 font-bold">SPACEBAR</span> to slash monsters or break wooden crates.
      </div>
    </div>
  );
}