'use client';

import React from 'react';

interface BackgroundEffectsProps {
  theme: 'obsidian' | 'neon' | 'emerald' | 'glass';
}

export function BackgroundEffects({ theme }: BackgroundEffectsProps) {
  let orb1 = 'from-cyan-600/25 via-blue-600/15 to-transparent';
  let orb2 = 'from-emerald-500/20 via-teal-600/10 to-transparent';
  let orb3 = 'from-indigo-600/25 via-purple-600/15 to-transparent';

  if (theme === 'neon') {
    orb1 = 'from-fuchsia-600/30 via-pink-600/15 to-transparent';
    orb2 = 'from-violet-600/25 via-purple-600/10 to-transparent';
    orb3 = 'from-cyan-500/20 via-blue-500/10 to-transparent';
  } else if (theme === 'emerald') {
    orb1 = 'from-emerald-600/30 via-teal-600/15 to-transparent';
    orb2 = 'from-green-500/25 via-emerald-600/10 to-transparent';
    orb3 = 'from-cyan-600/20 via-slate-600/10 to-transparent';
  } else if (theme === 'glass') {
    orb1 = 'from-sky-300/30 via-blue-200/20 to-transparent';
    orb2 = 'from-teal-300/25 via-emerald-200/15 to-transparent';
    orb3 = 'from-indigo-300/25 via-purple-200/15 to-transparent';
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" 
      />

      {/* Floating Animated Orbs */}
      <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br ${orb1} blur-[120px] animate-pulse`} style={{ animationDuration: '8s' }} />
      <div className={`absolute top-[40%] right-[-15%] w-[550px] h-[550px] rounded-full bg-gradient-to-br ${orb2} blur-[140px] animate-pulse`} style={{ animationDuration: '10s' }} />
      <div className={`absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-br ${orb3} blur-[150px] animate-pulse`} style={{ animationDuration: '12s' }} />
    </div>
  );
}
