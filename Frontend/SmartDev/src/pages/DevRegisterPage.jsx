import { useState } from "react";
import { Logo, Input, Select, Textarea, PasswordInput, Stepper, Btn, PillLabel, AuthPanel, BenefitList } from "../components/ui";
import { SKILLS_LIST, COUNTRIES } from "../constants/data";

// ─────────────────────────────────────────────────────────────────
// PAGE: Developer Registration (3-step)
// Route: "dev-register"
// Access: Public
// ─────────────────────────────────────────────────────────────────

export default function DevRegisterPage({ setPage, onLogin }) {
  const [step, setStep]           = useState(0);
  const [done, setDone]           = useState(false);
  const [errors, setErrors]       = useState({});

  // Step 0 — Basic Info
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [country, setCountry]     = useState("");

  // Step 1 — Skills & Bio
  const [primary, setPrimary]     = useState("");
  const [exp, setExp]             = useState("");
  const [otherSkills, setOtherSkills] = useState("");
  const [bio, setBio]             = useState("");
  const [portfolio, setPortfolio] = useState("");

  // Step 2 — Password & Terms
  const [pass, setPass]           = useState("");
  const [confirm, setConfirm]     = useState("");
  const [agree, setAgree]         = useState(false);

  // ── VALIDATION ─────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!name)                            e.name    = "Full name is required";
      if (!email || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email is required";
      if (!country)                         e.country = "Country is required";
    }
    if (step === 1) {
      if (!primary) e.primary = "Primary skill is required";
      if (!exp)     e.exp     = "Experience level is required";
    }
    if (step === 2) {
      if (!pass || pass.length < 8) e.pass    = "Minimum 8 characters";
      if (pass !== confirm)          e.confirm = "Passwords do not match";
      if (!agree)                    e.agree   = "You must accept the terms";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step < 2) { setStep(s => s + 1); return; }
    setDone(true);
  };

  // ── SUCCESS SCREEN ─────────────────────────────────────────────
  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-xl">
          ✓
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-3">
          You're in, {name.split(" ")[0]}! 🎉
        </h2>
        <p className="text-slate-500 leading-relaxed mb-6">
          Your developer account is ready. Start browsing projects and getting AI-matched to opportunities.
        </p>
        <Btn full size="lg" onClick={() => onLogin("developer")}>Go to My Dashboard →</Btn>
        <p className="text-sm text-slate-400 mt-3">
          Verification sent to <strong>{email}</strong>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <AuthPanel gradient="bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="relative">
          <Logo dark onClick={() => setPage("home")} />
        </div>
        <div className="flex-1 flex flex-col justify-center relative mt-10">
          <div className="text-6xl mb-4">💻</div>
          <h2 className="text-3xl font-black text-white mb-3 leading-tight">
            Join 14,200+<br />Global Developers
          </h2>
          <p className="text-blue-200 leading-relaxed mb-8">
            Create your profile, get AI-matched to projects worldwide, and build your global reputation.
          </p>
          <BenefitList
            items={[
              "AI-matched to relevant projects",
              "Showcase skills & portfolio",
              "Track applications & earnings",
              "Build your global reputation",
            ]}
          />
        </div>
        <p className="text-blue-400 text-xs relative">
          Admin? Use admin@SmartDev Marketplace.com on the login page.
        </p>
      </AuthPanel>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto">
        {/* top bar */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-200 bg-white">
          <div className="lg:hidden"><Logo onClick={() => setPage("home")} /></div>
          <div className="hidden lg:block" />
          <p className="text-sm text-slate-500">
            Already registered?{" "}
            <span onClick={() => setPage("dev-login")} className="text-blue-900 font-bold cursor-pointer">
              Sign in
            </span>
          </p>
        </div>

        {/* form body */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-8 py-10">
          <div className="mb-6">
            <PillLabel color="blue">💻 DEVELOPER REGISTRATION</PillLabel>
            <h1 className="text-2xl font-black text-slate-800">Create your profile</h1>
          </div>

          <Stepper steps={["Basic Info", "Skills", "Security"]} current={step} />

          {/* ── STEP 0: BASIC INFO ── */}
          {step === 0 && (
            <>
              <Input
                label="Full Name" placeholder="e.g. Aiko Tanaka"
                value={name} onChange={setName}
                icon="👤" error={errors.name} required
              />
              <Input
                label="Email Address" type="email" placeholder="you@example.com"
                value={email} onChange={setEmail}
                icon="✉" error={errors.email} required
              />
              <Select
                label="Country" value={country} onChange={setCountry} required
                options={[{ value:"", label:"Select your country" }, ...COUNTRIES.map(c => ({ value:c, label:c }))]}
              />
              {errors.country && <p className="text-xs text-red-500 -mt-3 mb-3">⚠ {errors.country}</p>}
            </>
          )}

          {/* ── STEP 1: SKILLS & BIO ── */}
          {step === 1 && (
            <>
              <Select
                label="Primary Skill" value={primary} onChange={setPrimary} required
                options={[{ value:"", label:"Select primary skill" }, ...SKILLS_LIST.map(s => ({ value:s, label:s }))]}
              />
              {errors.primary && <p className="text-xs text-red-500 -mt-3 mb-3">⚠ {errors.primary}</p>}

              <Select
                label="Years of Experience" value={exp} onChange={setExp} required
                options={[
                  { value:"", label:"Select experience level" },
                  { value:"0-1", label:"0–1 years" },
                  { value:"1-3", label:"1–3 years" },
                  { value:"3-5", label:"3–5 years" },
                  { value:"5-8", label:"5–8 years" },
                  { value:"8-12",label:"8–12 years" },
                  { value:"12+", label:"12+ years" },
                ]}
              />
              {errors.exp && <p className="text-xs text-red-500 -mt-3 mb-3">⚠ {errors.exp}</p>}

              <Input
                label="Other Skills" placeholder="React, AWS, Docker…"
                value={otherSkills} onChange={setOtherSkills}
                icon="🛠" hint="Optional: comma-separated list"
              />
              <Textarea
                label="Short Bio"
                placeholder="Tell clients about your expertise, working style, and the kinds of projects you love…"
                value={bio} onChange={setBio} rows={3}
              />
              <Input
                label="Portfolio / GitHub URL" placeholder="https://yourportfolio.com"
                value={portfolio} onChange={setPortfolio}
                icon="🔗" hint="Optional"
              />
            </>
          )}

          {/* ── STEP 2: SECURITY ── */}
          {step === 2 && (
            <>
              {/* summary box */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 text-sm">
                <p className="font-bold text-blue-900 mb-0.5">Account Summary</p>
                <p className="text-blue-700">{name} · {primary || "—"} · {exp || "—"} · {country}</p>
                <p className="text-blue-600 text-xs mt-0.5">{email}</p>
              </div>

              <PasswordInput
                label="Create Password" value={pass} onChange={setPass}
                error={errors.pass} showStrength required
              />
              <PasswordInput
                label="Confirm Password" value={confirm} onChange={setConfirm}
                error={errors.confirm} required
              />

              <label className="flex items-start gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox" checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                  className="mt-1 accent-blue-900"
                />
                <span className="text-sm text-slate-600">
                  I agree to the{" "}
                  <span className="text-blue-900 font-semibold">Terms of Service</span>
                  {" "}and{" "}
                  <span className="text-blue-900 font-semibold">Privacy Policy</span>
                </span>
              </label>
              {errors.agree && <p className="text-xs text-red-500 -mt-3 mb-3">⚠ {errors.agree}</p>}
            </>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="flex gap-3 mt-2">
            {step > 0 && (
              <Btn variant="ghost" onClick={() => setStep(s => s - 1)}>← Back</Btn>
            )}
            <Btn full onClick={next}>
              {step < 2 ? "Continue →" : "Create Developer Account ✓"}
            </Btn>
          </div>
        </div>

        {/* bottom link */}
        <div className="text-center py-4 border-t border-slate-200 bg-white">
          <p className="text-sm text-slate-500">
            Looking to hire instead?{" "}
            <span onClick={() => setPage("client-register")} className="text-blue-900 font-bold cursor-pointer">
              Register as Client →
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
