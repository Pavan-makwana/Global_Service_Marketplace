import { useState } from "react";
import { TopNav, Card, Badge, Chip, Btn, TabBar, Avatar, Stars, MatchRing } from "../components/ui";
import { DEVS } from "../constants/data";

// ─────────────────────────────────────────────────────────────────
// PAGE: Developer Profile
// Route: "dev-profile"
// Access: All roles
// ─────────────────────────────────────────────────────────────────

const REVIEWS = [
  {
    client:"TechVentures GmbH", rating:5, date:"Jan 2025", project:"E-Commerce Platform",
    text:"Delivered ahead of schedule with exceptional code quality. Will hire again without hesitation.",
  },
  {
    client:"Nomad Collective", rating:5, date:"Nov 2024", project:"Analytics Dashboard",
    text:"Exactly what we needed. Clear communication, fast turnaround, and went above and beyond.",
  },
  {
    client:"Nubank", rating:4, date:"Sep 2024", project:"Real-time Chat System",
    text:"Strong technical skills. Minor delays on documentation but overall a great result.",
  },
];

export default function DevProfilePage({ dev, setPage, role, onLogout }) {
  const d = dev || DEVS[0];
  const [tab, setTab] = useState("about");

  // AI score breakdown per BRD formula
  const SCORE_BREAKDOWN = [
    { label:"Skill Match",      score: Math.round(d.match * 0.4),        max:40,  color:"#1E3A8A" },
    { label:"Client Rating",    score: Math.round((d.rating / 5) * 30),  max:30,  color:"#0EA5E9" },
    { label:"Experience",       score: Math.min(20, Math.round(d.exp*2)),max:20,  color:"#10B981" },
    { label:"On-Time Delivery", score: Math.round(d.onTime / 10),        max:10,  color:"#F59E0B" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav setPage={setPage} role={role} onLogout={onLogout || (() => setPage("home"))} />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => setPage("marketplace")}
          className="flex items-center gap-2 text-sm text-sky-600 font-semibold mb-5 hover:gap-3 transition-all"
        >
          ← Back to Marketplace
        </button>

        {/* ── PROFILE HEADER ── */}
        <Card className="p-8 mb-6">
          <div className="flex gap-6 flex-wrap">
            {/* Avatar + availability dot */}
            <div className="relative">
              <Avatar initials={d.initials} size="xl" color="blue" />
              <div
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white
                  ${d.avail ? "bg-emerald-400" : "bg-red-400"}`}
              />
            </div>

            {/* Name + bio */}
            <div className="flex-1 min-w-64">
              <div className="flex flex-wrap gap-2 items-center mb-1">
                <h1 className="text-2xl font-black text-slate-800">{d.name}</h1>
                <Badge variant={d.avail ? "green" : "red"}>
                  {d.avail ? "● Available Now" : "● Currently Busy"}
                </Badge>
              </div>
              <p className="text-sky-600 font-bold text-base mb-1">{d.title}</p>
              <p className="text-slate-500 text-sm mb-3">
                {d.country} · {d.exp} yrs experience · ${d.rate}/hr
              </p>
              <p className="text-slate-600 text-sm leading-relaxed max-w-lg mb-4">{d.bio}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {d.skills.map(s => <Chip key={s} label={s} />)}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Btn>Hire {d.name.split(" ")[0]}</Btn>
                <Btn variant="outline">Send Message</Btn>
                <Btn variant="ghost">Save Profile</Btn>
              </div>
            </div>

            {/* Quick metrics */}
            <div className="grid grid-cols-2 gap-3 self-start flex-shrink-0">
              {[
                { label:"Hourly Rate", val:`$${d.rate}/hr`, color:"text-blue-900"   },
                { label:"Jobs Done",   val:`${d.reviews}`,  color:"text-slate-800"  },
                { label:"On-Time",     val:`${d.onTime}%`,  color:"text-emerald-600"},
                { label:"Earned",      val:`$${(d.earnings/1000).toFixed(0)}K`, color:"text-slate-800" },
              ].map(m => (
                <div key={m.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center min-w-24">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                  <p className={`text-lg font-black ${m.color}`}>{m.val}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ── MAIN + SIDEBAR ── */}
        <div className="grid grid-cols-3 gap-6">

          {/* Main content — 2/3 */}
          <div className="col-span-2">
            <TabBar
              tabs={[
                { id:"about",     label:"About" },
                { id:"portfolio", label:"Portfolio" },
                { id:"reviews",   label:`Reviews (${d.reviews})` },
              ]}
              active={tab}
              onChange={setTab}
            />

            {/* ABOUT */}
            {tab === "about" && (
              <Card className="p-7">
                <h2 className="text-lg font-black text-slate-800 mb-3">Professional Summary</h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {d.bio} With {d.reviews} verified reviews and a {d.onTime}% on-time delivery rate,
                  they bring technical depth and clear communication to every engagement.
                </p>

                <h3 className="font-black text-slate-800 text-base mb-4">Skill Proficiency</h3>
                {d.skills.map((s, i) => {
                  const pct = 96 - i * 5;
                  return (
                    <div key={s} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-slate-700">{s}</span>
                        <span className="font-bold text-blue-900">{pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-900 to-sky-500 rounded-full transition-all"
                          style={{ width:`${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </Card>
            )}

            {/* PORTFOLIO */}
            {tab === "portfolio" && (
              <div className="flex flex-col gap-3">
                {(d.portfolio || ["Project Alpha","Project Beta","Project Gamma"]).map((title, i) => (
                  <Card key={i} className="p-5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 mb-1">{title}</p>
                      <div className="flex gap-2 flex-wrap">
                        <Chip label={d.primary} />
                        <Badge variant="gray">{2022 + i}</Badge>
                      </div>
                    </div>
                    <Btn size="sm" variant="outline">View →</Btn>
                  </Card>
                ))}
              </div>
            )}

            {/* REVIEWS */}
            {tab === "reviews" && (
              <Card className="p-7">
                {REVIEWS.map((r, i) => (
                  <div key={i} className={i < REVIEWS.length - 1 ? "pb-6 mb-6 border-b border-slate-100" : ""}>
                    <div className="flex justify-between flex-wrap gap-2 mb-2">
                      <div>
                        <p className="font-bold text-slate-800">{r.client}</p>
                        <p className="text-xs text-slate-500">{r.project}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stars rating={r.rating} />
                        <span className="text-xs text-slate-400">{r.date}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </Card>
            )}
          </div>

          {/* Sidebar — 1/3 */}
          <div className="flex flex-col gap-4">

            {/* AI Match Score card */}
            <Card className="p-5">
              <p className="text-sm font-black text-slate-800 mb-4">AI Match Score</p>
              <div className="flex justify-center mb-5">
                <MatchRing score={d.match} size={80} />
              </div>
              <p className="text-xs text-slate-500 mb-3 text-center">Score breakdown (BRD formula)</p>
              {SCORE_BREAKDOWN.map(s => (
                <div key={s.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">{s.label}</span>
                    <span className="font-bold" style={{ color:s.color }}>{s.score}/{s.max}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width:`${(s.score / s.max) * 100}%`, background:s.color }}
                    />
                  </div>
                </div>
              ))}
            </Card>

            {/* Quick stats */}
            <Card className="p-5">
              <p className="text-sm font-black text-slate-800 mb-3">Quick Stats</p>
              {[
                ["Response Time", "< 2 hrs"],
                ["Rehire Rate",   "87%"],
                ["Languages",     "English, JP"],
                ["Member Since",  "Jan 2022"],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                  <span className="text-slate-500">{l}</span>
                  <span className="font-bold text-slate-800">{v}</span>
                </div>
              ))}
            </Card>

            {/* Action buttons */}
            <Card className="p-5">
              <p className="text-sm font-black text-slate-800 mb-3">Actions</p>
              <div className="flex flex-col gap-2">
                <Btn full>Hire {d.name.split(" ")[0]}</Btn>
                <Btn full variant="outline">Send Message</Btn>
                <Btn full variant="ghost">Download Resume</Btn>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}