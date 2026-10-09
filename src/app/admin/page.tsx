"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

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
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-cyan-500 p-8">Loading Admin...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <header className="mb-10 flex justify-between items-end border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold"><span className="text-cyan-500">RAD</span> Admin Triage</h1>
          <p className="text-gray-400 mt-2">Manage incoming scout leads.</p>
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => router.push("/"))} className="text-sm text-gray-400 hover:text-white">
          Logout
        </button>
      </header>

      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-gray-400 border-b border-zinc-800">
            <tr>
              <th className="p-4 font-medium">Photo</th>
              <th className="p-4 font-medium">Business / Address</th>
              <th className="p-4 font-medium">Gap / Notes</th>
              <th className="p-4 font-medium">Scout</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {leads.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">No leads found.</td></tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 align-top">
                  <a href={lead.photo_url} target="_blank" rel="noreferrer">
                    <img src={lead.photo_url} alt="Evidence" className="w-24 h-24 object-cover rounded border border-zinc-700 hover:border-cyan-500 cursor-pointer" />
                  </a>
                </td>
                <td className="p-4 align-top">
                  <div className="font-bold text-white mb-1">{lead.business_name}</div>
                  <div className="text-xs text-gray-400 max-w-[200px]">{lead.address}</div>
                  <div className="text-xs text-cyan-700 mt-2">{lead.property_category}</div>
                </td>
                <td className="p-4 align-top">
                  <div className="text-red-400 font-medium mb-1 flex items-center gap-1">
                    <Clock size={14} /> {lead.security_gap}
                  </div>
                  <p className="text-xs text-gray-400 max-w-[250px] italic">{lead.notes || "No extra notes."}</p>
                </td>
                <td className="p-4 align-top">
                  <div className="font-medium text-gray-300">{lead.scouts?.full_name}</div>
                  <div className="text-xs text-gray-500">{lead.scouts?.email}</div>
                </td>
                <td className="p-4 align-top">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider
                    ${lead.status === 'Pending' ? 'bg-yellow-900/50 text-yellow-500 border border-yellow-700/50' : 
                      lead.status === 'Verified' ? 'bg-blue-900/50 text-blue-400 border border-blue-700/50' : 
                      lead.status === 'Demo Booked' ? 'bg-purple-900/50 text-purple-400 border border-purple-700/50' : 
                      'bg-cyan-900/50 text-cyan-400 border border-cyan-700/50'}`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 align-top text-right space-y-2">
                  <div className="flex flex-col gap-2 items-end">
                    <select 
                      className="bg-black border border-zinc-700 text-xs text-white rounded p-1"
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
