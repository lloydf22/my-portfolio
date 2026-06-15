"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Cat() {
  const [posX, setPosX] = useState(200);
  const [posY, setPosY] = useState(300);
  const [sprite, setSprite] = useState("🐈"); // Default to full body
  const [isBobbing, setIsBobbing] = useState(false); // Controls stride movement physics
  const [bubbleText, setBubbleText] = useState<string | null>("Meow! Initializing cat.sys...");
  const [isFlipped, setIsFlipped] = useState(false);

  const targetX = useRef(200);
  const targetY = useRef(300);
  const stateTimer = useRef<number>(0);
  const currentAction = useRef<"IDLE" | "WALK" | "SLEEP">("IDLE");

  const catQuotes = [
    "Meow. Did you try clearing the cache buffer array?",
    "Purr... Your Tesla P40 GPU makes a fantastic space heater.",
    "ERROR: Coffee cup empty. Please patch immediate fluid leak.",
    "Calculus 3 vector fields look like great laser pointers to chase.",
    "Meow. I noticed your MotoBuddy PCB traces have excellent pathing.",
    "System Alert: I am stepping on your keyboard now. dsajklfhdsa"
  ];

  useEffect(() => {
    const initialBubble = setTimeout(() => setBubbleText(null), 4000);

    const petLoop = setInterval(() => {
      stateTimer.current += 1;

      // 1. Behavior State Machine AI
      if (stateTimer.current > 30) {
        stateTimer.current = 0;
        const rand = Math.random();
        
        if (rand < 0.4) {
          currentAction.current = "WALK";
          targetX.current = Math.random() * (window.innerWidth - 100) + 50;
          targetY.current = Math.random() * (window.innerHeight - 150) + 50;
          if (Math.random() < 0.3) {
            setBubbleText(catQuotes[Math.floor(Math.random() * catQuotes.length)]);
          }
        } else if (rand < 0.8) {
          currentAction.current = "IDLE";
          setBubbleText(null);
        } else {
          currentAction.current = "SLEEP";
          setBubbleText(null);
        }
      }

      // 2. Physics Movement & Frame Animation Updates
      if (currentAction.current === "WALK") {
        setPosX((prevX) => {
          const distance = targetX.current - prevX;
          if (Math.abs(distance) < 4) return prevX;
          setIsFlipped(distance < 0); 
          return prevX + (distance > 0 ? 3 : -3);
        });

        setPosY((prevY) => {
          const distance = targetY.current - prevY;
          if (Math.abs(distance) < 4) return prevY;
          return prevY + (distance > 0 ? 3 : -3);
        });

        // Alternates the step states smoothly without losing the cat's body structure
        setSprite("🐈");
        setIsBobbing((b) => !b);
      } else if (currentAction.current === "SLEEP") {
        setSprite("💤");
        setIsBobbing(false);
      } else {
        setSprite("🐈"); // Stationary full body when idling
        setIsBobbing(false);
      }

    }, 120); // Marginally optimized loop cadence for smoother step detection

    return () => {
      clearTimeout(initialBubble);
      clearInterval(petLoop);
    };
  }, []);

  return (
    <div 
      className="fixed pointer-events-auto select-none z-50 flex flex-col items-center transition-all duration-100 ease-linear"
      style={{ 
        left: `${posX}px`, 
        top: `${posY}px`,
      }}
    >
      {/* Retro Comic Dialogue Bubble */}
      {bubbleText && (
        <div className="bg-amber-100 text-black border border-black p-1.5 text-[10px] font-mono rounded shadow-md max-w-[140px] mb-1 relative animate-fade-in">
          {bubbleText}
          <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black" />
        </div>
      )}

      {/* Floating Animated Character Body Frame */}
      <div 
        className="text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-transform duration-100"
        style={{ 
          transform: `
            scaleX(${isFlipped ? -1 : 1}) 
            translateY(${isBobbing ? "-4px" : "0px"})
          ` // Moves the full model up and down matching footfalls to mimic true 8-bit pacing
        }}
      >
        {sprite}
      </div>
    </div>
  );
}