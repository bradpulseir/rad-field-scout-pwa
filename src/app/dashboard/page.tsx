"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, MapPin, Award, ChevronRight } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface Scout {
  full_name: string;
  rank_level: number;
  total_points: number;
}

interface Lead {
  id: string;
  business_name: string;
  property_category: string;
  status: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [scout, setScout] = useState<Scout | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
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
      
      setScout(scoutData);

      // Fetch Leads
      const { data: leadsData } = await supabase
        .from("leads")
        .select("*")
        .eq("scout_id", user.id)
        .order("created_at", { ascending: false });

      if (leadsData) setLeads(leadsData);
      setLoading(false);
    };

    fetchData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-cyan-500 flex items-center justify-center">Loading...</div>;
  }

  const rankTitles = ["Rookie", "Certified Scout", "Senior Scout", "Master Vanguard"];
  const rankLevel = scout?.rank_level || 0;
  const currentRank = rankTitles[rankLevel] || "Master Vanguard";

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-10 flex justify-between items-center">
        <div className="font-bold text-xl">
          <span className="text-cyan-500">RAD</span> Dashboard
        </div>
        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white">Logout</button>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {/* Profile Card */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Award size={100} />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">{scout?.full_name || user?.email}</h2>
            <div className="inline-block bg-cyan-950 text-cyan-400 px-3 py-1 rounded-full text-sm font-bold border border-cyan-800 mb-4">
              Level {rankLevel}: {currentRank}
            </div>
            <p className="text-gray-400 text-sm">Total Points: <span className="text-white font-bold">{scout?.total_points || 0}</span></p>
          </div>
        </section>

        {/* CTA */}
        <Link 
          href="/submit"
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-lg py-5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)] mb-10"
        >
          <Camera size={24} />
          [ + Submit New Lead ]
        </Link>

        {/* Leads Feed */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MapPin className="text-cyan-500" size={20} />
            Your Submissions
          </h3>
          
          {leads.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-zinc-800 rounded-xl text-gray-500">
              No leads submitted yet. Tap the button above to spot your first security gap!
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div key={lead.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-white truncate pr-4">{lead.business_name}</h4>
                    <p className="text-xs text-gray-400 truncate">{lead.property_category}</p>
                    <div className="mt-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider
                        ${lead.status === 'Pending' ? 'bg-yellow-900/50 text-yellow-500 border border-yellow-700/50' : 
                          lead.status === 'Verified' ? 'bg-blue-900/50 text-blue-400 border border-blue-700/50' : 
                          lead.status === 'Demo Booked' ? 'bg-purple-900/50 text-purple-400 border border-purple-700/50' : 
                          'bg-cyan-900/50 text-cyan-400 border border-cyan-700/50'}`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-600" />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
