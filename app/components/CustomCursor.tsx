'use client';

import React, { useEffect, useState, useRef } from 'react';

export type CursorStyle = 'meteor' | 'minimal' | 'crosshair' | 'default';

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
}

export function CustomCursor({ theme = 'dark', cursorStyle = 'meteor' }: CustomCursorProps) {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setMounted(true);

    if (cursorStyle === 'default') {
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
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const colors = theme === 'light'
      ? ['#059669', '#10b981', '#0284c7', '#d97706', '#27272a']
      : ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b', '#ec4899'];

    const handleMouseMove = (e: MouseEvent) => {
      setVisible(true);
      const dx = e.clientX - mouse.x;
      const dy = e.clientY - mouse.y;
      const dist = Math.hypot(dx, dy);

      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });

      // Spawn meteor tail particles if style === 'meteor'
      if (cursorStyle === 'meteor') {
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
      if (ctx && canvas && cursorStyle === 'meteor') {
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

  if (!mounted || cursorStyle === 'default') return null;

  const isLight = theme === 'light';

  return (
    <>
      {/* Meteor Canvas */}
      {cursorStyle === 'meteor' && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[99999]"
        />
      )}

      {/* Custom Cursor Overlay (standard CSS transform for guaranteed rendering) */}
      {visible && (
        <>
          {/* Inner Dot Cursor */}
          <div
            style={{
              transform: `translate3d(${pos.x - (cursorStyle === 'crosshair' ? 3 : 4)}px, ${pos.y - (cursorStyle === 'crosshair' ? 3 : 4)}px, 0) scale(${isClicked ? 0.6 : isHovered ? 1.4 : 1})`,
            }}
            className={`fixed top-0 left-0 rounded-full pointer-events-none z-[99999] transition-transform duration-75 ease-out ${
              cursorStyle === 'crosshair' ? 'w-1.5 h-1.5' : 'w-2 h-2'
            } ${
              isLight ? 'bg-emerald-600' : 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]'
            }`}
          />

          {/* Outer Follower Ring / Crosshair */}
          <div
            style={{
              transform: `translate3d(${pos.x - 16}px, ${pos.y - 16}px, 0) scale(${isClicked ? 0.8 : isHovered ? 1.5 : 1}) rotate(${cursorStyle === 'crosshair' && isHovered ? 90 : 0}deg)`,
              borderColor: isHovered 
                ? isLight ? 'rgba(5, 150, 105, 0.85)' : 'rgba(16, 185, 129, 0.85)'
                : isLight ? 'rgba(39, 39, 42, 0.4)' : 'rgba(255, 255, 255, 0.4)',
              backgroundColor: isHovered
                ? isLight ? 'rgba(5, 150, 105, 0.08)' : 'rgba(16, 185, 129, 0.08)'
                : 'transparent',
            }}
            className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[99999] transition-all duration-150 ease-out flex items-center justify-center"
          >
            {cursorStyle === 'crosshair' && (
              <div className="relative w-full h-full flex items-center justify-center opacity-70">
                <div className={`absolute w-full h-[1px] ${isLight ? 'bg-zinc-800' : 'bg-white'}`} />
                <div className={`absolute h-full w-[1px] ${isLight ? 'bg-zinc-800' : 'bg-white'}`} />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
