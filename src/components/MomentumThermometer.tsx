"use client";

import { useEffect, useState } from "react";
import { BRAND_CONFIG } from "@/config/brandConfig";
import { Flame, Sparkles } from "lucide-react";

interface MomentumThermometerProps {
  currentTotal?: number;
  compact?: boolean;
}

export default function MomentumThermometer({
  currentTotal,
  compact = false,
}: MomentumThermometerProps) {
  const goal = BRAND_CONFIG.momentum.goal;
  const baseline = BRAND_CONFIG.momentum.baselineOffset;
  
  // Calculate total: baseline + live database entries (or fallback to baseline)
  const totalActions = (currentTotal !== undefined && currentTotal > 0)
    ? baseline + currentTotal
    : baseline;

  const percentage = Math.min(Math.round((totalActions / goal) * 100), 100);
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(percentage);
    }, 200);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={`w-full bg-gradient-to-b from-zinc-900 to-black border border-cyan-500/30 rounded-2xl ${compact ? 'p-4' : 'p-6 md:p-8'} relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)]`}>
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Flame size={compact ? 18 : 22} className="animate-pulse" />
          </div>
          <div>
            <h3 className={`font-bold text-white flex items-center gap-2 ${compact ? 'text-base' : 'text-lg md:text-xl'}`}>
              Community Momentum Tracker
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIVE
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              {BRAND_CONFIG.momentum.metricLabel}
            </p>
          </div>
        </div>

        {/* Counter */}
        <div className="text-left sm:text-right">
          <div className="text-xl sm:text-2xl font-black text-cyan-400 tracking-tight flex items-center sm:justify-end gap-1">
            <span>{totalActions.toLocaleString()}</span>
            <span className="text-gray-500 text-sm font-normal">/ {goal.toLocaleString()}</span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">
            {percentage}% toward Phase 1 Target
          </p>
        </div>
      </div>

      {/* Thermometer Progress Bar */}
      <div className="relative w-full h-5 sm:h-6 bg-zinc-950 rounded-full border border-zinc-800 p-1 overflow-hidden shadow-inner my-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-emerald-400 transition-all duration-1000 ease-out relative"
          style={{ width: `${animatedWidth}%` }}
        >
          {/* Subtle light sweep */}
          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
        </div>
      </div>

      {/* Milestones markers */}
      <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mt-2 font-mono">
        <span>0</span>
        <span className="hidden sm:inline">2,500 (Swag Drop)</span>
        <span>5,000 (Expo Passes)</span>
        <span className="hidden sm:inline">7,500 (Wall of Honor)</span>
        <span className="text-cyan-400 font-bold">10,000 (Goal)</span>
      </div>

      {/* Motivation Tagline */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1.5 text-cyan-300/90 font-medium">
          <Sparkles size={14} className="text-cyan-400" />
          Every scouted location & referral pushes the vanguard forward.
        </span>
        <span className="hidden md:inline text-[11px] text-gray-400">
          Updated in real-time
        </span>
      </div>
    </div>
  );
}
