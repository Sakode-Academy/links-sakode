'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface CustomCursorProps {
  theme?: 'dark' | 'light';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

export function CustomCursor({ theme = 'dark' }: CustomCursorProps) {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    setEnabled(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const mouse = { x: -100, y: -100 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const colors = theme === 'light'
      ? ['#059669', '#10b981', '#0284c7', '#d97706', '#27272a']
      : ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b', '#ec4899'];

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouse.x;
      const dy = e.clientY - mouse.y;
      const dist = Math.hypot(dx, dy);

      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });

      // Spawn meteor tail particles
      const count = Math.min(Math.floor(dist / 3) + 1, 5);
      for (let i = 0; i < count; i++) {
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 1.2 + 0.4;
        const size = Math.random() * 2.5 + 1.5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 4,
          y: e.clientY + (Math.random() - 0.5) * 4,
          vx: -Math.cos(angle) * speed + (Math.random() - 0.5) * 0.4,
          vy: -Math.sin(angle) * speed + (Math.random() - 0.5) * 0.4,
          size,
          maxSize: size,
          alpha: 0.9,
          life: 0,
          maxLife: Math.random() * 18 + 18,
          color,
        });
      }

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = target.closest('a, button, input, [role="button"], .cursor-pointer');
        setIsHovered(!!clickable);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;
        p.size = p.maxSize * p.alpha;

        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  if (!enabled) return null;

  const isLight = theme === 'light';

  return (
    <>
      {/* Meteor Tail Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
      />

      {/* Inner Dot Cursor */}
      <motion.div
        animate={{
          x: pos.x - 4,
          y: pos.y - 4,
          scale: isClicked ? 0.6 : isHovered ? 1.4 : 1,
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 50, mass: 0.1 }}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-50 ${
          isLight ? 'bg-emerald-600' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
        }`}
      />

      {/* Outer Spring Follower Ring */}
      <motion.div
        animate={{
          x: pos.x - 16,
          y: pos.y - 16,
          scale: isClicked ? 0.8 : isHovered ? 1.6 : 1,
          borderColor: isHovered 
            ? isLight ? 'rgba(5, 150, 105, 0.8)' : 'rgba(16, 185, 129, 0.8)'
            : isLight ? 'rgba(39, 39, 42, 0.3)' : 'rgba(255, 255, 255, 0.3)',
          backgroundColor: isHovered
            ? isLight ? 'rgba(5, 150, 105, 0.08)' : 'rgba(16, 185, 129, 0.08)'
            : 'rgba(0, 0, 0, 0)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.5 }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-50"
      />
    </>
  );
}
