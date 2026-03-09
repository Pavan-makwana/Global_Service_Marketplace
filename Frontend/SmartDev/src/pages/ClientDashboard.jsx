import { useState } from "react";
import { TopNav, Card, StatTile, Badge, Chip, Btn, TabBar, Avatar, Stars, MatchRing, Stepper } from "../components/ui";
import { DEVS, SKILLS_LIST } from "../constants/data";


export default function ClientDashboard({ setPage, setSelectedProject, onLogout, projects = [] }) {
  const [tab, setTab] = useState("projects");

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav setPage={setPage} role="client" onLogout={onLogout || (() => setPage("home"))} />

      <div className="bg-linear-to-r from-amber-700 to-orange-600 py-10 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">Client Dashboard</h1>
            <p className="text-amber-100 text-sm mt-0.5">Manage your projects and review developer matches</p>
          </div>
          <Btn variant="white" onClick={() => setTab("post")}>+ Post New Project</Btn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatTile label="My Projects"     value="9"       sub="3 active"            icon="📋" topColor="bg-amber-500"  />
          <StatTile label="Total Spend"     value="$128K"   sub="Across 9 projects"   icon="💰" topColor="bg-emerald-500"/>
          <StatTile label="Avg Match Score" value="91%"     sub="AI recommendations"  icon="🎯" topColor="bg-sky-500"    />
          <StatTile label="Avg Dev Rating"  value="4.93★"   sub="From completed work" icon="⭐" topColor="bg-blue-900"   />
        </div>

        <TabBar
          tabs={[
            { id:"projects",        label:"My Projects" },
            { id:"recommendations", label:"AI Recommendations" },
            { id:"post",            label:"+ Post Project" },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === "projects" && (
          <div className="flex flex-col gap-4">
            {projects.map(p => (
              <Card
                key={p.id}
                className="p-6"
                onClick={() => { setSelectedProject(p); setPage("project-detail"); }}
              >
                <div className="flex justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-60">
                    <div className="flex gap-2 items-center mb-2 flex-wrap">
                      <p className="font-black text-slate-800 text-base">{p.title}</p>
                      <Badge variant={p.status === "Open" ? "green" : "sky"}>{p.status}</Badge>
                      <Badge variant={p.urgency === "High" ? "amber" : "sky"}>{p.urgency}</Badge>
                    </div>
                    <p className="text-slate-500 text-sm mb-2">
                      {p.category} · Posted{" "}
                      {new Date(p.posted).toLocaleDateString("en", { month:"short", day:"numeric" })}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.skills.slice(0, 3).map(s => <Chip key={s} label={s} />)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-blue-900 text-lg">
                      ${p.budgetMin.toLocaleString()}–${p.budgetMax.toLocaleString()}
                    </p>
                    <p className="text-slate-400 text-sm mb-3">👥 {p.applicants} applicants</p>
                    <Btn
                      size="sm" variant="outline"
                      onClick={e => { e.stopPropagation(); setSelectedProject(p); setPage("project-detail"); }}
                       className="px-3 py-1.5 text-sm font-semibold border-2 border-blue-900 text-blue-900 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      Manage →
                    </Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "recommendations" && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex items-start gap-3">
              <span className="text-xl shrink-0">🎯</span>
              <p className="text-blue-800 text-sm font-semibold">
                AI engine ranked these developers across all your open projects using the weighted matching formula
                (Skills 40% + Experience 20% + Rating 30% + On-Time 10%).
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEVS.filter(d => d.avail).map(dev => (
                <Card key={dev.id} className="p-5">
                  <div className="flex gap-3 items-start mb-4">
                    <Avatar initials={dev.initials} size="md" color="blue" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800">
                        {dev.name}
                        <span className="text-slate-400 text-sm font-normal"> · {dev.country}</span>
                      </p>
                      <p className="text-sky-600 text-sm font-semibold">{dev.title}</p>
                    </div>
                    <MatchRing score={dev.match} size={52} />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {dev.skills.slice(0, 3).map(s => <Chip key={s} label={s} />)}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <Stars rating={dev.rating} />
                      <p className="text-xs text-slate-400">${dev.rate}/hr · {dev.reviews} reviews</p>
                    </div>
                    <Btn size="sm">Invite →</Btn>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab === "post" && <PostProjectForm onSuccess={() => setTab("projects")} />}
      </div>
    </div>
  );
}

function PostProjectForm({ onSuccess }) {
  const [step, setStep]               = useState(0);
  const [done, setDone]               = useState(false);

  const [title, setTitle]             = useState("");
  const [desc, setDesc]               = useState("");
  const [category, setCategory]       = useState("");
  const [urgency, setUrgency]         = useState("");
  const [duration, setDuration]       = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [budgetMin, setBudgetMin]     = useState("");
  const [budgetMax, setBudgetMax]     = useState("");

  const toggleSkill = s => setSelectedSkills(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );

  if (done) return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-20 h-20 bg-linear-to-br from-amber-500 to-sky-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl">
        🚀
      </div>
      <h2 className="text-2xl font-black text-slate-800 mb-3">Project Published!</h2>
      <p className="text-slate-500 mb-6">
        The AI matching engine is now ranking developers for <strong>"{title || "your project"}"</strong>.
        You'll see recommendations in seconds.
      </p>
      <Btn full size="lg" variant="amber" onClick={onSuccess}>Back to Dashboard →</Btn>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-5">
        <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
          🏢 POST A PROJECT
        </span>
        <h2 className="text-xl font-black text-slate-800">Create New Project</h2>
      </div>

      <Stepper steps={["Basic Info", "Skills & Budget", "Review"]} current={step} />

      <Card className="p-8">

        {step === 0 && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title <span className="text-red-500">*</span></label>
              <input
                placeholder="e.g. E-Commerce Platform Rebuild"
                value={title} onChange={e => setTitle(e.target.value)}
                className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea
                rows={5}
                placeholder="Describe scope, goals, technical requirements, and expected deliverables…"
                value={desc} onChange={e => setDesc(e.target.value)}
                className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
                  {["","Engineering","Design","AI & Data","Marketing","Web3"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Urgency <span className="text-red-500">*</span></label>
                <select value={urgency} onChange={e => setUrgency(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
                  {["","High — ASAP","Medium — Flexible","Low — No Rush"].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expected Duration <span className="text-red-500">*</span></label>
              <input
                placeholder="e.g. 8 weeks"
                value={duration} onChange={e => setDuration(e.target.value)}
                className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-sm font-bold text-slate-700 mb-2">Required Skills <span className="text-red-500">*</span></p>
            <div className="flex flex-wrap gap-2 mb-5">
              {SKILLS_LIST.map(s => (
                <button key={s} onClick={() => toggleSkill(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                    ${selectedSkills.includes(s)
                      ? "bg-blue-900 text-white border-blue-900 shadow"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Budget Min (USD) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" placeholder="10000"
                    value={budgetMin} onChange={e => setBudgetMin(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl py-2.5 pl-7 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Budget Max (USD) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" placeholder="25000"
                    value={budgetMax} onChange={e => setBudgetMax(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl py-2.5 pl-7 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-black text-slate-800 mb-4">Review Your Project</h3>
            {[
              ["Title",    title      || "Not set"],
              ["Category", category   || "Not set"],
              ["Urgency",  urgency    || "Not set"],
              ["Duration", duration   || "Not set"],
              ["Budget",   budgetMin && budgetMax ? `$${budgetMin}–$${budgetMax}` : "Not set"],
              ["Skills",   selectedSkills.join(", ") || "None selected"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-2.5 border-b border-slate-100 last:border-0 text-sm">
                <span className="text-slate-500 font-semibold">{l}</span>
                <span className="text-slate-800 font-bold text-right max-w-xs">{v}</span>
              </div>
            ))}
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-800">
              <strong>🎯 After submission,</strong> the AI matching engine will automatically rank the top developers and notify you within seconds.
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Btn variant="ghost" onClick={() => setStep(s => s - 1)}>← Back</Btn>
          )}
          <button
            onClick={() => { if (step < 2) setStep(s => s + 1); else setDone(true); }}
            className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl transition-colors shadow-md"
          >
            {step < 2 ? "Continue →" : "Publish Project 🚀"}
          </button>
        </div>
      </Card>
    </div>
  );
}