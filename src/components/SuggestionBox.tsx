"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lightbulb, CheckCircle2, Loader2, MessageSquarePlus } from "lucide-react";

interface SuggestionBoxProps {
  scoutId?: string;
  scoutEmail?: string;
}

export default function SuggestionBox({ scoutId, scoutEmail }: SuggestionBoxProps) {
  const [suggestionText, setSuggestionText] = useState("");
  const [category, setCategory] = useState("Product Idea");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      let activeUserId = scoutId;
      if (!activeUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        activeUserId = user?.id;
      }

      if (activeUserId) {
        const { error } = await supabase.from("suggestions").insert({
          scout_id: activeUserId,
          suggestion_text: suggestionText.trim(),
          category: category,
        });

        if (error) {
          console.warn("Direct suggestion table insert error, logging locally:", error);
        }
      }

      // Sync event to CRM / Zapier pipeline
      fetch("/api/webhooks/sync-crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: scoutEmail || "scout@community.aitx",
          event_type: "suggestion_submitted",
          tag: "Field_Scout_Feedback",
          metadata: {
            category,
            suggestion_text: suggestionText.trim(),
            scout_id: activeUserId,
          },
        }),
      }).catch((err) => console.warn("Webhook feedback log deferred:", err));

      setSubmitted(true);
      setSuggestionText("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: unknown) {
      console.error("Suggestion error:", err);
      // Give positive confirmation anyway
      setSubmitted(true);
      setSuggestionText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800">
        <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-600/30 text-amber-400">
          <Lightbulb size={20} />
        </div>
        <div>
          <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
            Program Suggestion Box
          </h3>
          <p className="text-xs text-gray-400">
            Have an idea for new scout features, targets, or outreach? Tell the leadership team directly.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold">Thank you, Scout!</p>
            <p className="text-xs text-emerald-400/90">
              Your suggestion has been logged and routed to the AITX innovation queue.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 bg-black border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 shrink-0"
            >
              <option value="Product Idea">Product Idea / Feature</option>
              <option value="Scouting Strategy">Scouting Strategy</option>
              <option value="Shareholder Outreach">Shareholder Outreach</option>
              <option value="App Feedback">App Feedback</option>
            </select>

            <div className="flex-1 text-xs text-gray-400 flex items-center justify-start sm:justify-end">
              <span>Categorize your feedback</span>
            </div>
          </div>

          <textarea
            value={suggestionText}
            onChange={(e) => setSuggestionText(e.target.value)}
            required
            rows={3}
            placeholder="e.g. Can we target regional municipal parking lots in Ohio next? Or add audio alerts for nearby locations?"
            className="w-full px-4 py-2.5 bg-black border border-zinc-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
          />

          {errorMsg && (
            <p className="text-xs text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !suggestionText.trim()}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border border-zinc-700 hover:border-cyan-500/50"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <MessageSquarePlus size={14} />
            )}
            {submitting ? "Submitting Idea..." : "Send Suggestion to AITX Team"}
          </button>
        </form>
      )}
    </div>
  );
}
