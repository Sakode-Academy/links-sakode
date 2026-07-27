'use client';

import React, { useEffect, useRef, useState } from 'react';

export type BackgroundStyle = 
  | 'constellation' 
  | 'grid' 
  | 'aurora' 
  | 'matrix' 
  | 'starfield' 
  | 'waveform' 
  | 'circuit'
  | 'vortex'
  | 'hexgrid'
  | 'raindrops';

interface BackgroundEffectsProps {
  theme?: 'dark' | 'light';
  bgStyle?: BackgroundStyle;
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  rgb: string;
}

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  chars: string[];
}

interface StarParticle {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
}

interface CircuitTrace {
  x: number;
  y: number;
  length: number;
  dir: 'h' | 'v';
  progress: number;
  speed: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export function BackgroundEffects({ theme = 'dark', bgStyle = 'constellation' }: BackgroundEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const isLight = theme === 'light';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Sakode Brand Color Palette
    const sakodePalette = [
      { hex: '#009670', rgb: '0, 150, 112' },   // Green
      { hex: '#ff409f', rgb: '255, 64, 159' }, // Pink
      { hex: '#71cffe', rgb: '113, 207, 254' }, // Cyan
      { hex: '#f9723b', rgb: '249, 114, 59' },  // Orange
      { hex: '#edac1c', rgb: '237, 172, 28' },  // Yellow
      { hex: '#54a5e4', rgb: '84, 165, 228' },  // Blue
      { hex: '#bc71fe', rgb: '188, 113, 254' }, // Purple
      { hex: '#f94052', rgb: '249, 64, 82' },   // Red
    ];

    // Setup for Constellation Web
    const nodes: NodePoint[] = [];
    const nodeCount = Math.floor(Math.min(window.innerWidth, 1400) / 20);
    for (let i = 0; i < nodeCount; i++) {
      const brandColor = sakodePalette[Math.floor(Math.random() * sakodePalette.length)];
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 2.0,
        color: brandColor.hex,
        rgb: brandColor.rgb,
      });
    }

    // Setup for Matrix Code
    const columns: MatrixColumn[] = [];
    const colCount = Math.floor(window.innerWidth / 24);
    const chars = '01SAKODE</>10';
    for (let i = 0; i < colCount; i++) {
      columns.push({
        x: i * 24,
        y: Math.random() * canvas.height,
        speed: Math.random() * 1.5 + 0.8,
        chars: Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]),
      });
    }

    // Setup for 3D Starfield
    const stars: StarParticle[] = [];
    const starCount = Math.floor(Math.min(window.innerWidth, 1200) / 10);
    for (let i = 0; i < starCount; i++) {
      const brandColor = sakodePalette[Math.floor(Math.random() * sakodePalette.length)];
      stars.push({
        x: (Math.random() - 0.5) * canvas.width * 2,
        y: (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * canvas.width,
        size: Math.random() * 1.5 + 0.8,
        color: brandColor.hex,
      });
    }

    // Setup for Circuit Board
    const circuits: CircuitTrace[] = [];
    const circuitCount = 35;
    for (let i = 0; i < circuitCount; i++) {
      const brandColor = sakodePalette[Math.floor(Math.random() * sakodePalette.length)];
      circuits.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 180 + 80,
        dir: Math.random() > 0.5 ? 'h' : 'v',
        progress: Math.random(),
        speed: Math.random() * 0.008 + 0.003,
        color: brandColor.hex,
      });
    }

    // Setup for Rain Ripples
    const ripples: Ripple[] = [];

    let mouseX = -1000;
    let mouseY = -1000;

    const handleCanvasMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (bgStyle === 'raindrops' && Math.random() > 0.6) {
        const brandColor = sakodePalette[Math.floor(Math.random() * sakodePalette.length)];
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 2,
          maxRadius: Math.random() * 35 + 25,
          alpha: 0.8,
          color: brandColor.hex,
        });
      }
    };

    window.addEventListener('mousemove', handleCanvasMouseMove);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      // --- Style 1: Thicker Multicolored Sakode Constellation Web ---
      if (bgStyle === 'constellation') {
        const lineDist = 140;

        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
          if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

          ctx.save();
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.shadowColor = n.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();

          const mDist = Math.hypot(n.x - mouseX, n.y - mouseY);
          if (mDist < 200) {
            const alpha = 0.65 * (1 - mDist / 200);
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(${n.rgb}, ${alpha})`;
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }

          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
            if (dist < lineDist) {
              const alpha = 0.35 * (1 - dist / lineDist);
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(n2.x, n2.y);

              const grad = ctx.createLinearGradient(n.x, n.y, n2.x, n2.y);
              grad.addColorStop(0, `rgba(${n.rgb}, ${alpha})`);
              grad.addColorStop(1, `rgba(${n2.rgb}, ${alpha})`);
              
              ctx.strokeStyle = grad;
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }
          }
        }
      }

      // --- Style 2: Matrix Code Rain ---
      if (bgStyle === 'matrix') {
        ctx.font = '12px monospace';

        for (let i = 0; i < columns.length; i++) {
          const col = columns[i];
          col.y += col.speed;
          if (col.y > canvas.height + 100) col.y = -100;

          const mDist = Math.hypot(col.x - mouseX, col.y - mouseY);
          const isNearMouse = mDist < 160;

          col.chars.forEach((char, idx) => {
            const py = col.y - idx * 16;
            if (py > 0 && py < canvas.height) {
              const alpha = (1 - idx / col.chars.length) * (isNearMouse ? 0.85 : 0.25);
              ctx.fillStyle = isNearMouse
                ? isLight ? `rgba(249, 114, 59, ${alpha})` : `rgba(255, 64, 159, ${alpha})`
                : isLight ? `rgba(0, 150, 112, ${alpha})` : `rgba(113, 207, 254, ${alpha})`;
              ctx.fillText(char, col.x, py);
            }
          });
        }
      }

      // --- Style 3: 3D Cosmic Starfield ---
      if (bgStyle === 'starfield') {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const speedMultiplier = (mouseX > 0 ? (mouseX - cx) / cx : 0) * 2;

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.z -= 1.5 + speedMultiplier;
          if (s.z <= 0) {
            s.z = canvas.width;
            s.x = (Math.random() - 0.5) * canvas.width * 2;
            s.y = (Math.random() - 0.5) * canvas.height * 2;
          }

          const k = 250 / s.z;
          const px = s.x * k + cx;
          const py = s.y * k + cy;

          if (px > 0 && px < canvas.width && py > 0 && py < canvas.height) {
            const size = Math.max(0.5, (1 - s.z / canvas.width) * s.size * 2.5);
            const alpha = Math.min(1, (1 - s.z / canvas.width) * 1.2);

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = s.color;
            ctx.shadowColor = s.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // --- Style 4: Cyber Waveform Optics ---
      if (bgStyle === 'waveform') {
        const waveCount = 5;
        const strokeColor = isLight ? 'rgba(0, 150, 112, 0.25)' : 'rgba(113, 207, 254, 0.3)';

        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          ctx.strokeStyle = w % 2 === 0 
            ? isLight ? 'rgba(255, 64, 159, 0.3)' : 'rgba(255, 64, 159, 0.4)'
            : strokeColor;
          ctx.lineWidth = 1.5;

          const baseHeight = canvas.height * (0.3 + w * 0.12);
          for (let x = 0; x < canvas.width; x += 15) {
            const mDist = Math.hypot(x - mouseX, baseHeight - mouseY);
            const warp = mDist < 200 ? (1 - mDist / 200) * 45 : 0;
            const y = baseHeight + Math.sin(x * 0.01 + time + w) * (20 + warp);

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // --- Style 5: Digital Circuit Trace Nodes ---
      if (bgStyle === 'circuit') {
        for (let i = 0; i < circuits.length; i++) {
          const c = circuits[i];
          c.progress += c.speed;
          if (c.progress > 1) {
            c.progress = 0;
            c.x = Math.random() * canvas.width;
            c.y = Math.random() * canvas.height;
          }

          const ex = c.dir === 'h' ? c.x + c.length : c.x;
          const ey = c.dir === 'h' ? c.y : c.y + c.length;

          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = isLight ? 'rgba(39, 39, 42, 0.15)' : 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          const px = c.dir === 'h' ? c.x + c.length * c.progress : c.x;
          const py = c.dir === 'h' ? c.y : c.y + c.length * c.progress;

          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = c.color;
          ctx.shadowColor = c.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        }
      }

      // --- Style 6: Galactic Spiral Vortex ---
      if (bgStyle === 'vortex') {
        const vRadius = 180;
        const pCount = 60;
        for (let i = 0; i < pCount; i++) {
          const angle = time * 0.8 + (i * Math.PI * 2) / pCount;
          const r = (vRadius * (i + 1)) / pCount;
          const px = mouseX + Math.cos(angle) * r;
          const py = mouseY + Math.sin(angle) * r;

          const color = sakodePalette[i % sakodePalette.length].hex;

          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        }
      }

      // --- Style 7: Cyber Hexagonal Hive ---
      if (bgStyle === 'hexgrid') {
        const hexSize = 30;
        const hexWidth = hexSize * Math.sqrt(3);
        const hexHeight = hexSize * 2;
        const cols = Math.ceil(canvas.width / hexWidth) + 1;
        const rows = Math.ceil(canvas.height / (hexHeight * 0.75)) + 1;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const hx = c * hexWidth + (r % 2 === 1 ? hexWidth / 2 : 0);
            const hy = r * hexHeight * 0.75;
            const dist = Math.hypot(hx - mouseX, hy - mouseY);

            if (dist < 220) {
              const alpha = (1 - dist / 220) * 0.6;
              ctx.beginPath();
              for (let a = 0; a < 6; a++) {
                const angle = (Math.PI / 3) * a;
                const px = hx + Math.cos(angle) * (hexSize - 2);
                const py = hy + Math.sin(angle) * (hexSize - 2);
                if (a === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.closePath();
              ctx.strokeStyle = isLight
                ? `rgba(0, 150, 112, ${alpha})`
                : `rgba(113, 207, 254, ${alpha})`;
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }
          }
        }
      }

      // --- Style 8: Neon Rain Ripples ---
      if (bgStyle === 'raindrops') {
        // Random ambient drops
        if (Math.random() > 0.92) {
          const brandColor = sakodePalette[Math.floor(Math.random() * sakodePalette.length)];
          ripples.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 2,
            maxRadius: Math.random() * 40 + 20,
            alpha: 0.75,
            color: brandColor.hex,
          });
        }

        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          rip.radius += 0.8;
          rip.alpha = 0.75 * (1 - rip.radius / rip.maxRadius);

          if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
            ripples.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
          ctx.strokeStyle = rip.color;
          ctx.shadowColor = rip.color;
          ctx.shadowBlur = 6;
          ctx.globalAlpha = rip.alpha;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleCanvasMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [theme, bgStyle]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      
      {/* --- Style 0: Interactive Grid Glow --- */}
      {bgStyle === 'grid' && (
        <>
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" 
          />
          <div
            style={{
              transform: `translate3d(${mousePos.x - 200}px, ${mousePos.y - 200}px, 0)`,
              background: isLight
                ? 'radial-gradient(circle, rgba(0, 150, 112, 0.1) 0%, rgba(0, 150, 112, 0) 70%)'
                : 'radial-gradient(circle, rgba(113, 207, 254, 0.15) 0%, rgba(113, 207, 254, 0) 70%)',
            }}
            className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none transition-transform duration-75 ease-out"
          />
        </>
      )}

      {/* --- Style 3: Ambient Aurora Mesh Waves --- */}
      {bgStyle === 'aurora' && (
        <div className="absolute inset-0 opacity-40">
          <div 
            style={{
              transform: `translate3d(${mousePos.x * 0.03}px, ${mousePos.y * 0.03}px, 0)`,
            }}
            className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] transition-transform duration-700 ease-out ${
              isLight ? 'bg-emerald-300/40' : 'bg-[#009670]/25'
            }`} 
          />
          <div 
            style={{
              transform: `translate3d(${-mousePos.x * 0.02}px, ${-mousePos.y * 0.02}px, 0)`,
            }}
            className={`absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full blur-[130px] transition-transform duration-700 ease-out ${
              isLight ? 'bg-cyan-300/40' : 'bg-[#71cffe]/25'
            }`} 
          />
          <div 
            style={{
              transform: `translate3d(${mousePos.x * 0.02}px, ${-mousePos.y * 0.03}px, 0)`,
            }}
            className={`absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full blur-[140px] transition-transform duration-700 ease-out ${
              isLight ? 'bg-pink-300/30' : 'bg-[#ff409f]/20'
            }`} 
          />
        </div>
      )}

      {/* Canvas for Constellation, Matrix, Starfield, Waveform, Circuit, Vortex, Hexgrid, & Raindrops */}
      {(bgStyle === 'constellation' || bgStyle === 'matrix' || bgStyle === 'starfield' || bgStyle === 'waveform' || bgStyle === 'circuit' || bgStyle === 'vortex' || bgStyle === 'hexgrid' || bgStyle === 'raindrops') && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}

    </div>
  );
}
