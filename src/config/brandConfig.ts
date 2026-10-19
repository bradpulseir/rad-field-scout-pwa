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
  learnMoreUrl: string;
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

  // Official Websites (For Driving New Audience Traffic)
  websites: {
    aitxUrl: "https://aitx.ai",
    radUrl: "https://radsecurity.com",
  },
  
  // Banner Headline
  subHeaderBanner:
    "An Official Shareholder & Community Initiative by Artificial Intelligence Technology Solutions, Inc. (OTC: AITX) and its RAD Subsidiaries.",

  // Public Web App URL
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://rad-field-scout.vercel.app",

  // Official Logos (Provided by AITX Marketing)
  logos: {
    aitxWhite: "/logos/aitx-logo-white.png",
    aitxColor: "/logos/aitx-logo-color.png",
    radIcon: "/logos/rad-icon.png",
    radBadgeYellow: "/logos/rad-badge-yellow.png",
    radFull: "/logos/rad-logo-full.png",
    aitxLogoText: "AITX",
    radLogoText: "RAD",
    logoSubtitle: "FIELD SCOUT NETWORK",
    faviconUrl: "/favicon.ico",
  },

  // Community Momentum Thermometer Settings
  momentum: {
    goal: 10000,
    baselineOffset: 782, // Seed number so the community campaign feels active immediately
    metricLabel: "Community Story Shares, Referrals & Scout Actions",
  },

  // Digital Recognition & Milestone Tiers (No Hard Swag Commitments Upfront, SEC Reg FD Compliant)
  rewardTiers: [
    {
      level: 1,
      name: "Certified RAD Scout",
      minPoints: 100,
      badge: "🥉",
      badgeColor: "border-amber-600/50 text-amber-400 bg-amber-950/40",
      requirement: "100 Points — Share the AITX story, submit 1 location, or refer 2 friends",
      perks: [
        "Official Digital RAD Scout Profile Badge",
        "Public Leaderboard Ranking & Verified Contributor Status",
        "Quarterly Program Impact & Deployment Digest"
      ],
    },
    {
      level: 2,
      name: "Senior Field Scout",
      minPoints: 500,
      badge: "🥈",
      badgeColor: "border-zinc-400/50 text-zinc-300 bg-zinc-800/40",
      requirement: "500 Points — Active story sharing, referrals & verified field spotting",
      perks: [
        "Senior Scout Digital Recognition & Priority Leaderboard Badge",
        "Featured Spotlight in Community Updates",
        "Priority Eligibility for Future Program Milestone Perks"
      ],
    },
    {
      level: 3,
      name: "Master Vanguard",
      minPoints: 1500,
      badge: "🥇",
      badgeColor: "border-cyan-400/60 text-cyan-300 bg-cyan-950/50",
      requirement: "1,500 Points — Top community ambassadors introducing AITX to new audiences",
      perks: [
        "Permanent Induction onto the Official AITX Digital Wall of Honor",
        "Top Vanguard Ambassador Distinction",
        "VIP Consideration for Public Industry Expo Guest Passes (e.g. ISC West)"
      ],
    },
  ] as RewardTier[],

  // Story-First Shareable Cards (Designed to Introduce AITX/RAD to New Audiences & Drive Website Visits)
  shareCards: [
    {
      id: "rosa-story",
      unit: "ROSA™",
      title: "Meet ROSA: AI-Driven Autonomous Security",
      tagline: "Replacing outdated passive cameras with active, 180° AI deterrence for commercial facilities.",
      imageUrl: "/logos/rad-badge-yellow.png",
      learnMoreUrl: "https://radsecurity.com",
      socialCopy:
        "Have you seen how AI robotics is transforming commercial security? Meet ROSA by Robotic Assistance Devices (RAD), an AITX company—autonomous edge-AI deterrence protecting facilities nationwide. See how it works at https://radsecurity.com & https://aitx.ai #AITX #RADSecurity #EdgeAI #Robotics",
    },
    {
      id: "rio-story",
      unit: "RIO™ 360",
      title: "RIO: Solar-Powered Autonomous Perimeter Tower",
      tagline: "Zero-grid, rapid-deployment AI security for logistics yards, retail centers, and large properties.",
      imageUrl: "/logos/rad-icon.png",
      learnMoreUrl: "https://radsecurity.com",
      socialCopy:
        "Businesses are upgrading from passive security cameras to solar-powered autonomous AI towers like RIO by RAD (an AITX company). Zero trenching, 360° active deterrence, and massive cost savings. Explore the technology at https://radsecurity.com and https://aitx.ai #AI #SecurityTech #AITX #Robotics",
    },
    {
      id: "aitx-mission",
      unit: "AITX STORY",
      title: "The Future of Autonomous Facility Operations",
      tagline: "Discover how Artificial Intelligence Technology Solutions (AITX) is solving real-world labor & security challenges.",
      imageUrl: "/logos/aitx-logo-white.png",
      learnMoreUrl: "https://aitx.ai",
      socialCopy:
        "Discover how Artificial Intelligence Technology Solutions (AITX) and its subsidiary RAD are deploying practical, autonomous AI robots across hospitals, logistics hubs, and commercial properties nationwide. Learn more at https://aitx.ai and join the Field Scout Network: https://rad-field-scout.vercel.app #AITX #Innovation #ArtificialIntelligence",
    },
  ] as ShareCard[],

  // Social Sharing Presets (Story-First to Introduce New People to AITX.ai & RADSecurity.com)
  socialShareDefaults: {
    twitterText:
      "Autonomous AI is transforming how commercial properties, hospitals, and logistics yards stay secure. Check out what @SteveReinharz and @RADBotSecurity (an $AITX company) are building at https://aitx.ai & https://radsecurity.com — or join our community Scout Network:",
    stocktwitsText:
      "Spreading the word on $AITX and @RADBotSecurity! Introducing new businesses & audiences to autonomous AI security solutions (ROSA, RIO, ROAMEO). Explore the tech at https://aitx.ai or join the Field Scout Network:",
    generalHashtags: "#AITX #RADSecurity #EdgeAI #Robotics #AI",
  },
};
