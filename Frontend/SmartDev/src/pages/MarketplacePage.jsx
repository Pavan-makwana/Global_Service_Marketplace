import { useState } from "react";
import { TopNav, Card, Badge, Chip, Btn } from "../components/ui";
import { URGENCY_VARIANT, STATUS_VARIANT } from "../constants/data";

// ─────────────────────────────────────────────────────────────────
// PAGE: Marketplace — Browse & Filter Projects
// Route: "marketplace"
// Access: Developer (logged in), Public (view only)
// ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Engineering", "Design", "AI & Data", "Marketing", "Web3"];

export default function MarketplacePage({ setPage, setSelectedProject, role, onLogout, projects = [] }) {
  const [search, setSearch]     = useState("");
  const [cat, setCat]           = useState("All");
  const [urgency, setUrgency]   = useState("All");
  const [sortBy, setSortBy]     = useState("newest");

  // ── FILTER + SORT ─────────────────────────────────────────────
  const filtered = PROJECTS.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || p.title.toLowerCase().includes(q)
      || p.skills.some(s => s.toLowerCase().includes(q))
      || p.client.toLowerCase().includes(q);
    const matchCat    = cat === "All" || p.category === cat;
    const matchUrgency = urgency === "All" || p.urgency === urgency;
    return matchSearch && matchCat && matchUrgency;
  }).sort((a, b) => {
    if (sortBy === "budget")  return b.budgetMax - a.budgetMax;
    if (sortBy === "apps")    return b.applicants - a.applicants;
    return new Date(b.posted) - new Date(a.posted); // newest
  });

  const openDetail = (p) => { setSelectedProject(p); setPage("project-detail"); };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav setPage={setPage} role={role} onLogout={role ? (onLogout || (() => setPage("home"))) : null} />

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-white mb-1">Browse Projects</h1>
          <p className="text-blue-300 text-sm">
            Discover global opportunities · {projects.length} live projects
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── FILTER BAR ── */}
        <Card className="p-5 mb-6">
          <div className="flex flex-wrap gap-3 items-end">

            {/* Search */}
            <div className="flex-1 min-w-64">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Search</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🔍</span>
                <input
                  placeholder="Title, skill, or client…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 hover:border-slate-300 transition-colors"
                />
              </div>
            </div>

            {/* Urgency */}
            <div className="min-w-36">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Urgency</label>
              <select
                value={urgency}
                onChange={e => setUrgency(e.target.value)}
                className="w-full border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
              >
                {["All", "High", "Medium", "Low"].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>

            {/* Sort */}
            <div className="min-w-40">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="budget">Highest Budget</option>
                <option value="apps">Most Applied</option>
              </select>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all
                  ${cat === c
                    ? "bg-blue-900 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </Card>

        {/* Result count + AI badge */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500">
            <strong className="text-slate-800">{filtered.length}</strong> project{filtered.length !== 1 ? "s" : ""} found
          </p>
          <Badge variant="blue">◈ AI Match Active</Badge>
        </div>

        {/* ── PROJECT CARDS ── */}
        <div className="flex flex-col gap-4">
          {filtered.map(p => {
            const urgVariant = URGENCY_VARIANT[p.urgency] || "gray";
            const statVariant = STATUS_VARIANT[p.status] || "gray";
            return (
              <Card key={p.id} onClick={() => openDetail(p)} className="overflow-hidden">
                <div className="flex">
                  {/* urgency accent bar */}
                  <div
                    className={`w-1.5 flex-shrink-0
                      ${p.urgency === "High"   ? "bg-amber-400"
                      : p.urgency === "Medium" ? "bg-sky-400"
                      : "bg-emerald-400"}`}
                  />
                  <div className="flex-1 p-6">
                    <div className="flex justify-between flex-wrap gap-4">

                      {/* LEFT: info */}
                      <div className="flex-1 min-w-60">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant={statVariant}>{p.status}</Badge>
                          <Badge variant="blue">{p.category}</Badge>
                          <Badge variant={urgVariant}>{p.urgency} Urgency</Badge>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-1">{p.title}</h3>
                        <p className="text-sm text-slate-500 mb-3">
                          <span className="font-semibold text-slate-700">{p.client}</span>
                          {" "}· {p.country} · {p.industry}
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">{p.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.skills.map(s => <Chip key={s} label={s} />)}
                        </div>
                      </div>

                      {/* RIGHT: budget + CTA */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-black text-blue-900">
                          ${p.budgetMin.toLocaleString()}–${p.budgetMax.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-500 mb-1">{p.duration}</p>
                        <p className="text-xs text-slate-400 mb-4">
                          👥 {p.applicants} applicants
                          {" "}· 📅 {new Date(p.posted).toLocaleDateString("en", { month:"short", day:"numeric" })}
                        </p>
                        <Btn
                          size="sm" variant="outline"
                          onClick={e => { e.stopPropagation(); openDetail(p); }}
                        >
                          View Details →
                        </Btn>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Empty state */}
          {!filtered.length && (
            <div className="text-center py-24 text-slate-400">
              <div className="text-5xl mb-3">🔍</div>
              <p className="font-semibold text-slate-600 text-lg">No matching projects</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}