import { Card, Btn, Logo } from "../components/ui";


const FEATURES = [
  { icon:"🎯", title:"AI Smart Matching",   desc:"Weighted algorithm scores on skills (40%), experience (20%), ratings (30%), on-time delivery (10%).", bg:"bg-blue-50"   },
  { icon:"🌍", title:"Global Talent Pool",  desc:"Pre-vetted professionals across 80+ countries and 20+ technology domains.",                           bg:"bg-sky-50"    },
  { icon:"⚡", title:"Fast Shortlisting",  desc:"Reduce candidate shortlisting time by 60%. Get top-5 developer recommendations instantly.",            bg:"bg-amber-50"  },
  { icon:"📊", title:"Live Analytics",     desc:"Real-time dashboards for clients and admins with demand and performance metrics.",                      bg:"bg-emerald-50"},
  { icon:"⭐", title:"Verified Track Record",desc:"Transparent on-time delivery stats, client ratings, and earnings history for every developer.",       bg:"bg-purple-50" },
  { icon:"🔒", title:"Secure & Role-Based",desc:"JWT authentication, encrypted passwords, and strict role-based access control per BRD spec.",          bg:"bg-rose-50"   },
];

const STEPS = [
  { n:"01", icon:"📋", title:"Post Your Project",   desc:"Fill in title, skills, budget, urgency, and timeline via a guided multi-step form.",               role:"Client" },
  { n:"02", icon:"🎯", title:"AI Ranks Developers", desc:"Matching engine scores all eligible developers and returns the top 5–10 ranked candidates.",        role:"Engine" },
  { n:"03", icon:"✅", title:"Review & Hire",       desc:"Browse matches and applicants side by side, select your best fit, and kick off the engagement.",    role:"Client" },
];

const TESTIMONIALS = [
  { name:"Sarah Chen",  role:"Product Manager · Accenture",  text:"Found a senior React developer in under 10 minutes. The match score was spot-on.",         rating:5, initials:"SC" },
  { name:"Raj Patel",   role:"Full-Stack Developer",          text:"Clean platform, real projects, and AI matching that actually sends relevant opportunities.", rating:5, initials:"RP" },
  { name:"Lena Weber",  role:"CTO · FinScale GmbH",           text:"Reduced our hiring cycle by 60%. The admin analytics dashboard is exceptional.",            rating:5, initials:"LW" },
];

export default function HomePage({ setPage }) {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between w-full">
          {/* Left: Logo */}
          <Logo />

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage("dev-login")}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Developer Login
            </button>
            <button
              onClick={() => setPage("client-login")}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Client Login
            </button>

            <div className="w-px h-5 bg-slate-200 mx-1" />

            <button
              onClick={() => setPage("admin-login")}
              className="px-3 py-2 text-sm font-semibold text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Admin
            </button>

            <button
              onClick={() => setPage("dev-register")}
              className="ml-2 px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 pt-20 pb-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage:"linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize:"52px 52px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sky-200 text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            🎯 Smart Matching Engine — Live
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-5 tracking-tight">
            Hire Global Tech Talent.<br />
            <span className="text-sky-300 italic">Matched by Intelligence.</span>
          </h1>
          <p className="text-lg text-blue-200 max-w-xl mx-auto mb-10 leading-relaxed">
            Post a project, let AI find your best-fit developers — or join as a developer and get matched to the work you're built for.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto mb-8">

            <div
              onClick={() => setPage("dev-register")}
              className="bg-white/10 border-2 border-white/20 rounded-2xl p-8 cursor-pointer
                hover:bg-white/20 hover:border-white/40 hover:-translate-y-1 transition-all duration-300
                backdrop-blur-sm text-center group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💻</div>
              <h3 className="text-white font-black text-xl mb-2">Work as Developer</h3>
              <p className="text-blue-200 text-sm leading-relaxed mb-5">
                Build your profile, get AI-matched to global projects, and grow your freelance career.
              </p>
              <div className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white
                text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-lg">
                Join as Developer →
              </div>
            </div>

            <div
              onClick={() => setPage("client-register")}
              className="bg-white/10 border-2 border-white/20 rounded-2xl p-8 cursor-pointer
                hover:bg-white/20 hover:border-white/40 hover:-translate-y-1 transition-all duration-300
                backdrop-blur-sm text-center group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
              <h3 className="text-white font-black text-xl mb-2">Work as Client</h3>
              <p className="text-blue-200 text-sm leading-relaxed mb-5">
                Post projects, receive top developer matches in seconds, and hire the perfect fit globally.
              </p>
              <div className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white
                text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-lg">
                Post a Project →
              </div>
            </div>
          </div>

          <p className="text-blue-300 text-sm">
            Already have an account?{" "}
            <span onClick={() => setPage("dev-login")} className="text-sky-300 font-semibold cursor-pointer underline">
              Sign in
            </span>
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 py-10 px-6 divide-x divide-slate-200">
          {[
            ["14,200+","Verified Developers"],
            ["3,800+","Projects Completed"],
            ["80+","Countries Served"],
            ["98%","Client Satisfaction"],
          ].map(([v,l],i) => (
            <div key={i} className="text-center px-6">
              <p className="text-4xl font-black text-blue-900 tracking-tight">{v}</p>
              <p className="text-sm text-slate-500 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-sky-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
              How It Works
            </span>
            <h2 className="text-4xl font-black text-slate-800">From idea to hired in 3 steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-14 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-300 to-sky-300" />
            {STEPS.map((s, i) => (
              <Card key={i} className="p-8 text-center relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-900 to-sky-500 flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-lg">
                  {s.n}
                </div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <span className="text-xs font-bold text-sky-600 tracking-widest uppercase block mb-2">{s.role}</span>
                <h3 className="font-black text-slate-800 text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-800 mb-2">Built for serious teams</h2>
            <p className="text-slate-500">Every feature designed to reduce friction and increase match quality</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <Card key={f.title} className="p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center text-2xl mb-4`}>{f.icon}</div>
                <h3 className="font-black text-slate-800 text-base mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-3">AI Matching Formula</h2>
          <p className="text-blue-300 mb-10">Transparent, weighted scoring — every recommendation is explainable</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              ["🎯","40%","Skill Match"],
              ["⭐","30%","Client Rating"],
              ["📈","20%","Experience"],
              ["⏱","10%","On-Time Rate"],
            ].map(([icon,pct,label]) => (
              <div key={label} className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-3xl font-black text-white">{pct}</div>
                <div className="text-blue-300 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
          <Btn variant="secondary" size="lg" onClick={() => setPage("client-register")}>
            Get Matched Now →
          </Btn>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-slate-800 text-center mb-12">Trusted worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <Card key={t.name} className="p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_,i) => <span key={i} className="text-amber-400 text-lg">★</span>)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-black text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white border-t border-slate-200 text-center">
        <h2 className="text-4xl font-black text-slate-800 mb-3">Ready to get started?</h2>
        <p className="text-slate-500 mb-8">Join 14,200+ professionals and 3,800+ clients already using SmartDev Marketplace.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Btn size="lg" onClick={() => setPage("dev-register")}>💻 Join as Developer</Btn>
          <Btn variant="outline" size="lg" onClick={() => setPage("client-register")}>🏢 Post a Project</Btn>
        </div>
      </section>

      <footer className="bg-slate-800 py-8 px-6 text-center">
        <Logo dark />
        <p className="text-slate-500 text-sm mt-3">© 2025 SmartDev Marketplace · Spartan Tech Internal Platform · Frontend: Swastika</p>
        <p className="text-slate-600 text-xs mt-1">
          Admin:{" "}
          <span className="text-sky-400 font-mono">admin@SmartDev Marketplace.com</span>
          {" "}/ <span className="text-sky-400 font-mono">Admin@2025</span>
        </p>
      </footer>
    </div>
  );
}