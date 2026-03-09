import { useState } from "react";
import { TopNav, Card, StatTile, Badge, Chip, Btn, TabBar, Avatar, Stars } from "../components/ui";
import { DEVS } from "../constants/data";

// ─────────────────────────────────────────────────────────────────
// PAGE: Developer Dashboard
// Route: "dev-dashboard"
// Access: Developer only
// ─────────────────────────────────────────────────────────────────

// Simulated applications with statuses
const APP_STATUSES = ["Applied", "Shortlisted", "Applied", "Rejected"];
const APP_BADGE = {
  Applied:    "sky",
  Shortlisted:"green",
  Rejected:   "red",
  Awarded:    "blue",
};

export default function DevDashboard({ setPage, setSelectedProject, onLogout, projects = [] }) {
  const dev = DEVS[0]; // logged-in developer (mock)
  const [tab, setTab] = useState("applications");
  const [isAvailable, setIsAvailable] = useState(dev.avail);

  // Edit profile state
  const [bioEdit, setBioEdit] = useState(dev.bio);
  const [portfolioEdit, setPortfolioEdit] = useState("https://aikodev.io");
  const [saved, setSaved] = useState(false);

  const myApps = projects.slice(0, 4).map((p, i) => ({
    ...p,
    appStatus:   APP_STATUSES[i],
    appliedDate: "Jan 18, 2025",
  }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav setPage={setPage} role="developer" onLogout={onLogout || (() => setPage("home"))} />

      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-5 flex-wrap">
          <div className="relative">
            <Avatar initials={dev.initials} size="lg" color="sky" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{dev.name}</h1>
            <p className="text-sky-300 font-semibold text-sm">{dev.title}</p>
            <div className="flex items-center gap-3 mt-1">
              <Stars rating={dev.rating} />
              <span className="text-blue-300 text-sm">${dev.rate}/hr · {dev.exp} yrs exp · {dev.country}</span>
            </div>
          </div>
          <div className="ml-auto">
            <Btn variant="white" onClick={() => setPage("marketplace")}>
              Browse Projects →
            </Btn>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* KPI TILES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatTile label="Applications Sent"  value="14"                              sub="3 shortlisted"     icon="📤" topColor="bg-blue-900"   />
          <StatTile label="Projects Completed" value={`${dev.reviews}`}                sub="+8 this month"     icon="✅" topColor="bg-emerald-500"/>
          <StatTile label="Total Earned"        value={`$${(dev.earnings/1000).toFixed(0)}K`} sub="Lifetime"   icon="💰" topColor="bg-amber-500"  />
          <StatTile label="My Rating"           value={`${dev.rating}★`}               sub={`${dev.reviews} reviews`} icon="🏅" topColor="bg-sky-500"/>
        </div>

        {/* TABS */}
        <TabBar
          tabs={[
            { id:"applications", label:"My Applications" },
            { id:"profile",      label:"Edit Profile" },
            { id:"browse",       label:"Browse Projects →" },
          ]}
          active={tab}
          onChange={t => {
            if (t === "browse") { setPage("marketplace"); return; }
            setTab(t);
          }}
        />

        {/* ── APPLICATIONS TAB ── */}
        {tab === "applications" && (
          <div>
            {/* Status legend */}
            <div className="flex gap-3 mb-4 flex-wrap">
              {[["Applied","sky"],["Shortlisted","green"],["Rejected","red"],["Awarded","blue"]].map(([s,v]) => (
                <Badge key={s} variant={v}>{s}</Badge>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {myApps.map(a => (
                <Card
                  key={a.id}
                  className="p-6"
                  onClick={() => { setSelectedProject(a); setPage("project-detail"); }}
                >
                  <div className="flex justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-60">
                      <div className="flex gap-2 items-center mb-2 flex-wrap">
                        <p className="font-black text-slate-800 text-base">{a.title}</p>
                        <Badge variant={APP_BADGE[a.appStatus]}>{a.appStatus}</Badge>
                      </div>
                      <p className="text-slate-500 text-sm mb-2">
                        {a.client} · Applied {a.appliedDate}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {a.skills.slice(0, 3).map(s => <Chip key={s} label={s} />)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-blue-900 text-lg">
                        ${a.budgetMin.toLocaleString()}–${a.budgetMax.toLocaleString()}
                      </p>
                      <p className="text-slate-400 text-sm mb-3">{a.duration}</p>
                      <Btn
                        size="sm" variant="outline"
                        onClick={e => { e.stopPropagation(); setSelectedProject(a); setPage("project-detail"); }}
                      >
                        View Details →
                      </Btn>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── PROFILE EDIT TAB ── */}
        {tab === "profile" && (
          <div className="max-w-xl">
            <Card className="p-8">
              <h2 className="text-xl font-black text-slate-800 mb-1">Edit Developer Profile</h2>
              <p className="text-slate-500 text-sm mb-5">Your profile is visible to clients on the marketplace</p>

              {/* Name (read-only) */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  value={dev.name} readOnly
                  className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Contact support to change your name.</p>
              </div>

              {/* Primary skill */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Primary Skill</label>
                <input
                  defaultValue={dev.primary}
                  className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              {/* Hourly rate */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hourly Rate (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    defaultValue={dev.rate}
                    type="number"
                    className="w-full border border-slate-200 rounded-xl py-2.5 pl-7 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short Bio</label>
                <textarea
                  rows={4}
                  value={bioEdit}
                  onChange={e => setBioEdit(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                />
              </div>

              {/* Portfolio URL */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Portfolio / GitHub URL</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔗</span>
                  <input
                    value={portfolioEdit}
                    onChange={e => setPortfolioEdit(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <Btn onClick={handleSave}>Save Changes</Btn>
                {saved && (
                  <span className="text-emerald-600 text-sm font-semibold flex items-center gap-1">
                    ✓ Saved successfully
                  </span>
                )}
              </div>
            </Card>

            {/* Availability toggle */}
            <Card className="p-5 mt-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">Availability Status</p>
                <p className="text-sm text-slate-500">Controls whether you appear in client searches</p>
              </div>
              <div
                onClick={() => setIsAvailable(v => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors
                ${isAvailable ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-red-400"}`} />
                {isAvailable ? "Available for Work" : "Currently Busy"}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}