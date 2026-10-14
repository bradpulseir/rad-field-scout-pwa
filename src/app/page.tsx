import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brandConfig";
import MomentumThermometer from "@/components/MomentumThermometer";
import Leaderboard from "@/components/Leaderboard";
import { 
  Building2, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  Layers 
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      {/* Top Sub-Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-zinc-900 to-black border-b border-cyan-800/40 px-4 py-2.5 text-center text-xs text-cyan-300 font-medium">
        {BRAND_CONFIG.subHeaderBanner}
      </div>

      {/* Main Navbar */}
      <header className="border-b border-zinc-800 p-5 sticky top-0 z-20 bg-black/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="font-extrabold text-xl sm:text-2xl tracking-tight flex items-center gap-2">
            <span className="text-cyan-400">AITX</span>
            <span className="text-gray-500 text-sm font-normal">($AITX)</span>
            <span className="text-gray-600">|</span>
            <span className="text-white text-base sm:text-xl font-bold">RAD Field Scout</span>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/auth" 
              className="text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="hidden sm:inline-block bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full transition-transform hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Become a Scout
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-12 max-w-5xl mx-auto text-center flex flex-col items-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-6">
          <Sparkles size={14} className="text-cyan-400" />
          <span>Vanguard Community Initiative • OTC: AITX</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">RAD Field Scout</span> Network.
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl leading-relaxed">
          Help AITX disrupt the $50 billion legacy security industry. Spot high-visibility commercial properties with unsecured perimeters, submit leads in 30 seconds, and unlock exclusive community perks.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <Link 
            href="/auth" 
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-lg px-8 py-4 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
          >
            <span>[ Become a Scout Today ]</span>
            <ChevronRight size={20} />
          </Link>
        </div>
        <p className="text-gray-400 text-xs">(Sign up in 1-click via Magic Link. No passwords required.)</p>

        {/* Live Momentum Thermometer Component */}
        <div className="w-full mt-12 max-w-3xl">
          <MomentumThermometer />
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-zinc-900/60 py-20 border-y border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block p-3 rounded-2xl bg-cyan-950/50 border border-cyan-800/40 text-cyan-400 mb-4">
            <Building2 size={28} />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 text-white">
            We have the technology. We need your eyes on the ground.
          </h2>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Every day, billions of dollars of commercial real estate operate with unsecured perimeters, empty guard booths, and outdated passive cameras that fail to stop crime. AITX and its Robotic Assistance Devices (RAD) subsidiaries are actively deploying autonomous edge-AI solutions—including <span className="text-cyan-400 font-semibold">ROSA</span>, <span className="text-cyan-400 font-semibold">RIO</span>, and <span className="text-cyan-400 font-semibold">ROAMEO</span>—to solve this challenge. As a decentralized Scout, you help our US Enterprise Sales team pinpoint the exact facilities that need RAD deterrence.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black mb-3">30 Seconds to Corporate Impact.</h2>
          <p className="text-gray-400 text-sm sm:text-base">Designed mobile-first for Scouts sitting in their car or walking the area.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center text-center relative hover:border-cyan-500/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xl mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">1</div>
            <h3 className="text-xl font-bold mb-3 text-white">Spot an Opportunity</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Identify logistics yards, auto dealerships, construction zones, or commercial plazas with empty guard booths or unsecured perimeters. Or spot an active RAD unit in the wild!
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center text-center relative hover:border-cyan-500/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xl mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">2</div>
            <h3 className="text-xl font-bold mb-3 text-white">Snap & Auto-Locate</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tap your phone camera to capture the signage or gate. Our integrated browser GPS locks in the exact latitude and longitude with one tap.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center text-center relative hover:border-cyan-500/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xl mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">3</div>
            <h3 className="text-xl font-bold mb-3 text-white">Track & Unlock Perks</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AITX Enterprise Sales evaluates the lead. Watch your submissions advance from Verified to Deployed, climb the leaderboard, and unlock official gear.
            </p>
          </div>
        </div>
      </section>

      {/* Community Leaderboard Preview */}
      <section className="py-16 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold mb-3 border border-cyan-800/40">
              <Trophy size={14} />
              <span>Shareholder Vanguard</span>
            </div>
            <h2 className="text-3xl font-black text-white">Community Leaderboard</h2>
            <p className="text-gray-400 text-sm mt-1">Leading scouts driving autonomous security forward.</p>
          </div>

          <Leaderboard />
        </div>
      </section>

      {/* Gamification Tiers (Attainable, SEC Reg FD Compliant) */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">Climb the Ranks. Earn Official Perks.</h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Points are earned by submitting verified commercial properties (+100 pts), adding actionable facility contacts (+200 pts), and inviting fellow shareholders (+50 pts).
          </p>
        </div>

        <div className="space-y-6">
          {BRAND_CONFIG.rewardTiers.map((tier) => (
            <div 
              key={tier.level}
              className={`bg-zinc-900/60 border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden transition-all hover:bg-zinc-900 ${
                tier.level === 3 ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-zinc-800'
              }`}
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0 border-2 ${tier.badgeColor}`}>
                {tier.badge}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    LEVEL {tier.level}: {tier.name}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400">
                    {tier.minPoints}+ Points
                  </span>
                </div>
                <p className="text-cyan-400 text-xs font-semibold mb-3">
                  {tier.requirement}
                </p>
                <ul className="text-xs sm:text-sm text-gray-300 space-y-1.5 list-disc list-inside">
                  {tier.perks.map((perk, i) => (
                    <li key={i}>{perk}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pre-Loaded Share Cards Preview */}
      <section className="bg-zinc-900/50 py-16 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
            <Layers size={14} />
            <span>Viral Shareholder Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-white">
            Spot RAD in the Wild. Amplify the Mission.
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-10">
            Share active ROSA and RIO units deployed nationwide across social media to drive enterprise interest and community momentum.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {BRAND_CONFIG.shareCards.map((card) => (
              <div key={card.id} className="bg-black border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {card.unit}
                  </span>
                  <h4 className="font-bold text-white text-sm mt-3 mb-1">{card.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{card.tagline}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-cyan-400 font-semibold">
                  Included in Scout Dashboard
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-base px-8 py-4 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <span>Get Started in 1-Click</span>
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer & SEC Compliance Disclosures */}
      <footer className="border-t border-zinc-800 bg-black pt-16 pb-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="text-xl font-extrabold tracking-tight mb-2 text-white">
            <span className="text-cyan-400">AITX</span> | RAD Field Scout Network
          </div>
          <p className="text-xs text-gray-500 mb-8 text-center max-w-lg">
            Artificial Intelligence Technology Solutions, Inc. (OTC: AITX) & Robotic Assistance Devices (RAD)
          </p>
          
          <div className="text-[10px] sm:text-xs text-gray-400 space-y-3.5 max-w-4xl text-justify leading-relaxed bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
            <p><strong>Independent Volunteer Status:</strong> The RAD Field Scout Network is a voluntary brand advocacy program. Participants act solely as independent individuals and are NOT employees, contractors, agents, or broker-dealers of AITX or its subsidiaries.</p>
            <p><strong>Strict SEC / FINRA Compliance (No Securities Compensation):</strong> To strictly adhere to federal securities laws and FINRA regulations, NO cash, equity, securities, or financial commissions will be paid for leads or referrals. Rewards are strictly limited to non-cash promotional merchandise, digital badges, and public event guest passes.</p>
            <p><strong>Safety & Lawful Conduct:</strong> AITX strictly prohibits trespassing or unlawful conduct. Scouts must only capture photographs from public property or areas where they have lawful permission to be. Do not enter restricted areas or confront property personnel.</p>
            <p><strong>Safe Harbor Disclosure:</strong> Participation in the scout network does not guarantee corporate revenues, contract awards, or share performance. Communications may contain forward-looking statements subject to risks outlined in AITX&apos;s filings with the SEC.</p>
          </div>
          
          <div className="mt-8 text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Artificial Intelligence Technology Solutions, Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
