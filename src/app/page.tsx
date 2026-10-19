import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brandConfig";
import MomentumThermometer from "@/components/MomentumThermometer";
import Leaderboard from "@/components/Leaderboard";
import { 
  Building2, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  Layers,
  Globe,
  ExternalLink
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      {/* Top Sub-Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-zinc-900 to-black border-b border-cyan-800/40 px-4 py-2.5 text-center text-xs text-cyan-300 font-medium">
        {BRAND_CONFIG.subHeaderBanner}
      </div>

      {/* Main Navbar with Official AITX & RAD Logos */}
      <header className="border-b border-zinc-800 p-4 sm:p-5 sticky top-0 z-20 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BRAND_CONFIG.logos.aitxWhite}
              alt="AITX"
              className="h-7 sm:h-9 w-auto object-contain"
            />
            <span className="text-zinc-700 text-xl font-light">|</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BRAND_CONFIG.logos.radIcon}
              alt="RAD"
              className="h-6 sm:h-8 w-auto object-contain"
            />
            <span className="hidden md:inline-block text-white text-sm font-bold tracking-wide uppercase pl-1">
              Field Scout Network
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={BRAND_CONFIG.websites.aitxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <span>AITX.ai</span>
              <ExternalLink size={12} />
            </a>
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
              Join the Network
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-14 pb-12 max-w-5xl mx-auto text-center flex flex-col items-center relative">
        {/* Dual Official Brand Lockup */}
        <div className="flex items-center justify-center gap-6 mb-8 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BRAND_CONFIG.logos.aitxWhite}
            alt="AITX - Artificial Intelligence Technology Solutions"
            className="h-10 sm:h-12 w-auto object-contain"
          />
          <div className="h-8 w-[1px] bg-zinc-700" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BRAND_CONFIG.logos.radIcon}
            alt="RAD - Robotic Assistance Devices"
            className="h-9 sm:h-11 w-auto object-contain"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-6">
          <Sparkles size={14} className="text-cyan-400" />
          <span>Share the AITX Story • Spot Commercial Opportunities</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">RAD Field Scout</span> Network.
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl leading-relaxed">
          Help introduce new audiences and businesses to AITX &amp; RAD&apos;s autonomous AI security technology. Share our story, spot commercial properties in 30 seconds, and climb the community leaderboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <Link 
            href="/auth" 
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-lg px-8 py-4 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
          >
            <span>[ Become a Scout Today ]</span>
            <ChevronRight size={20} />
          </Link>
          <a
            href={BRAND_CONFIG.websites.aitxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-sm px-6 py-4 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <Globe size={16} className="text-cyan-400" />
            <span>Explore AITX.ai</span>
            <ExternalLink size={14} className="text-gray-400" />
          </a>
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
            Introducing the World to Practical AI Robotics.
          </h2>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
            Every day, billions of dollars of commercial real estate operate with unsecured perimeters, empty guard booths, and outdated passive cameras. Artificial Intelligence Technology Solutions, Inc. (<a href="https://aitx.ai" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">AITX.ai</a>) and its subsidiary Robotic Assistance Devices (<a href="https://radsecurity.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline hover:text-yellow-300">RADSecurity.com</a>) are deploying autonomous edge-AI solutions—including <span className="text-cyan-400 font-semibold">ROSA</span>, <span className="text-cyan-400 font-semibold">RIO</span>, and <span className="text-cyan-400 font-semibold">ROAMEO</span>—across the nation. By sharing our story with new people and spotting commercial opportunities on the ground, you help drive the next wave of adoption.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={BRAND_CONFIG.websites.aitxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold px-4 py-2.5 rounded-xl bg-black border border-zinc-700 hover:border-cyan-500 text-cyan-300 flex items-center gap-2 transition-colors"
            >
              <span>Visit Official AITX Website (aitx.ai)</span>
              <ExternalLink size={13} />
            </a>
            <a
              href={BRAND_CONFIG.websites.radUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold px-4 py-2.5 rounded-xl bg-black border border-zinc-700 hover:border-yellow-500 text-yellow-400 flex items-center gap-2 transition-colors"
            >
              <span>Explore RAD Security Lineup (radsecurity.com)</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black mb-3">3 Ways to Drive Impact in 30 Seconds.</h2>
          <p className="text-gray-400 text-sm sm:text-base">Introduce new audiences to AITX and spot commercial deployment opportunities.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center text-center relative hover:border-cyan-500/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xl mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">1</div>
            <h3 className="text-xl font-bold mb-3 text-white">Share the AITX Story</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Use our 1-click Story Cards to introduce friends, business owners, and new audiences to AITX &amp; RAD&apos;s autonomous security robots and invite them to explore <span className="text-cyan-400">aitx.ai</span>.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center text-center relative hover:border-cyan-500/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xl mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">2</div>
            <h3 className="text-xl font-bold mb-3 text-white">Spot &amp; Auto-Locate</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Spot logistics hubs, dealerships, or plazas with unsecured perimeters—or snap a photo of a ROSA/RIO unit deployed in the wild! Browser GPS locks in the coordinates automatically.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center text-center relative hover:border-cyan-500/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xl mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">3</div>
            <h3 className="text-xl font-bold mb-3 text-white">Climb the Vanguard</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Earn points for every story referral and verified property submission. Climb the community leaderboard, unlock digital badges, and earn recognition on the Digital Wall of Honor.
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
            <p className="text-gray-400 text-sm mt-1">Top community ambassadors spreading the AITX story and scouting locations.</p>
          </div>

          <Leaderboard />
        </div>
      </section>

      {/* Gamification Tiers (Digital Recognition & Flexible Milestones - Zero Upfront Swag Liability) */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">Climb the Ranks. Earn Vanguard Recognition.</h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Points are earned by inviting friends to learn about AITX (+50 pts), submitting commercial properties (+100 pts), and providing actionable facility contacts (+200 pts).
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

      {/* Pre-Loaded Story Share Cards Preview */}
      <section className="bg-zinc-900/50 py-16 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
            <Layers size={14} />
            <span>Story-First Outreach Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-white">
            Easy 1-Click Cards to Share the AITX Story.
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-10">
            Introduce people who may not know us yet to ROSA, RIO, and AITX&apos;s autonomous robotics lineup—giving them a clear reason to visit our websites and learn more.
          </p>

          <div className="grid sm:grid-cols-3 gap-5 text-left">
            {BRAND_CONFIG.shareCards.map((card) => (
              <div key={card.id} className="bg-black border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
                <div>
                  <div className="h-20 w-full bg-zinc-950 rounded-xl border border-zinc-800/80 flex items-center justify-center p-3 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.imageUrl}
                      alt={card.unit}
                      className="max-h-14 w-auto object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {card.unit}
                  </span>
                  <h4 className="font-bold text-white text-sm mt-3 mb-1">{card.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{card.tagline}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-semibold">Ready in Scout Dashboard</span>
                  <a
                    href={card.learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Learn More</span>
                    <ExternalLink size={11} />
                  </a>
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
          <div className="flex items-center gap-5 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BRAND_CONFIG.logos.aitxWhite}
              alt="AITX"
              className="h-8 w-auto object-contain"
            />
            <span className="text-zinc-700">|</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BRAND_CONFIG.logos.radIcon}
              alt="RAD"
              className="h-7 w-auto object-contain"
            />
          </div>
          <p className="text-xs text-gray-500 mb-8 text-center max-w-lg">
            Artificial Intelligence Technology Solutions, Inc. (OTC: AITX) &amp; Robotic Assistance Devices (RAD)
          </p>
          
          <div className="text-[10px] sm:text-xs text-gray-400 space-y-3.5 max-w-4xl text-justify leading-relaxed bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
            <p><strong>Independent Volunteer Status:</strong> The RAD Field Scout Network is a voluntary brand advocacy program. Participants act solely as independent individuals and are NOT employees, contractors, agents, or broker-dealers of AITX or its subsidiaries.</p>
            <p><strong>Strict SEC / FINRA Compliance (No Securities or Financial Compensation):</strong> To strictly adhere to federal securities laws and FINRA regulations, NO cash, equity, securities, or financial commissions will be paid for leads, referrals, or program participation. Recognition is strictly limited to digital badges, leaderboard rankings, and optional non-monetary community acknowledgments.</p>
            <p><strong>Safety &amp; Lawful Conduct:</strong> AITX strictly prohibits trespassing or unlawful conduct. Scouts must only capture photographs from public property or areas where they have lawful permission to be. Do not enter restricted areas or confront property personnel.</p>
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
