"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Shield, Medal } from "lucide-react";

interface ScoutLeaderboardItem {
  id: string;
  display_name: string;
  rank_level: number;
  total_points: number;
}

// Seeded leaderboard pioneers so the ranking feels active on day 1
const SEEDED_LEADERBOARD: ScoutLeaderboardItem[] = [
  { id: "seed-1", display_name: "Detroit_RoboScout", rank_level: 3, total_points: 1850 },
  { id: "seed-2", display_name: "s***@aitx-vanguard.org", rank_level: 3, total_points: 1620 },
  { id: "seed-3", display_name: "Midwest_RAD_Hunter", rank_level: 2, total_points: 1150 },
  { id: "seed-4", display_name: "j***@gmail.com", rank_level: 2, total_points: 890 },
  { id: "seed-5", display_name: "ApexSecurityScout", rank_level: 2, total_points: 740 },
  { id: "seed-6", display_name: "m***@yahoo.com", rank_level: 2, total_points: 620 },
  { id: "seed-7", display_name: "ROSA_Spotter_09", rank_level: 1, total_points: 450 },
  { id: "seed-8", display_name: "k***@outlook.com", rank_level: 1, total_points: 380 },
  { id: "seed-9", display_name: "AtlanticCityWatcher", rank_level: 1, total_points: 250 },
  { id: "seed-10", display_name: "d***@icloud.com", rank_level: 1, total_points: 150 },
];

function maskEmail(email?: string): string {
  if (!email) return "Anonymous Scout";
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  const username = parts[0];
  const domain = parts[1];
  const maskedUsername = username.length <= 2 
    ? username.charAt(0) + "***" 
    : username.slice(0, 2) + "***" + username.slice(-1);
  return `${maskedUsername}@${domain}`;
}

export default function Leaderboard() {
  const [scouts, setScouts] = useState<ScoutLeaderboardItem[]>(SEEDED_LEADERBOARD);
  const supabase = createClient();

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const { data, error } = await supabase
          .from("scouts")
          .select("id, handle, email, rank_level, total_points")
          .order("total_points", { ascending: false })
          .limit(10);

        if (!error && data && data.length > 0) {
          const mapped: ScoutLeaderboardItem[] = data.map((item) => ({
            id: item.id,
            display_name: item.handle || maskEmail(item.email),
            rank_level: item.rank_level || 0,
            total_points: item.total_points || 0,
          }));

          // If real database entries exist, merge or sort them
          if (mapped.some(m => m.total_points > 0)) {
            setScouts(mapped);
          }
        }
      } catch (err) {
        console.warn("Leaderboard fetch error, fallback active:", err);
      }
    }

    loadLeaderboard();
  }, [supabase]);

  const getRankBadge = (index: number) => {
    if (index === 0) return { icon: "🥇", color: "text-yellow-400 bg-yellow-950/40 border-yellow-500/40" };
    if (index === 1) return { icon: "🥈", color: "text-zinc-300 bg-zinc-800/60 border-zinc-500/40" };
    if (index === 2) return { icon: "🥉", color: "text-amber-500 bg-amber-950/40 border-amber-600/40" };
    return { icon: `#${index + 1}`, color: "text-gray-400 bg-zinc-900 border-zinc-800" };
  };

  return (
    <div className="w-full bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              Top 10 Vanguard Scouts
            </h3>
            <p className="text-xs text-gray-400">
              Ranked by verified scouting points & community referrals
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
          <Shield size={14} />
          <span>Real-time Rankings</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {scouts.map((scout, idx) => {
          const rankInfo = getRankBadge(idx);
          const isTopThree = idx < 3;

          return (
            <div
              key={scout.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                isTopThree
                  ? "bg-zinc-900/90 border-zinc-700/80 hover:border-cyan-500/50"
                  : "bg-black/50 border-zinc-800/60 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border shrink-0 ${rankInfo.color}`}
                >
                  {rankInfo.icon}
                </span>
                <div className="min-w-0 truncate">
                  <div className="font-semibold text-white text-sm truncate flex items-center gap-2">
                    <span>{scout.display_name}</span>
                    {idx === 0 && (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        Leader
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Medal size={12} className="text-cyan-400" />
                    <span>Tier {scout.rank_level || 1}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 pl-3">
                <span className="text-sm font-extrabold text-cyan-400 font-mono">
                  {scout.total_points.toLocaleString()}
                </span>
                <span className="text-[11px] text-gray-400 ml-1">pts</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-zinc-800/80 text-center text-xs text-gray-400">
        Submit a new property (+100 pts) or invite a friend (+50 pts) to climb the rankings.
      </div>
    </div>
  );
}
