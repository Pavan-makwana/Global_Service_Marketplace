import { useState } from "react";
import { Logo, Input, Select, PasswordInput, Stepper, Btn, PillLabel, AuthPanel, BenefitList } from "../components/ui";
import { COUNTRIES } from "../constants/data";
import { Building2, CheckCircle2 } from "lucide-react";

const SIZES = [
  { value:"",      label:"Select company size" },
  { value:"1-10",  label:"1–10 employees" },
  { value:"11-50", label:"11–50 employees" },
  { value:"51-200",label:"51–200 employees" },
  { value:"201-500",label:"201–500 employees" },
  { value:"500+",  label:"500+ employees" },
];

const INDUSTRIES = [
  { value:"",            label:"Select industry" },
  { value:"Technology",  label:"Technology" },
  { value:"Fintech",     label:"Fintech" },
  { value:"Healthcare",  label:"Healthcare" },
  { value:"E-Commerce",  label:"E-Commerce" },
  { value:"SaaS",        label:"SaaS" },
  { value:"Education",   label:"Education" },
  { value:"Media",       label:"Media" },
  { value:"Manufacturing",label:"Manufacturing" },
  { value:"Other",       label:"Other" },
];

export default function ClientRegisterPage({ setPage, onLogin }) {
  const [step, setStep]         = useState(0);
  const [done, setDone]         = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  const [name, setName]         = useState("");
  const [company, setCompany]   = useState("");
  const [email, setEmail]       = useState("");
  const [country, setCountry]   = useState("");
  const [size, setSize]         = useState("");
  const [industry, setIndustry] = useState("");

  const [pass, setPass]         = useState("");
  const [confirm, setConfirm]   = useState("");
  const [agree, setAgree]       = useState(false);

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!name)                              e.name    = "Full name is required";
      if (!email || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid work email is required";
      if (!company)                           e.company = "Company name is required";
      if (!country)                           e.country = "Country is required";
    }
    if (step === 1) {
      if (!pass || pass.length < 8) e.pass    = "Minimum 8 characters";
      if (pass !== confirm)          e.confirm = "Passwords do not match";
      if (!agree)                    e.agree   = "You must accept the terms";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => {
    if (!validate()) return;
    if (step < 1) { setStep(s => s + 1); return; }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'Client',
          email,
          password: pass,
          companyName: company,
          name, 
          country,
          industry
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setDone(true);
    } catch (err) {
      setErrors({ agree: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-3">
          Welcome aboard, {name.split(" ")[0]}!
        </h2>
        <p className="text-slate-500 leading-relaxed mb-6">
          Your client account for <strong>{company}</strong> is ready. Post your first project and get matched with global developers in minutes.
        </p>
        <button
          onClick={() => setPage("client-login")}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-base rounded-xl shadow-lg transition-colors"
        >
          Go to Login →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <AuthPanel gradient="bg-gradient-to-br from-amber-700 to-orange-600">
        <div className="relative">
          <Logo dark onClick={() => setPage("home")} />
        </div>
        <div className="flex-1 flex flex-col justify-center relative mt-10">
          <Building2 className="w-16 h-16 text-white mb-4" />
          <h2 className="text-3xl font-black text-white mb-3 leading-tight">
            Start hiring<br />globally.
          </h2>
          <p className="text-amber-100 leading-relaxed mb-8">
            Post projects, get AI-matched with top developers, and reduce your hiring time by 60%.
          </p>
          <BenefitList
            items={[
              "Post projects with a guided form",
              "Receive top-5 developer matches instantly",
              "Review proposals and applicants side by side",
              "Track delivery and rate performance",
            ]}
            textColor="text-amber-100"
            checkColor="text-amber-200"
          />
        </div>
      </AuthPanel>

      <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-200 bg-white">
          <div className="lg:hidden"><Logo onClick={() => setPage("home")} /></div>
          <div className="hidden lg:block" />
          <p className="text-sm text-slate-500">
            Already registered?{" "}
            <span onClick={() => setPage("client-login")} className="text-amber-700 font-bold cursor-pointer">
              Sign in
            </span>
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-8 py-10">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Building2 className="w-3 h-3" /> CLIENT REGISTRATION
            </span>
            <h1 className="text-2xl font-black text-slate-800 mb-1">
              {step === 0 ? "Tell us about yourself" : "Secure your account"}
            </h1>
            <p className="text-slate-500 text-sm">Step {step + 1} of 2</p>
          </div>

          <Stepper steps={["Account Details", "Password"]} current={step} />

          {step === 0 && (
            <>
              <Input label="Full Name" placeholder="e.g. Sophia Werner" value={name} onChange={setName} error={errors.name} required />
              <Input label="Work Email" type="email" placeholder="client@spartantech.com" value={email} onChange={setEmail} error={errors.email} required />
              <Input label="Company Name" placeholder="e.g. TechVentures GmbH" value={company} onChange={setCompany} error={errors.company} required />
              <Select label="Country" value={country} onChange={setCountry} required options={[{ value:"", label:"Select your country" }, ...COUNTRIES.map(c => ({ value:c, label:c }))]} />
              {errors.country && <p className="text-xs text-red-500 -mt-3 mb-3">⚠ {errors.country}</p>}
              <Select label="Company Size" value={size} onChange={setSize} options={SIZES} />
              <Select label="Industry" value={industry} onChange={setIndustry} options={INDUSTRIES} />
            </>
          )}

          {step === 1 && (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm">
                <p className="font-bold text-amber-800 mb-0.5">Account Summary</p>
                <p className="text-amber-700">{name} · {company} · {country}</p>
                <p className="text-amber-600 text-xs mt-0.5">{email}</p>
              </div>

              <PasswordInput label="Create Password" value={pass} onChange={setPass} error={errors.pass} showStrength required />
              <PasswordInput label="Confirm Password" value={confirm} onChange={setConfirm} error={errors.confirm} required />

              <label className="flex items-start gap-3 cursor-pointer mb-4">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-1 accent-amber-600" />
                <span className="text-sm text-slate-600">I agree to the <span className="text-amber-700 font-semibold">Terms of Service</span> and <span className="text-amber-700 font-semibold">Privacy Policy</span></span>
              </label>
              {errors.agree && <p className="text-xs text-red-500 -mt-3 mb-3">⚠ {errors.agree}</p>}
            </>
          )}

          <div className="flex gap-3 mt-2">
            {step > 0 && <Btn variant="ghost" onClick={() => setStep(s => s - 1)}>← Back</Btn>}
            <button onClick={next} disabled={loading} className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl transition-colors shadow-md">
              {loading ? "Processing..." : (step < 1 ? "Continue →" : "Create Client Account ✓")}
            </button>
          </div>
        </div>

        <div className="text-center py-3">
          <span onClick={() => setPage("home")} className="text-sm text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">← Back to Home</span>
        </div>
      </div>
    </div>
  );
}