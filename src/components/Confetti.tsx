import React from "react";
import { motion } from "motion/react";

interface Particle {
  id: number;
  x: number; // initial horizontal offset in vw
  delay: number; // animation delay
  duration: number; // animation duration
  color: string;
  size: number;
  rotate: number;
}

export const Confetti: React.FC = () => {
  const colors = [
    "#f59e0b", // Amber
    "#eab308", // Yellow
    "#10b981", // Emerald
    "#3b82f6", // Blue
    "#ec4899", // Pink
    "#8b5cf6", // Purple
    "#f97316"  // Orange
  ];

  // Generate 80 random confetti pieces
  const particles: Particle[] = Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // 0vw to 100vw
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 4, // 3s to 7s
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 6 + Math.random() * 12, // 6px to 18px
    rotate: Math.random() * 360
  }));

  return (
    <div id="confetti-overlay" className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            y: -20,
            x: `${p.x}vw`,
            rotate: p.rotate,
            scale: 0.5
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: "105vh",
            rotate: p.rotate + 360 + Math.random() * 360,
            scale: [0.5, 1, 1, 0.5]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute rounded-sm"
          style={{
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size * (0.6 + Math.random() * 0.8)}px`,
            boxShadow: `0 2px 8px ${p.color}55`
          }}
        />
      ))}
    </div>
  );
};
