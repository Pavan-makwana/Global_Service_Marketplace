import { useState, useEffect } from "react";
import { TopNav, Card, Badge, Chip, Btn, TabBar, Avatar, Stars, MatchRing, Textarea, Input } from "../components/ui";
import { URGENCY_VARIANT, STATUS_VARIANT } from "../constants/data"; 
import { 
  Target, CircleDollarSign, Clock, Globe, Building2, Folder, 
  Users, Inbox, Check, RefreshCw, Hourglass 
} from "lucide-react";

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

export default function ProjectDetailPage({ project, setPage, role, setSelectedDev, onApply, onLogout }) {
  const p = project || {};

  const [tab, setTab]               = useState("overview");
  const [proposal, setProposal]     = useState("");
  const [proposalDays, setProposalDays] = useState("");
  const [proposalRate, setProposalRate] = useState("");
  const [applied, setApplied]       = useState(false);

  const [recommended, setRecommended] = useState([]);
  const [applicantsList, setApplicantsList] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (!p.id) return;
    
    const fetchProjectData = async () => {
      setLoadingAI(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const recRes = await fetch(`http://localhost:5000/api/matching/projects/${p.id}/recommendations`, { headers });
        if (recRes.ok) {
          const recData = await recRes.json();
          setRecommended(recData);
        }

        if (role === 'client' || role === 'admin') {
          const appRes = await fetch(`http://localhost:5000/api/projects/${p.id}/applicants`, { headers });
          if (appRes.ok) {
            const appData = await appRes.json();
            setApplicantsList(appData);
          }
        }
      } catch (err) {
        console.error("Failed to fetch project data:", err);
      } finally {
        setLoadingAI(false);
      }
    };
    
    fetchProjectData();
  }, [p.id, role]);

  const handleApplyToProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/developers/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          project_id: p.id,
          proposal_text: proposal,
          expected_days: parseInt(proposalDays) || 30
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Your Calculated Match Score:", result.calculated_match_score);
        setApplied(true);
        if (onApply) onApply(p.id);
      } else {
        const err = await response.json();
        alert(err.message); 
      }
    } catch (error) {
      console.error("Application failed", error);
    }
  };

  const urgVariant = URGENCY_VARIANT[p.urgency] || "gray";
  const statVariant = STATUS_VARIANT[p.status] || "gray";
  const backRoute = role === "client" ? "client-dashboard" : "marketplace";

  const TABS = [
    { id:"overview",    label:"Overview" },
    { id:"recommended", label:`Recommended (${recommended.length})` },
    { id:"applicants",  label:`Applicants (${applicantsList.length})` },
    { id:"timeline",    label:"Timeline" },
    ...(role === "developer" ? [{ 
      id:"apply", 
      label: applied ? <span className="flex items-center gap-1.5">Applied <Check className="w-4 h-4" /></span> : "Apply Now" 
    }] : []),
  ];

  if (!p.id) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Loading Project...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav setPage={setPage} role={role} onLogout={onLogout || (() => setPage("home"))} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={() => setPage(backRoute)}
          className="flex items-center gap-2 text-sm text-sky-600 font-semibold mb-5 hover:gap-3 transition-all"
        >
          ← Back to {role === "client" ? "Dashboard" : "Marketplace"}
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
            <div className="text-right shrink-0">
              <p className="text-2xl font-black text-blue-900">
                ${p.budgetMin?.toLocaleString() || 0}–${p.budgetMax?.toLocaleString() || 0}
              </p>
              <p className="text-slate-500 text-sm mb-3">{p.duration}</p>
              {role === "developer" && !applied && (
                <Btn onClick={() => setTab("apply")}>Apply Now →</Btn>
              )}
              {applied && <Badge variant="green">✓ Applied</Badge>}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-slate-100">
            {p.skills && p.skills.map(s => <Chip key={s} label={s} />)}
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
                    { label:"Budget",      val:`$${p.budgetMin?.toLocaleString()}–$${p.budgetMax?.toLocaleString()}`, icon: <CircleDollarSign className="w-5 h-5 text-slate-500" /> },
                    { label:"Duration",    val:p.duration,    icon: <Clock className="w-5 h-5 text-slate-500" /> },
                    { label:"Country",     val:p.country,     icon: <Globe className="w-5 h-5 text-slate-500" /> },
                    { label:"Industry",    val:p.industry,    icon: <Building2 className="w-5 h-5 text-slate-500" /> },
                    { label:"Category",    val:p.category,    icon: <Folder className="w-5 h-5 text-slate-500" /> },
                    { label:"Applicants",  val:`${applicantsList.length || p.applicants || 0}`, icon: <Users className="w-5 h-5 text-slate-500" /> },
                  ].map(m => (
                    <div key={m.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="mb-2">{m.icon}</div>
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
                  <Target className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-blue-800 text-sm font-semibold">
                    AI engine ranked these developers based on skill overlap with{" "}
                    <strong>{p.skills?.slice(0, 2).join(", ")}</strong>
                    {p.skills?.length > 2 && ` and ${p.skills.length - 2} more skill${p.skills.length - 2 > 1 ? "s" : ""}`}, plus experience, rating, and on-time delivery.
                  </p>
                </div>
                
                {loadingAI ? (
                  <div className="text-center py-10 font-bold text-slate-400 flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-slate-300" />
                    Running AI Matcher...
                  </div>
                ) : (
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
                            <Avatar initials={dev.initials || "DEV"} size="lg" color={AVATAR_COLORS[i % 6]} />
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
                                  {dev.skills?.slice(0, 4).map(s => <Chip key={s} label={s} />)}
                                </div>
                                <Stars rating={dev.rating} />
                              </div>
                              <div className="flex items-center gap-4 shrink-0">
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
                )}
              </div>
            )}

            {tab === "applicants" && (
              <div className="flex flex-col gap-4">
                {applicantsList.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <div className="flex justify-center mb-4">
                      <Inbox className="w-12 h-12 text-slate-300" />
                    </div>
                    <p className="font-semibold text-slate-600 text-lg">No applicants yet</p>
                    <p className="text-sm mt-1">Share this project to attract developers</p>
                  </div>
                ) : applicantsList.map((app, i) => {
                  const initials = app.name ? app.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : "DEV";
                  return (
                  <Card key={app.id} className="p-6">
                    <div className="flex gap-4 items-start">
                      <Avatar initials={initials} size="md" color={AVATAR_COLORS[i % 4]} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800">
                          {app.name}
                          <span className="text-slate-400 text-sm font-normal"> · {app.title}</span>
                        </p>
                        <p className="text-xs text-slate-500 italic mt-1">
                          "{app.proposal_text}"
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Proposed:{" "}
                          <span className="font-semibold text-slate-600">{app.expected_days} days</span>
                          {" "}· ${app.hourly_rate}/hr
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <MatchRing score={Math.round(app.matching_score)} size={52} />
                        {role === "client" && (
                          <div className="flex flex-col gap-1.5">
                            <Btn size="sm" variant="success">Select</Btn>
                            <Btn size="sm" variant="danger">Decline</Btn>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )})}
              </div>
            )}

            {tab === "timeline" && (
              <Card className="p-8">
                <h2 className="text-xl font-black text-slate-800 mb-6">Project Timeline</h2>
                {TIMELINE_STEPS.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                          ${i < 2 ? "bg-emerald-500 text-white"
                          : i === 2 ? "bg-blue-900 text-white"
                          : "bg-slate-100 text-slate-400 border-2 border-slate-200"}`}
                      >
                        {i < 2 ? <Check className="w-4 h-4" /> : i + 1}
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-8 my-1 ${i < 2 ? "bg-emerald-300" : "bg-slate-200"}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`font-semibold text-sm ${i <= 2 ? "text-slate-800" : "text-slate-400"}`}>
                        {step}
                      </p>
                      <div className="text-xs mt-1 flex items-center gap-1.5 font-medium">
                        {i < 2 ? (
                          <><Check className="w-3.5 h-3.5 text-emerald-500" /><span className="text-slate-500">Completed</span></>
                        ) : i === 2 ? (
                          <><RefreshCw className="w-3.5 h-3.5 text-blue-500" /><span className="text-blue-600">In Progress</span></>
                        ) : (
                          <><Hourglass className="w-3.5 h-3.5 text-slate-400" /><span className="text-slate-400">Upcoming</span></>
                        )}
                      </div>
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
                  value={proposalRate} onChange={setProposalRate} 
                  icon={<CircleDollarSign className="w-5 h-5 text-slate-400" />}
                />
                <Input
                  label="Expected Delivery (days)" placeholder="e.g. 45"
                  value={proposalDays} onChange={setProposalDays} 
                  icon={<Clock className="w-5 h-5 text-slate-400" />}
                />
                <Textarea
                  label="Cover Letter / Proposal"
                  placeholder="Describe your approach, relevant experience, and why you're the best fit for this project…"
                  value={proposal} onChange={setProposal}
                  rows={5} required
                />
                <div className="flex gap-3">
                  <Btn full size="lg" onClick={handleApplyToProject}>
                    Submit Application →
                  </Btn>
                  <Btn variant="ghost" onClick={() => setTab("overview")}>Cancel</Btn>
                </div>
              </Card>
            )}

            {tab === "apply" && applied && (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
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
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-amber-600" />
                  </div>
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
                  <p className="text-xs font-bold text-blue-700 mb-3 flex items-center gap-1.5">
                    <Target className="w-4 h-4" /> YOUR MATCH SCORE
                  </p>
                  <div className="flex items-center gap-3">
                    <MatchRing score={85} size={60} />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Based on your skills matching{" "}
                      {p.skills?.slice(0, 2).join(", ")} and {p.skills?.length - 2 > 0 ? `${p.skills.length - 2} more` : "others"} in this project.
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