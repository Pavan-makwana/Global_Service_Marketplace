import { useState, useEffect } from "react";
import { TopNav, Card, Badge, Chip, Btn, TabBar, Avatar, MatchRing } from "../components/ui";
import { 
  ArrowLeft, MapPin, Briefcase, CircleDollarSign, 
  ShieldCheck, MessageSquare, Download, CheckCircle2, Star, Clock 
} from "lucide-react";

export default function DevProfilePage({ dev, setPage, role, onLogout }) {
  const [tab, setTab] = useState("about");
  
  // LIVE STATE for Portfolio & Reviews
  const [pastDeliveries, setPastDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Safely fallback variables so the page never crashes
  const d = {
    id: dev?.id || "",
    name: dev?.name || "Developer",
    initials: dev?.initials || "DV",
    title: dev?.title || "Platform Member",
    country: dev?.country || "Remote",
    bio: dev?.bio || "Experienced professional delivering high-quality results.",
    exp: dev?.exp || 0,
    rating: dev?.rating || 0,
    reviewsCount: dev?.reviews || 0,
    onTime: dev?.onTime || 0,
    earnings: dev?.earnings || 0,
    rate: dev?.rate || 0,
    match: dev?.match || 0,
    avail: dev?.avail !== false, // default true
    skills: dev?.skills || ["JavaScript", "React"],
    primary: dev?.primary || "Software Engineering"
  };

  // Fetch real past deliveries (reviews) from the backend
  useEffect(() => {
    if (!d.id) return;
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        // We will create this backend route next!
        const res = await fetch(`http://localhost:5000/api/developers/${d.id}/portfolio`, { headers });
        if (res.ok) {
          const data = await res.json();
          setPastDeliveries(data);
        }
      } catch(e) {
        console.error("Failed to fetch portfolio:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [d.id]);

  // AI score breakdown
  const SCORE_BREAKDOWN = [
    { label:"Skill Match",      score: Math.round(d.match * 0.4),        max:40,  color:"#1E3A8A" },
    { label:"Client Rating",    score: Math.round((d.rating / 5) * 30),  max:30,  color:"#0EA5E9" },
    { label:"Experience",       score: Math.min(20, Math.round(d.exp*2)),max:20,  color:"#10B981" },
    { label:"On-Time Delivery", score: Math.round(d.onTime / 10),        max:10,  color:"#F59E0B" },
  ];

  if (!dev) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500 font-bold mb-4">No developer selected.</p>
        <Btn onClick={() => setPage(role === "client" ? "client-dashboard" : "marketplace")}>Go Back</Btn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav setPage={setPage} role={role} onLogout={onLogout || (() => setPage("home"))} />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => setPage(
            role === "client" ? "client-dashboard" 
            : role === "developer" ? "marketplace" 
            : role === "admin" ? "admin-dashboard"
            : "marketplace"
          )}
          className="flex items-center gap-2 text-sm text-sky-600 font-semibold mb-5 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <Card className="p-8 mb-6">
          <div className="flex gap-6 flex-wrap">
            <div className="relative shrink-0">
              <Avatar initials={d.initials} size="xl" color="blue" />
              <div
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white
                  ${d.avail ? "bg-emerald-400" : "bg-red-400"}`}
              />
            </div>

            <div className="flex-1 min-w-64">
              <div className="flex flex-wrap gap-2 items-center mb-1">
                <h1 className="text-2xl font-black text-slate-800">{d.name}</h1>
                <Badge variant={d.avail ? "green" : "red"}>
                  {d.avail ? "Available Now" : "Currently Busy"}
                </Badge>
                {d.match > 85 && (
                  <Badge variant="blue"><ShieldCheck className="w-3 h-3 inline mr-1" /> Top Match</Badge>
                )}
              </div>
              <p className="text-sky-600 font-bold text-base mb-1">{d.title}</p>
              
              <div className="flex items-center gap-3 text-slate-500 text-sm mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {d.country}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {d.exp} yrs experience</span>
                <span>·</span>
                <span className="flex items-center gap-1"><CircleDollarSign className="w-4 h-4" /> ${d.rate}/hr</span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed max-w-lg mb-4">{d.bio}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {d.skills.map(s => <Chip key={s} label={s} />)}
              </div>
              <div className="flex gap-2 flex-wrap">
                {role === "client" && (
                  <Btn><span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Hire {d.name.split(" ")[0]}</span></Btn>
                )}
                <Btn variant="outline"><span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Message</span></Btn>
                <Btn variant="ghost"><span className="flex items-center gap-2"><Download className="w-4 h-4" /> Resume</span></Btn>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 self-start shrink-0">
              {[
                { label:"Hourly Rate", val:`$${d.rate}/hr`, color:"text-blue-900"   },
                { label:"Jobs Done",   val:`${d.reviewsCount}`,  color:"text-slate-800"  },
                { label:"On-Time",     val:`${d.onTime}%`,  color:"text-emerald-600"},
                { label:"Earned",      val:`$${(d.earnings/1000).toFixed(0)}K`, color:"text-slate-800" },
              ].map(m => (
                <div key={m.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center min-w-28">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                  <p className={`text-lg font-black ${m.color}`}>{m.val}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-2">
            <TabBar
              tabs={[
                { id:"about",     label:"About" },
                { id:"portfolio", label:"Portfolio & History" },
                { id:"reviews",   label:`Reviews (${d.reviewsCount})` },
              ]}
              active={tab}
              onChange={setTab}
            />

            {tab === "about" && (
              <Card className="p-7">
                <h2 className="text-lg font-black text-slate-800 mb-3">Professional Summary</h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {d.bio} With {d.reviewsCount} verified database deliveries and a {d.onTime}% on-time delivery rate,
                  they bring technical depth and clear communication to every engagement.
                </p>

                <h3 className="font-black text-slate-800 text-base mb-4">Skill Proficiency</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {d.skills.map((s, i) => {
                    const pct = Math.max(75, 98 - i * 4); // Simulate bar width
                    return (
                      <div key={s} className="mb-3">
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-semibold text-slate-700">{s}</span>
                          <span className="font-bold text-blue-900">{pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-blue-900 to-sky-500 rounded-full transition-all"
                            style={{ width:`${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {tab === "portfolio" && (
              <div className="flex flex-col gap-3">
                {loading ? <p className="p-5 text-slate-400 font-bold">Loading past deliveries...</p> : null}
                {!loading && pastDeliveries.length === 0 && <p className="p-5 text-slate-400">No public portfolio items yet.</p>}
                
                {pastDeliveries.map((delivery, i) => (
                  <Card key={i} className="p-5 flex justify-between items-center group hover:border-blue-300 transition-colors cursor-pointer">
                    <div>
                      <p className="font-bold text-slate-800 mb-1.5 group-hover:text-blue-900 transition-colors">
                        {delivery.project_category || "Platform Project"}
                      </p>
                      <div className="flex gap-2 flex-wrap items-center">
                        <Chip label={d.primary} />
                        <Badge variant={delivery.on_time ? "green" : "amber"}>
                          {delivery.on_time ? "Delivered On-Time" : "Delayed Delivery"}
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium">Earned: ${delivery.earnings_usd}</span>
                      </div>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-blue-600 rotate-135 transition-colors" />
                  </Card>
                ))}
              </div>
            )}

            {tab === "reviews" && (
              <Card className="p-7">
                {loading ? <p className="text-slate-400 font-bold">Loading verified reviews...</p> : null}
                {!loading && pastDeliveries.length === 0 && <p className="text-slate-400">No reviews yet.</p>}

                {pastDeliveries.map((r, i) => (
                  <div key={i} className={i < pastDeliveries.length - 1 ? "pb-6 mb-6 border-b border-slate-100" : ""}>
                    <div className="flex justify-between flex-wrap gap-2 mb-2">
                      <div>
                        <p className="font-bold text-slate-800">Verified Client (Project #{r.past_project_id})</p>
                        <p className="text-xs text-slate-500 font-medium">{r.project_category}</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(Math.floor(r.client_rating))].map((_,idx) => <Star key={idx} className="w-3.5 h-3.5 fill-current" />)}
                        <span className="text-xs text-slate-700 ml-2 font-bold text-slate-700">{r.client_rating}/5.0</span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                      "Project completed in {r.delivery_days} days. Developer was highly communicative and delivered requirements."
                    </p>
                  </div>
                ))}
              </Card>
            )}
          </div>

          <div className="flex flex-col gap-4">

            <Card className="p-5">
              <p className="text-sm font-black text-slate-800 mb-4 text-center">AI Match Score</p>
              <div className="flex justify-center mb-5">
                <MatchRing score={d.match} size={100} />
              </div>
              <p className="text-xs text-slate-500 mb-4 text-center">Calculated via BRD Formula</p>
              {SCORE_BREAKDOWN.map(s => (
                <div key={s.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">{s.label}</span>
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

            <Card className="p-5">
              <p className="text-sm font-black text-slate-800 mb-3">Platform Analytics</p>
              {[
                ["Response Time", <span key="1" className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400"/> {"< 2 hrs"}</span>],
                ["Rehire Rate",   "87%"],
                ["Profile Status", <Badge key="3" variant="green">Verified</Badge>],
                ["Platform Since",  "2024"],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0 text-sm">
                  <span className="text-slate-500 font-medium">{l}</span>
                  <span className="font-bold text-slate-800">{v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}