import { useState } from "react";
import { TopNav, Card, Badge, Chip, Btn, TabBar, Avatar, Stars, MatchRing, Textarea, Input } from "../components/ui";
import { DEVS, PROJECTS, URGENCY_VARIANT, STATUS_VARIANT } from "../constants/data";


const TIMELINE_STEPS = [
  "Requirements Finalised",
  "Design & Architecture",
  "Development Sprint 1",
  "Development Sprint 2",
  "Testing & QA",
  "Client Review",
  "Launch & Handover",
];

const AVATAR_COLORS = ["blue","sky","green","amber","purple","pink"];

export default function ProjectDetailPage({ project, setPage, role, setSelectedDev, onApply }) {
  const p = project || PROJECTS[0];

  const [tab, setTab]               = useState("overview");
  const [proposal, setProposal]     = useState("");
  const [proposalDays, setProposalDays] = useState("");
  const [proposalRate, setProposalRate] = useState("");
  const [applied, setApplied]       = useState(false);

  const recommended = DEVS
    .filter(d => d.skills.some(s => p.skills.includes(s)))
    .sort((a, b) => b.match - a.match)
    .slice(0, 5);

  const urgVariant = URGENCY_VARIANT[p.urgency] || "gray";
  const statVariant = STATUS_VARIANT[p.status] || "gray";

  const backRoute = role === "client" ? "client-dashboard" : role === "developer" ? "marketplace" : "marketplace";

  const TABS = [
    { id:"overview",     label:"Overview" },
    { id:"recommended",  label:`Recommended (${recommended.length})` },
    { id:"applicants",   label:`Applicants (${p.applicants})` },
    { id:"timeline",     label:"Timeline" },
    ...(role === "developer" ? [{ id:"apply", label: applied ? "Applied ✓" : "Apply Now" }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav setPage={setPage} role={role} onLogout={() => setPage("home")} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={() => setPage(backRoute)}
          className="flex items-center gap-2 text-sm text-sky-600 font-semibold mb-5 hover:gap-3 transition-all"
        >
          ← Back
        </button>

        <Card className="p-8 mb-6">
          <div className="flex justify-between flex-wrap gap-5">
            <div className="flex-1 min-w-64">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant={statVariant}>{p.status}</Badge>
                <Badge variant="blue">{p.category}</Badge>
                <Badge variant={urgVariant}>{p.urgency} Urgency</Badge>
              </div>
              <h1 className="text-2xl font-black text-slate-800 mb-2">{p.title}</h1>
              <p className="text-slate-500 text-sm">
                By <strong className="text-slate-700">{p.client}</strong>
                {" "}· {p.country} · {p.industry}
                {" "}· Posted{" "}
                {new Date(p.posted).toLocaleDateString("en", { year:"numeric", month:"long", day:"numeric" })}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-black text-blue-900">
                ${p.budgetMin.toLocaleString()}–${p.budgetMax.toLocaleString()}
              </p>
              <p className="text-slate-500 text-sm mb-3">{p.duration}</p>
              {role === "developer" && !applied && (
                <Btn onClick={() => setTab("apply")}>Apply Now →</Btn>
              )}
              {applied && <Badge variant="green">✓ Applied</Badge>}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-slate-100">
            {p.skills.map(s => <Chip key={s} label={s} />)}
          </div>
        </Card>

        <TabBar tabs={TABS} active={tab} onChange={setTab} />

        <div className={`grid gap-6 ${tab === "recommended" || tab === "applicants" ? "grid-cols-1" : "grid-cols-3"}`}>
          <div className={tab === "recommended" || tab === "applicants" ? "" : "col-span-2"}>

            {tab === "overview" && (
              <Card className="p-8">
                <h2 className="text-xl font-black text-slate-800 mb-4">Project Description</h2>
                <p className="text-slate-600 leading-relaxed mb-8">{p.desc}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label:"Budget",      val:`$${p.budgetMin.toLocaleString()}–$${p.budgetMax.toLocaleString()}`, icon:"💰" },
                    { label:"Duration",    val:p.duration,    icon:"⏱" },
                    { label:"Country",     val:p.country,     icon:"🌍" },
                    { label:"Industry",    val:p.industry,    icon:"🏢" },
                    { label:"Category",    val:p.category,    icon:"📁" },
                    { label:"Applicants",  val:`${p.applicants}`, icon:"👥" },
                  ].map(m => (
                    <div key={m.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <p className="text-xl mb-1">{m.icon}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                      <p className="font-bold text-slate-800 text-sm">{m.val}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {tab === "recommended" && (
              <div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">🎯</span>
                  <p className="text-blue-800 text-sm font-semibold">
                    AI engine ranked these developers based on skill overlap with{" "}
                    <strong>{p.skills.slice(0, 2).join(", ")}</strong>
                    {p.skills.length > 2 && ` and ${p.skills.length - 2} more skill${p.skills.length - 2 > 1 ? "s" : ""}`}, plus experience, rating, and on-time delivery.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {recommended.map((dev, i) => (
                    <Card
                      key={dev.id}
                      className="p-6"
                      onClick={() => { setSelectedDev(dev); setPage("dev-profile"); }}
                    >
                      <div className="flex gap-4 items-start">
                        <div className="relative">
                          {i === 0 && (
                            <span className="absolute -top-2 -left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
                              TOP
                            </span>
                          )}
                          <Avatar initials={dev.initials} size="lg" color={AVATAR_COLORS[i % 6]} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between flex-wrap gap-3">
                            <div>
                              <p className="font-black text-slate-800 text-base">
                                {dev.name}
                                <span className="font-normal text-slate-400 text-sm"> · {dev.country}</span>
                              </p>
                              <p className="text-sky-600 text-sm font-semibold mb-2">{dev.title}</p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {dev.skills.slice(0, 4).map(s => <Chip key={s} label={s} />)}
                              </div>
                              <Stars rating={dev.rating} />
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0">
                              <div className="text-right">
                                <p className="font-black text-blue-900 text-base">${dev.rate}/hr</p>
                                <p className="text-xs text-slate-400">On-time: {dev.onTime}%</p>
                                <Badge variant={dev.avail ? "green" : "red"}>
                                  {dev.avail ? "Available" : "Busy"}
                                </Badge>
                              </div>
                              <MatchRing score={dev.match} size={64} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                        <Btn size="sm" variant="ghost">Save</Btn>
                        <Btn
                          size="sm" variant="outline"
                          onClick={e => { e.stopPropagation(); setSelectedDev(dev); setPage("dev-profile"); }}
                        >
                          View Profile
                        </Btn>
                        {role === "client" && <Btn size="sm">Invite to Apply</Btn>}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {tab === "applicants" && (
              <div className="flex flex-col gap-4">
                {DEVS.slice(0, Math.min(p.applicants, 4)).length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="font-semibold text-slate-600 text-lg">No applicants yet</p>
                    <p className="text-sm mt-1">Share this project to attract developers</p>
                  </div>
                ) : DEVS.slice(0, Math.min(p.applicants, 4)).map((dev, i) => (
                  <Card key={dev.id} className="p-6">
                    <div className="flex gap-4 items-start">
                      <Avatar initials={dev.initials} size="md" color={AVATAR_COLORS[i % 4]} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800">
                          {dev.name}
                          <span className="text-slate-400 text-sm font-normal"> · {dev.title}</span>
                        </p>
                        <p className="text-xs text-slate-500 italic mt-1">
                          "I have {dev.exp} years of {dev.primary} experience and would love to bring value to this project…"
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Proposed:{" "}
                          <span className="font-semibold text-slate-600">{dev.exp * 3 + 10} days</span>
                          {" "}· ${dev.rate}/hr
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <MatchRing score={dev.match} size={52} />
                        {role === "client" && (
                          <div className="flex flex-col gap-1.5">
                            <Btn size="sm" variant="success">Select</Btn>
                            <Btn size="sm" variant="danger">Decline</Btn>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {tab === "timeline" && (
              <Card className="p-8">
                <h2 className="text-xl font-black text-slate-800 mb-6">Project Timeline</h2>
                {TIMELINE_STEPS.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                          ${i < 2 ? "bg-emerald-500 text-white"
                          : i === 2 ? "bg-blue-900 text-white"
                          : "bg-slate-100 text-slate-400 border-2 border-slate-200"}`}
                      >
                        {i < 2 ? "✓" : i + 1}
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-8 my-1 ${i < 2 ? "bg-emerald-300" : "bg-slate-200"}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`font-semibold text-sm ${i <= 2 ? "text-slate-800" : "text-slate-400"}`}>
                        {step}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {i < 2 ? "✅ Completed" : i === 2 ? "🔄 In Progress" : "⏳ Upcoming"}
                      </p>
                    </div>
                  </div>
                ))}
              </Card>
            )}

            {tab === "apply" && !applied && (
              <Card className="p-8">
                <h2 className="text-xl font-black text-slate-800 mb-1">Submit Your Application</h2>
                <p className="text-slate-500 text-sm mb-6">Tailor your proposal to this project's specific needs</p>
                <Input
                  label="Your Proposed Rate ($/hr)" placeholder="e.g. 120"
                  value={proposalRate} onChange={setProposalRate} icon="💰"
                />
                <Input
                  label="Expected Delivery (days)" placeholder="e.g. 45"
                  value={proposalDays} onChange={setProposalDays} icon="⏱"
                />
                <Textarea
                  label="Cover Letter / Proposal"
                  placeholder="Describe your approach, relevant experience, and why you're the best fit for this project…"
                  value={proposal} onChange={setProposal}
                  rows={5} required
                />
                <div className="flex gap-3">
                  <Btn full size="lg" onClick={() => { setApplied(true); onApply && onApply(p.id); }}>
                    Submit Application →
                  </Btn>
                  <Btn variant="ghost" onClick={() => setTab("overview")}>Cancel</Btn>
                </div>
              </Card>
            )}

            {tab === "apply" && applied && (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                <h2 className="text-xl font-black text-slate-800 mb-2">Application Submitted!</h2>
                <p className="text-slate-500 mb-5">
                  The client will review your proposal and contact you if shortlisted.
                </p>
                <Btn onClick={() => setPage("dev-dashboard")}>View My Applications</Btn>
              </Card>
            )}
          </div>

          {tab !== "recommended" && tab !== "applicants" && (
            <div className="flex flex-col gap-4">

              <Card className="p-5">
                <h3 className="font-black text-slate-800 text-sm mb-4">About the Client</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">🏢</div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">{p.client}</p>
                    <p className="text-xs text-slate-500">{p.country}</p>
                  </div>
                </div>
                {[
                  ["Projects Posted", "9"],
                  ["Avg Rating Given","4.8 ★"],
                  ["Total Spend",     "$128K+"],
                  ["Hire Rate",       "72%"],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                    <span className="text-slate-500">{l}</span>
                    <span className="font-bold">{v}</span>
                  </div>
                ))}
              </Card>

              {role === "developer" && (
                <Card className="p-5 bg-blue-50 border-blue-100">
                  <p className="text-xs font-bold text-blue-700 mb-3">🎯 YOUR MATCH SCORE</p>
                  <div className="flex items-center gap-3">
                    <MatchRing score={96} size={60} />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Based on your skills matching{" "}
                      {p.skills.slice(0, 2).join(", ")} and {p.skills.length - 2} more in this project.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}