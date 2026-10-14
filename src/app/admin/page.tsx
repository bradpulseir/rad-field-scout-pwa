"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Clock, ShieldCheck, Users, Radio, Building2 } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brandConfig";

interface Scout {
  full_name: string;
  email: string;
}

interface Lead {
  id: string;
  photo_url: string;
  business_name: string;
  address: string;
  property_category: string;
  security_gap: string;
  notes: string;
  status: string;
  submission_type?: string;
  contact_name?: string;
  contact_info?: string;
  created_at: string;
  scouts?: Scout;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const fetchLeads = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth");
      return;
    }

    // Verify admin role
    const { data: scout } = await supabase
      .from("scouts")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!scout || !scout.is_admin) {
      router.push("/dashboard");
      return;
    }

    const { data } = await supabase
      .from("leads")
      .select(`
        *,
        scouts ( full_name, email )
      `)
      .order("created_at", { ascending: false });

    if (data) setLeads(data as Lead[]);
    setLoading(false);
  }, [router, supabase]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLeadStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", id);
    
    if (!error) {
      // Optimistic update
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } else {
      alert("Failed to update status: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Authenticating Admin Privileges...</p>
      </div>
    );
  }

  const totalLeads = leads.length;
  const pendingLeads = leads.filter(l => l.status === "Pending").length;
  const wildSpottings = leads.filter(l => l.submission_type === "RAD in the Wild").length;
  const withContacts = leads.filter(l => Boolean(l.contact_name || l.contact_info)).length;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 md:p-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-zinc-900 to-black border border-cyan-800/40 rounded-xl px-4 py-2.5 mb-8 text-center text-xs text-cyan-300 font-medium">
        {BRAND_CONFIG.subHeaderBanner}
      </div>

      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-xs font-bold border border-cyan-800/50 mb-2">
            <ShieldCheck size={14} />
            <span>ENTERPRISE SALES TRIAGE</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            <span className="text-cyan-400">AITX</span> | RAD Admin Triage
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Review crowdsourced commercial properties and public RAD spottings.
          </p>
        </div>
        <button 
          onClick={() => supabase.auth.signOut().then(() => router.push("/"))} 
          className="text-xs font-semibold text-gray-400 hover:text-white px-3 py-2 bg-zinc-900 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors"
        >
          Logout Admin
        </button>
      </header>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
          <span className="text-xs text-gray-400 block mb-1">Total Submissions</span>
          <span className="text-2xl font-black text-white font-mono">{totalLeads}</span>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
          <span className="text-xs text-yellow-400 block mb-1">Pending Triage</span>
          <span className="text-2xl font-black text-yellow-400 font-mono">{pendingLeads}</span>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
          <span className="text-xs text-cyan-400 block mb-1">RAD in the Wild</span>
          <span className="text-2xl font-black text-cyan-400 font-mono">{wildSpottings}</span>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
          <span className="text-xs text-emerald-400 block mb-1">Actionable Contacts</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{withContacts}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-gray-400 border-b border-zinc-800">
            <tr>
              <th className="p-4 font-medium">Type / Photo</th>
              <th className="p-4 font-medium">Business / Address</th>
              <th className="p-4 font-medium">Security Need / Notes</th>
              <th className="p-4 font-medium">Actionable Contact</th>
              <th className="p-4 font-medium">Scout</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Pipeline Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {leads.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">No leads found in database.</td></tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-zinc-800/40 transition-colors">
                <td className="p-4 align-top">
                  <div className="mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 border ${
                      lead.submission_type === "RAD in the Wild"
                        ? "bg-purple-950/80 text-purple-300 border-purple-700/60"
                        : "bg-cyan-950/80 text-cyan-300 border-cyan-800/60"
                    }`}>
                      {lead.submission_type === "RAD in the Wild" ? <Radio size={10} /> : <Building2 size={10} />}
                      <span>{lead.submission_type || "Future RAD Site"}</span>
                    </span>
                  </div>
                  <a href={lead.photo_url} target="_blank" rel="noreferrer">
                    <img src={lead.photo_url} alt="Evidence" className="w-24 h-24 object-cover rounded-lg border border-zinc-700 hover:border-cyan-500 cursor-pointer shadow-sm" />
                  </a>
                </td>

                <td className="p-4 align-top">
                  <div className="font-bold text-white mb-1">{lead.business_name}</div>
                  <div className="text-xs text-gray-400 max-w-[200px] leading-relaxed">{lead.address}</div>
                  <div className="text-xs text-cyan-400 mt-2 font-medium">{lead.property_category}</div>
                </td>

                <td className="p-4 align-top">
                  <div className="text-amber-400 font-semibold text-xs mb-1.5 flex items-center gap-1">
                    <Clock size={13} /> {lead.security_gap}
                  </div>
                  <p className="text-xs text-gray-300 max-w-[220px] leading-relaxed italic bg-black/40 p-2 rounded-lg border border-zinc-800">
                    {lead.notes || "No extra notes provided."}
                  </p>
                </td>

                <td className="p-4 align-top">
                  {lead.contact_name || lead.contact_info ? (
                    <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-2.5 max-w-[200px]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                        <Users size={12} /> Contact Provided
                      </div>
                      <div className="text-xs font-bold text-white truncate">{lead.contact_name}</div>
                      <div className="text-xs text-gray-300 truncate">{lead.contact_info}</div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 italic">None provided</span>
                  )}
                </td>

                <td className="p-4 align-top">
                  <div className="font-medium text-gray-200 text-xs">{lead.scouts?.full_name || "Scout"}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[150px]">{lead.scouts?.email}</div>
                </td>

                <td className="p-4 align-top">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider
                    ${lead.status === 'Pending' ? 'bg-yellow-900/50 text-yellow-500 border border-yellow-700/50' : 
                      lead.status === 'Verified' ? 'bg-blue-900/50 text-blue-400 border border-blue-700/50' : 
                      lead.status === 'Demo Booked' ? 'bg-purple-900/50 text-purple-400 border border-purple-700/50' : 
                      'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'}`}
                  >
                    {lead.status}
                  </span>
                </td>

                <td className="p-4 align-top text-right space-y-2">
                  <div className="flex flex-col gap-2 items-end">
                    <select 
                      className="bg-black border border-zinc-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="Demo Booked">Demo Booked</option>
                      <option value="Deployed">Deployed</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
