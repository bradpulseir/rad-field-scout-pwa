"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brandConfig";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setMessage(error.message);
        setIsSuccess(false);
      } else {
        setMessage("Check your email for your 1-click login link!");
        setIsSuccess(true);

        // Notify CRM webhook about signup/login attempt
        fetch("/api/webhooks/sync-crm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            event_type: "signup",
            tag: "Field_Scout_Lead",
            metadata: {
              auth_method: "magic_link",
            },
          }),
        }).catch((err) => console.warn("CRM sync deferred:", err));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send magic link.";
      setMessage(msg);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between text-white selection:bg-cyan-500 selection:text-black">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-zinc-900 to-black border-b border-cyan-800/40 px-4 py-2.5 text-center text-xs text-cyan-300 font-medium">
        {BRAND_CONFIG.subHeaderBanner}
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 mb-6 transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-3">
              <Sparkles size={12} className="text-cyan-400" />
              <span>AITX Shareholder Initiative</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-2 text-white">
              <span className="text-cyan-400">AITX</span> Scout Login
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              Enter your email to receive a secure 1-click Magic Link. No passwords required.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-xl focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 text-sm"
                placeholder="scout@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-3.5 px-4 rounded-xl transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : null}
              {loading ? "Transmitting Magic Link..." : "Send Magic Link"}
            </button>
          </form>

          {message && (
            <div className={`mt-6 text-center text-xs p-3.5 rounded-xl border flex items-center justify-center gap-2 ${
              isSuccess 
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300" 
                : "bg-red-950/60 border-red-500/40 text-red-300"
            }`}>
              {isSuccess ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> : null}
              <span>{message}</span>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-zinc-800/80 text-center text-[11px] text-gray-500">
            By signing in, you agree to the RAD Field Scout Network volunteer guidelines and safe harbor terms.
          </div>
        </div>
      </div>

      <div className="p-4 text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} Artificial Intelligence Technology Solutions, Inc. (OTC: AITX)
      </div>
    </div>
  );
}
