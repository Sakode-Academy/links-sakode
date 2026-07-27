'use client';

import React, { useEffect, useState, useRef } from 'react';

export type CursorStyle = 
  | 'lens' 
  | 'meteor' 
  | 'minimal' 
  | 'crosshair' 
  | 'blob' 
  | 'code' 
  | 'sparkles' 
  | 'comet'
  | 'target'
  | 'default';

interface CustomCursorProps {
  theme?: 'dark' | 'light';
  cursorStyle?: CursorStyle;
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
  type?: 'dot' | 'star' | 'fire';
  rotation?: number;
}

export function CustomCursor({ theme = 'dark', cursorStyle = 'lens' }: CustomCursorProps) {
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [vel, setVel] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setMounted(true);

    const isTouch = typeof window !== 'undefined' && (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      window.matchMedia('(pointer: coarse)').matches ||
      window.innerWidth < 640
    );

    setIsTouchDevice(isTouch);

    if (isTouch || cursorStyle === 'default') {
      document.documentElement.classList.remove('custom-cursor-active');
      return;
    }

    document.documentElement.classList.add('custom-cursor-active');

    const canvas = canvasRef.current;
    let ctx: CanvasRenderingContext2D | null = null;
    let animId: number;
    const particles: Particle[] = [];
    const mouse = { x: -100, y: -100 };

    if (canvas) {
      ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const handleResize = () => {
      const recheckTouch = window.innerWidth < 640 || window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(recheckTouch);

      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const meteorColors = theme === 'light'
      ? ['#059669', '#10b981', '#0284c7', '#d97706', '#27272a']
      : ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b', '#ec4899'];

    const starColors = ['#f59e0b', '#fbbf24', '#fef08a', '#10b981', '#ec4899'];
    const fireColors = ['#f9723b', '#f94052', '#edac1c', '#ff409f'];

    const handleMouseMove = (e: MouseEvent) => {
      setVisible(true);
      const dx = e.clientX - mouse.x;
      const dy = e.clientY - mouse.y;
      const dist = Math.hypot(dx, dy);

      setVel({ x: dx, y: dy });
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });

      // Particles for 'meteor'
      if (cursorStyle === 'meteor') {
        const count = Math.min(Math.floor(dist / 3) + 1, 5);
        for (let i = 0; i < count; i++) {
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5;
          const speed = Math.random() * 1.2 + 0.4;
          const size = Math.random() * 2.5 + 1.5;
          const color = meteorColors[Math.floor(Math.random() * meteorColors.length)];

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
            type: 'dot',
          });
        }
      }

      // Particles for 'sparkles'
      if (cursorStyle === 'sparkles') {
        const count = Math.min(Math.floor(dist / 4) + 1, 3);
        for (let i = 0; i < count; i++) {
          const color = starColors[Math.floor(Math.random() * starColors.length)];
          particles.push({
            x: e.clientX + (Math.random() - 0.5) * 12,
            y: e.clientY + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 + 0.3,
            size: Math.random() * 4 + 3,
            maxSize: Math.random() * 4 + 3,
            alpha: 1,
            life: 0,
            maxLife: Math.random() * 22 + 18,
            color,
            type: 'star',
            rotation: Math.random() * Math.PI,
          });
        }
      }

      // Particles for 'comet'
      if (cursorStyle === 'comet') {
        const count = Math.min(Math.floor(dist / 2) + 1, 6);
        for (let i = 0; i < count; i++) {
          const color = fireColors[Math.floor(Math.random() * fireColors.length)];
          particles.push({
            x: e.clientX + (Math.random() - 0.5) * 6,
            y: e.clientY + (Math.random() - 0.5) * 6,
            vx: -dx * 0.15 + (Math.random() - 0.5) * 0.8,
            vy: -dy * 0.15 + (Math.random() - 0.5) * 0.8,
            size: Math.random() * 5 + 3,
            maxSize: Math.random() * 5 + 3,
            alpha: 0.9,
            life: 0,
            maxLife: Math.random() * 15 + 10,
            color,
            type: 'fire',
          });
        }
      }

      // Check hover
      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer');
        setIsHovered(!!clickable);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const render = () => {
      if (ctx && canvas && (cursorStyle === 'meteor' || cursorStyle === 'sparkles' || cursorStyle === 'comet')) {
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

          if (p.type === 'star') {
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation || 0) + p.life * 0.05);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            for (let s = 0; s < 4; s++) {
              ctx.lineTo(Math.cos((s * Math.PI) / 2) * p.size, Math.sin((s * Math.PI) / 2) * p.size);
              ctx.lineTo(Math.cos((s * Math.PI) / 2 + Math.PI / 4) * (p.size / 3), Math.sin((s * Math.PI) / 2 + Math.PI / 4) * (p.size / 3));
            }
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = p.type === 'fire' ? 10 : 6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [theme, cursorStyle]);

  if (!mounted || isTouchDevice || cursorStyle === 'default') return null;

  const isLight = theme === 'light';
  const speed = Math.min(Math.hypot(vel.x, vel.y), 40);

  return (
    <>
      {/* Particle Canvas */}
      {(cursorStyle === 'meteor' || cursorStyle === 'sparkles' || cursorStyle === 'comet') && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[99999]"
        />
      )}

      {visible && (
        <>
          {/* Main Pointer Dot */}
          {(cursorStyle === 'meteor' || cursorStyle === 'minimal' || cursorStyle === 'sparkles' || cursorStyle === 'comet') && (
            <div
              style={{
                transform: `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0) scale(${isClicked ? 0.6 : isHovered ? 1.4 : 1})`,
              }}
              className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[99999] transition-transform duration-75 ease-out ${
                cursorStyle === 'comet'
                  ? 'bg-amber-400 shadow-[0_0_12px_rgba(249,114,59,0.9)]'
                  : isLight ? 'bg-emerald-600' : 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]'
              }`}
            />
          )}

          {/* Follower Ring for Meteor, Minimal, Comet */}
          {(cursorStyle === 'meteor' || cursorStyle === 'minimal' || cursorStyle === 'comet') && (
            <div
              style={{
                transform: `translate3d(${pos.x - 16}px, ${pos.y - 16}px, 0) scale(${isClicked ? 0.8 : isHovered ? 1.5 : 1})`,
                borderColor: cursorStyle === 'comet'
                  ? 'rgba(249, 114, 59, 0.8)'
                  : isHovered 
                    ? isLight ? 'rgba(5, 150, 105, 0.85)' : 'rgba(16, 185, 129, 0.85)'
                    : isLight ? 'rgba(39, 39, 42, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isHovered
                  ? cursorStyle === 'comet' ? 'rgba(249, 114, 59, 0.1)' : isLight ? 'rgba(5, 150, 105, 0.08)' : 'rgba(16, 185, 129, 0.08)'
                  : 'transparent',
              }}
              className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[99999] transition-all duration-150 ease-out"
            />
          )}

          {/* Neon Crosshair */}
          {cursorStyle === 'crosshair' && (
            <>
              <div
                style={{
                  transform: `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0) scale(${isClicked ? 0.6 : isHovered ? 1.4 : 1})`,
                }}
                className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[99999] ${
                  isLight ? 'bg-emerald-600' : 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]'
                }`}
              />
              <div
                style={{
                  transform: `translate3d(${pos.x - 16}px, ${pos.y - 16}px, 0) scale(${isClicked ? 0.8 : isHovered ? 1.6 : 1}) rotate(${isHovered ? 90 : 0}deg)`,
                  borderColor: isHovered 
                    ? isLight ? 'rgba(5, 150, 105, 0.85)' : 'rgba(16, 185, 129, 0.85)'
                    : isLight ? 'rgba(39, 39, 42, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                }}
                className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[99999] transition-all duration-150 ease-out flex items-center justify-center"
              >
                <div className="relative w-full h-full flex items-center justify-center opacity-70">
                  <div className={`absolute w-full h-[1px] ${isLight ? 'bg-zinc-800' : 'bg-white'}`} />
                  <div className={`absolute h-full w-[1px] ${isLight ? 'bg-zinc-800' : 'bg-white'}`} />
                </div>
              </div>
            </>
          )}

          {/* Fluid Liquid Blob */}
          {cursorStyle === 'blob' && (
            <div
              style={{
                transform: `translate3d(${pos.x - 20}px, ${pos.y - 20}px, 0) scaleX(${1 + speed * 0.015}) scaleY(${1 - speed * 0.01}) rotate(${Math.atan2(vel.y, vel.x)}rad)`,
              }}
              className={`fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[99999] transition-transform duration-100 ease-out backdrop-blur-[2px] ${
                isLight
                  ? 'bg-emerald-500/25 border border-emerald-600/40'
                  : 'bg-emerald-500/30 border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
              }`}
            />
          )}

          {/* Magnifier Lens / Inverted Viewport */}
          {cursorStyle === 'lens' && (
            <div
              style={{
                transform: `translate3d(${pos.x - 24}px, ${pos.y - 24}px, 0) scale(${isClicked ? 0.8 : isHovered ? 1.5 : 1})`,
              }}
              className={`fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[99999] border-2 backdrop-invert transition-transform duration-100 ease-out flex items-center justify-center shadow-2xl ${
                isLight ? 'border-zinc-900 bg-white/20' : 'border-white bg-black/20'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          )}

          {/* Code Symbol < / > */}
          {cursorStyle === 'code' && (
            <div
              style={{
                transform: `translate3d(${pos.x + 10}px, ${pos.y + 10}px, 0) scale(${isHovered ? 1.15 : 1})`,
              }}
              className={`fixed top-0 left-0 px-2 py-1 rounded-md text-[11px] font-mono font-bold pointer-events-none z-[99999] border shadow-lg transition-transform duration-75 ease-out flex items-center gap-1 ${
                isLight
                  ? 'bg-zinc-900 border-zinc-700 text-emerald-400'
                  : 'bg-zinc-900/90 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
              }`}
            >
              <span>&lt;/&gt;</span>
            </div>
          )}

          {/* Sparkles Wand Center */}
          {cursorStyle === 'sparkles' && (
            <div
              style={{
                transform: `translate3d(${pos.x - 12}px, ${pos.y - 12}px, 0) scale(${isHovered ? 1.4 : 1})`,
              }}
              className="fixed top-0 left-0 w-6 h-6 rounded-full border border-amber-400/60 pointer-events-none z-[99999] transition-transform duration-100 ease-out flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            </div>
          )}

          {/* Radar Sonar Target */}
          {cursorStyle === 'target' && (
            <div
              style={{
                transform: `translate3d(${pos.x - 18}px, ${pos.y - 18}px, 0) scale(${isClicked ? 0.7 : isHovered ? 1.4 : 1})`,
              }}
              className={`fixed top-0 left-0 w-9 h-9 rounded-full border-2 border-dashed pointer-events-none z-[99999] animate-spin flex items-center justify-center ${
                isLight ? 'border-cyan-600' : 'border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
          )}
        </>
      )}
    </>
  );
}
