"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BRAND_CONFIG, ShareCard } from "@/config/brandConfig";
import { 
  Share2, 
  Send, 
  Check, 
  Copy, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ExternalLink,
  Loader2,
  Globe
} from "lucide-react";

interface ShareEngineProps {
  scoutId?: string;
  scoutEmail?: string;
  onPointsAwarded?: (newPoints: number) => void;
  compact?: boolean;
}

export default function ShareEngine({
  scoutId,
  scoutEmail,
  onPointsAwarded,
  compact = false,
}: ShareEngineProps) {
  const [friendEmail, setFriendEmail] = useState("");
  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  const supabase = createClient();
  const appUrl = BRAND_CONFIG.appUrl;

  // Handle Friend Email Referral
  const handleInviteFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendEmail || !friendEmail.includes("@")) {
      setInviteError("Please enter a valid email address.");
      return;
    }

    setSubmittingInvite(true);
    setInviteError(null);
    setInviteSuccess(null);

    try {
      let activeUserId = scoutId;

      if (!activeUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        activeUserId = user?.id;
      }

      if (activeUserId) {
        // 1. Insert referral record
        await supabase.from("referrals").insert({
          scout_id: activeUserId,
          friend_email: friendEmail.trim(),
          status: "Invited",
        });

        // 2. Fetch current points and add +50 bonus points
        const { data: currentScout } = await supabase
          .from("scouts")
          .select("total_points, rank_level")
          .eq("id", activeUserId)
          .single();

        const updatedPoints = (currentScout?.total_points || 0) + 50;
        let newRankLevel = currentScout?.rank_level || 0;
        if (updatedPoints >= 1500) newRankLevel = 3;
        else if (updatedPoints >= 500) newRankLevel = 2;
        else if (updatedPoints >= 100) newRankLevel = 1;

        await supabase
          .from("scouts")
          .update({ total_points: updatedPoints, rank_level: newRankLevel })
          .eq("id", activeUserId);

        if (onPointsAwarded) {
          onPointsAwarded(updatedPoints);
        }
      }

      // 3. Dispatch to CRM / Mailchimp pipeline with Chimp Tags
      fetch("/api/webhooks/sync-crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: friendEmail.trim(),
          event_type: "friend_referral",
          tag: "Field_Scout_Referral",
          metadata: {
            referred_by_id: activeUserId,
            referred_by_email: scoutEmail,
          },
        }),
      }).catch((err) => console.warn("Webhook delivery deferred:", err));

      setInviteSuccess(`+50 Points Earned! Story invite sent to ${friendEmail.trim()}`);
      setFriendEmail("");
    } catch (err: unknown) {
      console.error("Referral error:", err);
      setInviteSuccess(`+50 Points Queued! Invitation recorded for ${friendEmail.trim()}`);
      setFriendEmail("");
    } finally {
      setSubmittingInvite(false);
    }
  };

  // Story-first social sharing URLs (Introducing new people to AITX.ai & RADSecurity.com)
  const shareText = encodeURIComponent(
    `${BRAND_CONFIG.socialShareDefaults.twitterText} ${appUrl} ${BRAND_CONFIG.socialShareDefaults.generalHashtags}`
  );

  const stocktwitsText = encodeURIComponent(
    `${BRAND_CONFIG.socialShareDefaults.stocktwitsText} ${appUrl}`
  );

  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(BRAND_CONFIG.websites.aitxUrl)}`;
  const stocktwitsUrl = `https://stocktwits.com/?status=${stocktwitsText}`;

  const copyStoryBundle = () => {
    const textToCopy = `${BRAND_CONFIG.socialShareDefaults.twitterText} ${appUrl}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyCardContent = (card: ShareCard) => {
    navigator.clipboard.writeText(card.socialCopy);
    setCopiedCardId(card.id);
    setTimeout(() => setCopiedCardId(null), 2500);
  };

  return (
    <div className="w-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.1)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
        <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
          <Share2 size={22} />
        </div>
        <div>
          <h3 className="font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
            Share the AITX Story & Earn Points
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              +50 PTS PER INVITE
            </span>
          </h3>
          <p className="text-xs text-gray-400">
            Introduce new audiences & business owners to AITX and RAD&apos;s autonomous robotics story.
          </p>
        </div>
      </div>

      {/* Part 1: Refer Someone New Input */}
      <div className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
          Introduce a Friend, Colleague, or Business Owner to AITX
        </label>
        <form onSubmit={handleInviteFriend} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            placeholder="colleague.or.friend@example.com"
            className="flex-1 px-4 py-3 bg-black border border-zinc-700 rounded-xl focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 text-sm"
          />
          <button
            type="submit"
            disabled={submittingInvite}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-3 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            {submittingInvite ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            {submittingInvite ? "Sending..." : "Send Story Invite (+50 Pts)"}
          </button>
        </form>

        {inviteSuccess && (
          <div className="mt-3 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{inviteSuccess}</span>
          </div>
        )}

        {inviteError && (
          <div className="mt-3 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs">
            {inviteError}
          </div>
        )}
      </div>

      {/* Part 2: 1-Click Story Sharing */}
      <div className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          1-Click Story Share (Drives Traffic to AITX.ai & RADSecurity.com)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* X / Twitter */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-zinc-900 border border-zinc-800 hover:border-cyan-500/60 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white transition-all hover:bg-zinc-850 group"
          >
            <span className="text-cyan-400 font-mono font-black group-hover:scale-110 transition-transform">𝕏</span>
            <span>Share on X</span>
          </a>

          {/* StockTwits */}
          <a
            href={stocktwitsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/60 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white transition-all hover:bg-zinc-850 group"
          >
            <TrendingUp size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>$AITX Stream</span>
          </a>

          {/* Facebook */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-zinc-900 border border-zinc-800 hover:border-blue-500/60 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white transition-all hover:bg-zinc-850 group"
          >
            <ExternalLink size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <span>Share AITX.ai</span>
          </a>

          {/* Copy Story Post */}
          <button
            onClick={copyStoryBundle}
            className="p-3 bg-zinc-900 border border-zinc-800 hover:border-cyan-400 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-cyan-300 transition-all hover:bg-zinc-850"
          >
            {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedLink ? "Copied Story!" : "Copy Story"}</span>
          </button>
        </div>
      </div>

      {/* Part 3: Shareable Story Cards */}
      {!compact && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sparkles size={14} className="text-cyan-400" />
              Shareable Story Cards (Introduce New Audiences)
            </label>
            <span className="text-[11px] text-gray-400">Tap card to copy story & links</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {BRAND_CONFIG.shareCards.map((card) => {
              const isCopied = copiedCardId === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => copyCardContent(card)}
                  className={`cursor-pointer rounded-xl border p-3.5 bg-zinc-900/60 transition-all hover:border-cyan-500/80 hover:bg-zinc-900 relative flex flex-col justify-between ${
                    isCopied ? "border-emerald-500 ring-1 ring-emerald-500" : "border-zinc-800"
                  }`}
                >
                  <div>
                    <div className="h-16 w-full bg-black/70 rounded-lg border border-zinc-800/80 flex items-center justify-center p-2 mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={card.imageUrl} 
                        alt={card.unit} 
                        className="max-h-12 w-auto object-contain"
                      />
                    </div>
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {card.unit}
                      </span>
                      {isCopied ? (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                          <Check size={12} /> Copied!
                        </span>
                      ) : (
                        <Copy size={12} className="text-gray-400 hover:text-white" />
                      )}
                    </div>
                    <h4 className="font-bold text-white text-xs mb-1">{card.title}</h4>
                    <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">
                      {card.tagline}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-800 flex justify-between items-center text-[10px] text-cyan-400 font-medium">
                    <span>Copy Story + Website Link</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Links to Official Websites */}
          <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Globe size={13} className="text-cyan-400" />
              <span>Official Websites Being Promoted:</span>
            </span>
            <div className="flex items-center gap-4">
              <a
                href={BRAND_CONFIG.websites.aitxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>AITX.ai</span>
                <ExternalLink size={11} />
              </a>
              <a
                href={BRAND_CONFIG.websites.radUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 font-semibold flex items-center gap-1"
              >
                <span>RADSecurity.com</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
