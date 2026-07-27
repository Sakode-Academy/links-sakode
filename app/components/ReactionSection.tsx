'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Flame, Rocket, Lightbulb, Sparkles } from 'lucide-react';

interface Reaction {
  id: string;
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

export function ReactionSection() {
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    love: 248,
    fire: 189,
    rocket: 312,
    idea: 156,
  });

  const [clicked, setClicked] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sakode_reactions');
      if (saved) {
        setReactions(JSON.parse(saved));
      }
    } catch {
      // ignore fallback
    }
  }, []);

  const handleReaction = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    const newCount = (reactions[id] || 0) + 1;
    const updated = { ...reactions, [id]: newCount };
    setReactions(updated);
    setClicked((prev) => ({ ...prev, [id]: true }));

    try {
      localStorage.setItem('sakode_reactions', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Trigger confetti explosion from click location
    confetti({
      particleCount: 25,
      spread: 45,
      startVelocity: 25,
      origin: { x, y },
    });

    setTimeout(() => {
      setClicked((prev) => ({ ...prev, [id]: false }));
    }, 400);
  };

  const reactionList = [
    {
      id: 'love',
      icon: <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />,
      label: 'Suka',
      color: 'text-pink-400',
      bgColor: 'hover:bg-pink-500/20 bg-pink-500/10',
      borderColor: 'border-pink-500/30',
    },
    {
      id: 'fire',
      icon: <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />,
      label: 'Semangat',
      color: 'text-orange-400',
      bgColor: 'hover:bg-orange-500/20 bg-orange-500/10',
      borderColor: 'border-orange-500/30',
    },
    {
      id: 'rocket',
      icon: <Rocket className="w-4 h-4 fill-cyan-400 text-cyan-400" />,
      label: 'Maju Terus',
      color: 'text-cyan-300',
      bgColor: 'hover:bg-cyan-500/20 bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
    },
    {
      id: 'idea',
      icon: <Lightbulb className="w-4 h-4 fill-amber-400 text-amber-400" />,
      label: 'Keren',
      color: 'text-amber-300',
      bgColor: 'hover:bg-amber-500/20 bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
  ];

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full max-w-md mx-auto mt-8 p-4 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-xl text-center">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3 px-1">
        <span className="flex items-center gap-1.5 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Dukung Komunitas Sakode
        </span>
        <span className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono text-[11px]">
          {totalReactions.toLocaleString()} Reaksi
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {reactionList.map((item) => (
          <motion.button
            key={item.id}
            onClick={(e) => handleReaction(item.id, e)}
            whileTap={{ scale: 0.85 }}
            animate={clicked[item.id] ? { scale: [1, 1.25, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border ${item.bgColor} ${item.borderColor} transition-all cursor-pointer group active:scale-95`}
          >
            <div className="p-1.5 rounded-xl bg-slate-950/50 group-hover:scale-110 transition-transform mb-1">
              {item.icon}
            </div>
            <span className="text-[11px] font-medium text-slate-300 group-hover:text-white">
              {item.label}
            </span>
            <span className={`text-[10px] font-bold font-mono ${item.color}`}>
              {reactions[item.id]}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
