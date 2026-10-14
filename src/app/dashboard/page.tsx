"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Camera, 
  MapPin, 
  Award, 
  ChevronRight, 
  LogOut, 
  Shield, 
  Building2, 
  Users 
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { BRAND_CONFIG } from "@/config/brandConfig";
import MomentumThermometer from "@/components/MomentumThermometer";
import ShareEngine from "@/components/ShareEngine";
import Leaderboard from "@/components/Leaderboard";
import SuggestionBox from "@/components/SuggestionBox";

interface Scout {
  full_name: string;
  rank_level: number;
  total_points: number;
  handle?: string;
}

interface Lead {
  id: string;
  business_name: string;
  property_category: string;
  status: string;
  submission_type?: string;
  contact_name?: string;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [scout, setScout] = useState<Scout | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth");
      return;
    }
    setUser(user);

    // Fetch Scout Profile
    const { data: scoutData } = await supabase
      .from("scouts")
      .select("*")
      .eq("id", user.id)
      .single();
    
    if (scoutData) {
      setScout(scoutData);
    } else {
      // Defensive fallback profile if not yet created
      const fallback: Scout = {
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Scout",
        rank_level: 0,
        total_points: 0,
      };
      setScout(fallback);
    }

    // Fetch Leads
    const { data: leadsData } = await supabase
      .from("leads")
      .select("*")
      .eq("scout_id", user.id)
      .order("created_at", { ascending: false });

    if (leadsData) setLeads(leadsData);
    setLoading(false);
  }, [router, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handlePointsAwarded = (newPoints: number) => {
    let newLevel = 0;
    if (newPoints >= 1500) newLevel = 3;
    else if (newPoints >= 500) newLevel = 2;
    else if (newPoints >= 100) newLevel = 1;

    setScout((prev) => prev ? { ...prev, total_points: newPoints, rank_level: newLevel } : prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Loading Scout Dashboard...</p>
      </div>
    );
  }

  const rankTitles = ["Recruit Scout", "Certified RAD Scout", "Senior Field Scout", "Master Vanguard"];
  const rankLevel = scout?.rank_level || 0;
  const currentRank = rankTitles[rankLevel] || "Master Vanguard";
  const points = scout?.total_points || 0;

  // Next level milestone calculation
  let nextThreshold = 100;
  let nextRankTitle = "Certified RAD Scout";
  if (points >= 1500) {
    nextThreshold = 3000;
    nextRankTitle = "Vanguard Legend";
  } else if (points >= 500) {
    nextThreshold = 1500;
    nextRankTitle = "Master Vanguard";
  } else if (points >= 100) {
    nextThreshold = 500;
    nextRankTitle = "Senior Field Scout";
  }

  const progressPercent = Math.min(Math.round((points / nextThreshold) * 100), 100);

  return (
    <div className="min-h-screen bg-black text-white pb-28">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-zinc-900 to-black border-b border-cyan-800/40 px-4 py-2 text-center text-[11px] text-cyan-300/90 font-medium">
        {BRAND_CONFIG.subHeaderBanner}
      </div>

      {/* Main Header */}
      <header className="bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 p-4 sticky top-0 z-20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="font-extrabold text-lg tracking-tight">
            <span className="text-cyan-400">AITX</span>
            <span className="text-gray-400 text-xs mx-1.5">|</span>
            <span>RAD Scout</span>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </header>

      <main className="p-4 max-w-xl mx-auto space-y-6 mt-2">
        {/* Profile Card & Gamified Tier Status */}
        <section className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.12)]">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Award size={120} />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 inline-flex items-center gap-1">
                  <Shield size={10} />
                  <span>OFFICIAL SCOUT PROFILE</span>
                </span>
                <h2 className="text-2xl font-black text-white mt-1.5">
                  {scout?.full_name || user?.email}
                </h2>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>

              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                  {points.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 block font-medium">TOTAL PTS</span>
              </div>
            </div>

            {/* Current Level Pill */}
            <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 px-3 py-1.5 rounded-xl text-xs font-bold text-white">
                <span className="text-base">
                  {rankLevel === 3 ? "🥇" : rankLevel === 2 ? "🥈" : rankLevel === 1 ? "🥉" : "🎖️"}
                </span>
                <span>Level {rankLevel}: {currentRank}</span>
              </div>

              <div className="text-xs text-gray-400">
                Next Tier: <span className="text-cyan-300 font-bold">{nextRankTitle}</span> ({points}/{nextThreshold} pts)
              </div>
            </div>

            {/* Progress to next tier */}
            <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-800 overflow-hidden mt-3">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-700" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* Primary Call to Action */}
        <Link 
          href="/submit"
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg py-5 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(6,182,212,0.4)]"
        >
          <Camera size={24} />
          <span>[ + Submit New Lead / Spot in Wild ]</span>
        </Link>

        {/* Community Momentum Thermometer */}
        <MomentumThermometer compact={true} />

        {/* Viral Share & Referral Engine */}
        <ShareEngine 
          scoutId={user?.id}
          scoutEmail={user?.email}
          onPointsAwarded={handlePointsAwarded}
          compact={false}
        />

        {/* Leads Feed */}
        <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="text-cyan-400" size={18} />
              <span>Your Submissions</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-gray-300">
                {leads.length}
              </span>
            </h3>
            <Link href="/submit" className="text-xs text-cyan-400 hover:underline font-medium">
              + New Lead
            </Link>
          </div>
          
          {leads.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-zinc-800 rounded-xl text-gray-500">
              <Building2 className="mx-auto mb-2 text-gray-600" size={32} />
              <p className="text-sm font-medium text-gray-400">No leads submitted yet.</p>
              <p className="text-xs text-gray-500 mt-1">
                Spot an unsecured commercial property or active RAD unit in the wild to claim your first 100 points!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="bg-black/60 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between hover:border-zinc-700 transition-colors">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
                        {lead.submission_type || "Future RAD Site"}
                      </span>
                      {lead.contact_name && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center gap-1">
                          <Users size={10} /> 2x Bonus
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-sm truncate">{lead.business_name}</h4>
                    <p className="text-xs text-gray-400 truncate">{lead.property_category}</p>
                    <div className="mt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                        ${lead.status === 'Pending' ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/50' : 
                          lead.status === 'Verified' ? 'bg-blue-900/40 text-blue-400 border border-blue-700/50' : 
                          lead.status === 'Demo Booked' ? 'bg-purple-900/40 text-purple-400 border border-purple-700/50' : 
                          'bg-cyan-900/40 text-cyan-300 border border-cyan-700/50'}`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-600 shrink-0" size={18} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Leaderboard Preview */}
        <Leaderboard />

        {/* Suggestion Box */}
        <SuggestionBox scoutId={user?.id} scoutEmail={user?.email} />
      </main>
    </div>
  );
}
