export interface RewardTier {
  level: number;
  name: string;
  minPoints: number;
  badge: string;
  badgeColor: string;
  requirement: string;
  perks: string[];
}

export interface ShareCard {
  id: string;
  title: string;
  unit: string;
  tagline: string;
  imageUrl: string;
  socialCopy: string;
}

export const BRAND_CONFIG = {
  // Brand Identity
  brandTitle: "AITX ($AITX) | RAD Field Scout Network",
  brandShort: "AITX / RAD Scout",
  ticker: "AITX",
  exchange: "OTC: AITX",
  companyName: "Artificial Intelligence Technology Solutions, Inc.",
  subsidiaryName: "Robotic Assistance Devices (RAD)",
  
  // Banner Headline
  subHeaderBanner:
    "An Official Shareholder & Community Initiative by Artificial Intelligence Technology Solutions, Inc. (OTC: AITX) and its RAD Subsidiaries.",

  // Public Web App URL (Fallback to production or current origin)
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://rad-field-scout.vercel.app",

  // Logos & Asset Placeholders
  logos: {
    // Clean SVG/CSS text-icon fallbacks until official PNG/SVG files are placed in /public
    aitxLogoText: "AITX",
    radLogoText: "RAD",
    logoSubtitle: "FIELD SCOUT NETWORK",
    faviconUrl: "/favicon.ico",
  },

  // Community Momentum Thermometer Settings
  momentum: {
    goal: 10000,
    baselineOffset: 782, // Seed number so the community campaign feels active immediately
    metricLabel: "Community Scout Actions & Referrals",
  },

  // Compliance-Safe Gamification Tiers (Strictly SEC Reg FD Compliant - Non-Equity, Non-Cash Perks)
  rewardTiers: [
    {
      level: 1,
      name: "Certified RAD Scout",
      minPoints: 100,
      badge: "🥉",
      badgeColor: "border-amber-600/50 text-amber-400 bg-amber-950/40",
      requirement: "100 Points — Sign up & submit 1 location or refer 2 friends",
      perks: [
        "Official Digital RAD Scout Profile Badge",
        "Public Leaderboard Ranking & Verified Contributor Status",
        "Access to Quarterly Community Engineering Recaps"
      ],
    },
    {
      level: 2,
      name: "Senior Field Scout",
      minPoints: 500,
      badge: "🥈",
      badgeColor: "border-zinc-400/50 text-zinc-300 bg-zinc-800/40",
      requirement: "500 Points — Active scouting, verified leads & community sharing",
      perks: [
        "Eligible for Official AITX / RAD Swag Pack (Apparel & Gear)",
        "Priority Invitation to Public Shareholder Livestreams",
        "Senior Scout Certificate of Recognition"
      ],
    },
    {
      level: 3,
      name: "Master Vanguard",
      minPoints: 1500,
      badge: "🥇",
      badgeColor: "border-cyan-400/60 text-cyan-300 bg-cyan-950/50",
      requirement: "1,500 Points — Top community contributors & viral ambassadors",
      perks: [
        "Featured on the Official AITX Digital Wall of Honor",
        "Eligible for VIP Guest Passes to Major Public Industry Expos (e.g. ISC West)",
        "Exclusive Master Vanguard Challenge Coin & Commemorative Plaque"
      ],
    },
  ] as RewardTier[],

  // Pre-loaded Shareable Cards ("RAD in the Wild" / Social Memes)
  shareCards: [
    {
      id: "rosa-wild",
      unit: "ROSA",
      title: "ROSA Edge-AI Autonomous Protector",
      tagline: "Active deterrence replacing passive surveillance across America.",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      socialCopy:
        "I just joined the official $AITX RAD Field Scout Network to help spot commercial deployments for @SteveReinharz and @RADBotSecurity! Autonomous security is here. Join the mission: https://rad-field-scout.vercel.app #AITX #EdgeAI #Robotics",
    },
    {
      id: "rio-wild",
      unit: "RIO 360",
      title: "RIO Solar-Powered Mobile Tower",
      tagline: "Total perimeter security for logistics hubs, yards, and parking lots.",
      imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      socialCopy:
        "Spotting security opportunities in the field for $AITX! Help bring autonomous edge-AI to logistics yards & retail centers with @RADBotSecurity: https://rad-field-scout.vercel.app #AITX #Robotics #OTC",
    },
    {
      id: "roameo-wild",
      unit: "ROAMEO",
      title: "ROAMEO Autonomous Patrol Vehicle",
      tagline: "Patrolling large outdoor commercial campuses with AI precision.",
      imageUrl: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=800&q=80",
      socialCopy:
        "Decentralized scouting for $AITX! Shareholders are mapping the next generation of autonomous AI robotics deployments. Join us today: https://rad-field-scout.vercel.app #AITX #StockTwits #Tech",
    },
  ] as ShareCard[],

  // Social Sharing Presets
  socialShareDefaults: {
    twitterText:
      "I just joined the official $AITX RAD Field Scout Network to help spot commercial deployments for @SteveReinharz and @RADBotSecurity! Join the mission here:",
    stocktwitsText:
      "$AITX RAD Field Scout Network is live! Shareholders crowdsourcing enterprise edge-AI deployments for ROSA & RIO. Join the vanguard:",
    generalHashtags: "#AITX #RAD #EdgeAI #Robotics #OTC",
  },
};
