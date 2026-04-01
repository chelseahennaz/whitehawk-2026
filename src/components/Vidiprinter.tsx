import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VidiprinterProps {
  events: string[];
  isLive?: boolean;
}

const Vidiprinter = ({ events, isLive = false }: VidiprinterProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (events.length === 0) return;

    const currentEvent = events[currentIndex];
    let i = 0;
    setIsTyping(true);
    setDisplayText("");

    const typingInterval = setInterval(() => {
      if (i < currentEvent.length) {
        setDisplayText((prev) => prev + currentEvent.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // Wait and then move to next event if multiple exist
        if (events.length > 1) {
          setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
          }, 5000);
        }
      }
    }, 50); // Speed of "typing"

    return () => clearInterval(typingInterval);
  }, [currentIndex, events]);

  if (events.length === 0) return null;

  return (
    <div className="w-full bg-black py-3 px-4 overflow-hidden relative border-y border-white/10 group">
      {/* Background scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
      
      <div className="container mx-auto flex items-center gap-4 relative z-10">
        <div className="flex items-center gap-2 shrink-0">
          <div className={`w-2 h-2 rounded-full ${isLive ? "bg-red-600 animate-pulse" : "bg-muted-foreground"}`} />
          <span className="font-heading text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 leading-none">
            {isLive ? "Vidiprinter Live" : "Recent Update"}
          </span>
        </div>

        <div className="h-4 w-px bg-white/10 shrink-0" />

        <div className="flex-1 font-heading text-sm md:text-base font-black uppercase tracking-tight text-white/90 truncate flex items-center">
          <span className="inline-block whitespace-pre">
            {displayText}
          </span>
          {isTyping && (
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              className="inline-block w-2.5 h-4 bg-[#8e160b] ml-1 align-middle"
            />
          )}
        </div>

        {events.length > 1 && (
          <div className="hidden md:flex items-center gap-1 shrink-0">
             <span className="font-heading text-[9px] uppercase font-bold text-muted-foreground/40 tabular-nums">
               {currentIndex + 1} / {events.length}
             </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vidiprinter;
