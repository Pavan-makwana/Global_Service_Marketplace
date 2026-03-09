// ─────────────────────────────────────────────────────────────────
// SmartDev Marketplace — Shared Constants & Mock Data
// ─────────────────────────────────────────────────────────────────

// Admin credentials (hardcoded as per BRD — replace with env vars in production)
export const ADMIN_CREDENTIALS = {
  email: "admin@SmartDev Marketplace.com",
  password: "Admin@2025",
};

// ── SKILLS ─────────────────────────────────────────────────────────
export const SKILLS_LIST = [
  "React", "Node.js", "Python", "Flutter", "Figma", "AWS",
  "Docker", "PostgreSQL", "Solidity", "TypeScript", "Vue.js",
  "Django", "MongoDB", "Kubernetes", "GraphQL", "TensorFlow",
  "Swift", "Kotlin", "Go", "Ruby on Rails",
];

// ── COUNTRIES ──────────────────────────────────────────────────────
export const COUNTRIES = [
  "India", "USA", "United Kingdom", "Germany", "UAE", "Japan",
  "Mexico", "Brazil", "Canada", "Australia", "Singapore",
  "Italy", "France", "Netherlands", "Sweden",
];

// ── DEVELOPERS ─────────────────────────────────────────────────────
export const DEVS = [
  {
    id: 1, name: "Aiko Tanaka", initials: "AT", country: "Japan",
    title: "Full-Stack Engineer", primary: "React",
    skills: ["React", "Node.js", "AWS", "PostgreSQL", "Docker"],
    exp: 10, rating: 4.97, reviews: 312, onTime: 98,
    earnings: 124000, rate: 145, match: 98, avail: true,
    bio: "Senior engineer specializing in high-traffic SaaS. Built infrastructure serving 2M+ users.",
    portfolio: ["SaaS Analytics Dashboard", "Fintech API Rebuild", "Real-Time Notification Engine"],
  },
  {
    id: 2, name: "Carlos Reyes", initials: "CR", country: "Mexico",
    title: "Brand & Motion Designer", primary: "Figma",
    skills: ["Figma", "Vue.js", "TypeScript", "MongoDB"],
    exp: 8, rating: 4.94, reviews: 208, onTime: 95,
    earnings: 89000, rate: 110, match: 91, avail: true,
    bio: "Award-winning designer who's shaped brands for Fortune 500 companies.",
    portfolio: ["Brand Identity Suite", "Motion Design Library", "Mobile App Redesign"],
  },
  {
    id: 3, name: "Fatima Al-Hassan", initials: "FA", country: "UAE",
    title: "AI/ML Engineer", primary: "Python",
    skills: ["Python", "TensorFlow", "Docker", "PostgreSQL"],
    exp: 7, rating: 4.99, reviews: 156, onTime: 97,
    earnings: 198000, rate: 195, match: 96, avail: false,
    bio: "PhD in ML. Builds production-grade AI from LLM fine-tuning to real-time inference pipelines.",
    portfolio: ["Recommendation Engine", "LLM Fine-Tuning Pipeline", "Computer Vision SDK"],
  },
  {
    id: 4, name: "Oliver Bennett", initials: "OB", country: "UK",
    title: "Growth Strategist", primary: "GraphQL",
    skills: ["GraphQL", "Node.js", "AWS", "React"],
    exp: 9, rating: 4.88, reviews: 445, onTime: 92,
    earnings: 67000, rate: 95, match: 84, avail: true,
    bio: "Scaled B2B SaaS from 0 to $100k MRR through organic channels and technical SEO.",
    portfolio: ["SEO Overhaul", "Content Strategy Framework", "Growth Analytics Stack"],
  },
  {
    id: 5, name: "Priya Sharma", initials: "PS", country: "India",
    title: "Mobile Developer", primary: "Flutter",
    skills: ["Flutter", "Kotlin", "Swift", "Firebase"],
    exp: 6, rating: 4.92, reviews: 189, onTime: 96,
    earnings: 78000, rate: 120, match: 87, avail: true,
    bio: "Shipped 20+ consumer apps with 4.8★ App Store ratings across fintech and health.",
    portfolio: ["Banking Super App", "Health Tracker", "Real-Time Chat App"],
  },
  {
    id: 6, name: "Luca Moretti", initials: "LM", country: "Italy",
    title: "Blockchain Developer", primary: "Solidity",
    skills: ["Solidity", "TypeScript", "Node.js", "PostgreSQL"],
    exp: 5, rating: 4.85, reviews: 92, onTime: 89,
    earnings: 156000, rate: 175, match: 79, avail: false,
    bio: "$200M+ TVL across 15 DeFi protocols. Security-first smart contract engineering.",
    portfolio: ["DeFi Yield Aggregator", "NFT Marketplace", "DAO Governance Contracts"],
  },
];

// ── PROJECTS ───────────────────────────────────────────────────────
export const PROJECTS = [
  {
    id: 1, title: "E-Commerce Platform Rebuild",
    client: "TechVentures GmbH", country: "Germany",
    category: "Engineering",
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    budgetMin: 18000, budgetMax: 25000,
    urgency: "High", status: "Open",
    posted: "2025-01-10", duration: "8 weeks",
    industry: "E-Commerce", applicants: 12,
    desc: "Migrate legacy Magento store to React + headless CMS. Full API integrations, payment gateways, and admin panel required.",
  },
  {
    id: 2, title: "AI Customer Support Chatbot",
    client: "Nubank Brazil", country: "Brazil",
    category: "AI & Data",
    skills: ["Python", "TensorFlow", "Docker", "PostgreSQL"],
    budgetMin: 30000, budgetMax: 45000,
    urgency: "High", status: "Open",
    posted: "2025-01-15", duration: "12 weeks",
    industry: "Fintech", applicants: 7,
    desc: "Multilingual LLM-powered support bot with contextual awareness and live analytics dashboard for agents.",
  },
  {
    id: 3, title: "Brand Identity System",
    client: "Nomad Collective", country: "USA",
    category: "Design",
    skills: ["Figma", "Vue.js", "TypeScript"],
    budgetMin: 8000, budgetMax: 12000,
    urgency: "Medium", status: "In Progress",
    posted: "2024-12-28", duration: "4 weeks",
    industry: "SaaS", applicants: 21,
    desc: "Full rebrand: logo suite, color system, typography guide, component library, and motion templates.",
  },
  {
    id: 4, title: "Mobile Banking App",
    client: "CapitalEdge", country: "Singapore",
    category: "Engineering",
    skills: ["Flutter", "Kotlin", "Swift"],
    budgetMin: 40000, budgetMax: 60000,
    urgency: "High", status: "Open",
    posted: "2025-01-18", duration: "16 weeks",
    industry: "Fintech", applicants: 9,
    desc: "Cross-platform mobile banking with biometric auth, Plaid integration, and real-time push notifications.",
  },
  {
    id: 5, title: "SEO & Content Strategy",
    client: "CloudMetrics", country: "Canada",
    category: "Marketing",
    skills: ["GraphQL", "Node.js", "React"],
    budgetMin: 5000, budgetMax: 8000,
    urgency: "Low", status: "Open",
    posted: "2025-01-12", duration: "3 months",
    industry: "SaaS", applicants: 31,
    desc: "Full technical SEO audit, keyword research report, and 12-month content calendar with topic clustering.",
  },
  {
    id: 6, title: "DeFi Yield Aggregator",
    client: "CryptoVault Labs", country: "UAE",
    category: "Web3",
    skills: ["Solidity", "TypeScript", "Node.js"],
    budgetMin: 55000, budgetMax: 80000,
    urgency: "Medium", status: "Open",
    posted: "2025-01-20", duration: "20 weeks",
    industry: "Crypto", applicants: 4,
    desc: "Smart contract suite for yield aggregator supporting 5 chains, with governance token and audit trail.",
  },
];

// ── ADMIN USER TABLE ───────────────────────────────────────────────
export const ADMIN_USERS = [
  { id:1, name:"Aiko Tanaka",       email:"aiko@dev.com",    role:"Developer", status:"Active",   joined:"Jan 2024", earnings:"$28,450", projects:12 },
  { id:2, name:"Carlos Reyes",      email:"carlos@dev.mx",   role:"Developer", status:"Active",   joined:"Mar 2024", earnings:"$19,200", projects:8  },
  { id:3, name:"Sophia Werner",     email:"sophia@tv.de",    role:"Client",    status:"Active",   joined:"Nov 2023", earnings:"—",        projects:5  },
  { id:4, name:"Fatima Al-Hassan",  email:"fatima@ai.ae",    role:"Developer", status:"Inactive", joined:"Feb 2024", earnings:"$41,800", projects:15 },
  { id:5, name:"TechVentures GmbH", email:"admin@tv.de",     role:"Client",    status:"Active",   joined:"Aug 2023", earnings:"—",        projects:9  },
  { id:6, name:"Priya Sharma",      email:"priya@dev.in",    role:"Developer", status:"Active",   joined:"Apr 2024", earnings:"$15,600", projects:6  },
  { id:7, name:"Mark Sullivan",     email:"mark@cm.ca",      role:"Client",    status:"Active",   joined:"Dec 2023", earnings:"—",        projects:3  },
];

// ── CHART DATA ─────────────────────────────────────────────────────
export const CHART_DEMAND = [
  { country:"USA", v:142 }, { country:"Germany", v:98 },
  { country:"India", v:87 }, { country:"UAE", v:74 },
  { country:"UK", v:68 },   { country:"Brazil", v:61 },
];
export const CHART_TREND = [
  { m:"Aug", projects:38, devs:120 }, { m:"Sep", projects:52, devs:135 },
  { m:"Oct", projects:49, devs:148 }, { m:"Nov", projects:71, devs:162 },
  { m:"Dec", projects:88, devs:179 }, { m:"Jan", projects:103, devs:201 },
];
export const CHART_CATS = [
  { name:"Engineering", value:42 }, { name:"Design", value:18 },
  { name:"AI & Data",   value:17 }, { name:"Marketing", value:14 },
  { name:"Web3",        value:9  },
];
export const CHART_SKILLS = [
  { name:"React", v:34 }, { name:"Python", v:28 },
  { name:"Node.js", v:19 }, { name:"Figma", v:12 },
  { name:"Solidity", v:7 },
];
export const PIE_COLORS = ["#1E3A8A","#0EA5E9","#10B981","#F59E0B","#8B5CF6"];

// ── URGENCY / STATUS BADGE VARIANTS ───────────────────────────────
export const URGENCY_VARIANT = { High:"amber", Medium:"sky", Low:"green" };
export const STATUS_VARIANT  = { Open:"green", "In Progress":"sky", Closed:"gray" };