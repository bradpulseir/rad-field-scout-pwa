import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <header className="border-b border-gray-800 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="font-bold text-2xl tracking-tighter flex items-center gap-2">
          <span className="text-cyan-500">RAD</span> Field Scout Network
        </div>
        <Link 
          href="/auth" 
          className="text-sm font-medium hover:text-cyan-400 transition-colors"
        >
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-24 max-w-5xl mx-auto text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Join the RAD Field Scout Network.
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl leading-relaxed">
          Help AITX disrupt the $50 billion legacy security industry. Spot vulnerable commercial properties, submit leads in seconds, and unlock exclusive insider perks.
        </p>
        <Link 
          href="/auth" 
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-8 py-4 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          [ Become a Scout Today ]
        </Link>
        <p className="text-gray-500 text-sm mt-4">(Sign up in 1-click. No passwords required.)</p>
      </section>

      {/* Mission Section */}
      <section className="bg-zinc-900/50 py-24 border-y border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-cyan-400">
            We have the technology. We need your eyes on the ground.
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Every night, billions of dollars of commercial real estate are protected by empty guard booths, passive cameras, and sleeping personnel. You see these security gaps every day on your commute, in your neighborhood, and at your workplace. AITX is rapidly deploying autonomous edge-AI to fix this broken system. But our sales team can&apos;t be everywhere at once. By joining the RAD Field Scout Network, you become the decentralized vanguard of our enterprise growth. Help us find the facilities that desperately need ROSA, RIO, and PURSUON, and get rewarded when they upgrade.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">30 Seconds to Corporate Impact.</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-2xl mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">1</div>
            <h3 className="text-xl font-bold mb-4">Spot a Security Gap</h3>
            <p className="text-gray-400">Look for unattended guard shacks, sleeping personnel, or unmonitored gates at auto dealerships, logistics hubs, and equipment yards.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-2xl mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">2</div>
            <h3 className="text-xl font-bold mb-4">Snap & Submit</h3>
            <p className="text-gray-400">Open this app on your phone. Snap a photo, let our GPS auto-fill the location, and hit submit.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-2xl mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">3</div>
            <h3 className="text-xl font-bold mb-4">Track & Earn</h3>
            <p className="text-gray-400">Our US Enterprise Sales team takes it from there. Track your lead&apos;s status on your dashboard and unlock exclusive rewards as the lead converts.</p>
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="bg-zinc-900/50 py-24 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Climb the Ranks. Unlock the Insider Experience.</h2>
          <div className="space-y-6">
            <div className="bg-black border border-zinc-800 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0 w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-4xl border-2 border-zinc-700">🥉</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">LEVEL 1: Certified Scout</h3>
                <p className="text-cyan-500 font-medium mb-3">Unlocked after 1 verified submission</p>
                <p className="text-gray-400">Digital RAD Scout Profile Badge & Access to quarterly &quot;Behind the Build&quot; engineering streams.</p>
              </div>
            </div>
            
            <div className="bg-black border border-zinc-800 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0 w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-4xl border-2 border-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.3)]">🥈</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">LEVEL 2: Senior Scout</h3>
                <p className="text-cyan-500 font-medium mb-3">Unlocked when your lead takes a Sales Demo</p>
                <p className="text-gray-400">Official RAD Tactical Apparel Pack & Priority Q&A placement during investor town halls.</p>
              </div>
            </div>

            <div className="bg-black border border-cyan-900/50 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex-shrink-0 w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-4xl border-2 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)] z-10">🥇</div>
              <div className="z-10">
                <h3 className="text-2xl font-bold text-white mb-2">LEVEL 3: Master Vanguard</h3>
                <p className="text-cyan-400 font-medium mb-3">Unlocked when your lead deploys hardware</p>
                <p className="text-gray-400">VIP Guest Pass to join the AITX Exec Team at an industry expo, Name on the RAD Wall of Honor, & Private 1-on-1 strategy call with CEO Steve Reinharz.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Disclosures */}
      <footer className="border-t border-zinc-800 bg-black pt-16 pb-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="text-xl font-bold tracking-tighter mb-8 text-gray-500">
            <span className="text-cyan-800">RAD</span> Field Scout Network
          </div>
          
          <div className="text-[10px] sm:text-xs text-gray-600 space-y-4 max-w-4xl text-justify leading-relaxed">
            <p><strong>Independent Participant Status:</strong> The RAD Field Scout Network is a voluntary brand advocacy program. Participants are independent individuals and are NOT employees, contractors, agents, or broker-dealers of AITX.</p>
            <p><strong>No Securities Compensation:</strong> To strictly comply with SEC/FINRA regulations, no cash, equity, or financial compensation of any kind will be paid for leads. Rewards are strictly promotional merchandise and experiential perks.</p>
            <p><strong>Safety & Trespassing:</strong> AITX strictly prohibits trespassing. Scouts must only capture photographs from public property or areas where they have explicit legal access. Do not interact with on-site security personnel.</p>
            <p><strong>Safe Harbor Statement:</strong> Participation does not guarantee future corporate revenues or share price performance. Contains forward-looking statements subject to SEC risks.</p>
          </div>
          
          <div className="mt-8 text-xs text-gray-700">
            &copy; {new Date().getFullYear()} AITX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
