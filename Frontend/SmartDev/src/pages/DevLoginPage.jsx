import { useState } from "react";
import { Logo, Input, PasswordInput, Btn, Toast, Divider, PillLabel, AuthPanel, BenefitList, AdminHint } from "../components/ui";
import { ADMIN_CREDENTIALS } from "../constants/data";

export default function DevLoginPage({ setPage, onLogin }) {
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);
  const [remember, setRemember] = useState(false);

  const submit = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    if (!pass)  e.pass  = "Password is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Admin credential detection
      if (email === ADMIN_CREDENTIALS.email && pass === ADMIN_CREDENTIALS.password) {
        setToast({ msg: "Admin detected — redirecting to Admin Dashboard…", type: "success" });
        setTimeout(() => onLogin("admin"), 1300);
        return;
      }

      // Regular developer login
      setToast({ msg: "Signed in as Developer!", type: "success" });
      setTimeout(() => onLogin("developer"), 1000);
    }, 900);
  };

  return (
    <div className="min-h-screen flex">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <AuthPanel gradient="bg-linear-to-br from-blue-900 to-blue-800">
        <div className="relative">
          <Logo dark onClick={() => setPage("home")} />
        </div>

        <div className="flex-1 flex flex-col justify-center relative mt-10">
          <div className="text-7xl mb-5">💻</div>
          <h2 className="text-3xl font-black text-white mb-3 leading-tight">
            Welcome back,<br />Developer.
          </h2>
          <p className="text-blue-200 leading-relaxed mb-8">
            Access your dashboard, browse AI-matched projects, and track your applications — all in one place.
          </p>
          <BenefitList
            items={[
              "View your latest project matches",
              "Track all applications & statuses",
              "Update profile and portfolio",
              "View earnings and client reviews",
            ]}
          />
        </div>

        <div className="relative bg-white/10 border border-white/15 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-xs font-bold text-sky-300 mb-1">🛡 Admin Access</p>
          <p className="text-blue-200 text-xs leading-relaxed">
            Use{" "}
            <span className="font-mono text-sky-300">admin@SmartDev Marketplace.com</span>
            {" "}/ <span className="font-mono text-sky-300">Admin@2025</span>
            {" "}on this form to access the Admin Dashboard.
          </p>
        </div>
      </AuthPanel>

      <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-200 bg-white">
          <div className="lg:hidden"><Logo onClick={() => setPage("home")} /></div>
          <div className="hidden lg:block" />
          <p className="text-sm text-slate-500">
            New developer?{" "}
            <span onClick={() => setPage("dev-register")} className="text-blue-900 font-bold cursor-pointer">
              Create account
            </span>
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-8 py-10">
          <div className="mb-6">
            <PillLabel color="blue">💻 DEVELOPER PORTAL</PillLabel>
            <h1 className="text-2xl font-black text-slate-800 mb-1">Sign in to your account</h1>
            <p className="text-slate-500 text-sm">Welcome back! Enter your credentials to continue.</p>
          </div>

  
          <Input
            label="Email Address" type="email"
            placeholder="developer@example.com"
            value={email} onChange={setEmail}
            icon="✉" error={errors.email} required
          />
          <PasswordInput
            label="Password"
            value={pass} onChange={setPass}
            error={errors.pass} required
          />

          <div className="flex justify-between items-center mb-5">
            <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
              <input
                type="checkbox" checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="accent-blue-900"
              />
              Remember me
            </label>
            <span className="text-sm text-sky-600 font-semibold cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          <Btn full size="lg" onClick={submit} disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </Btn>

          <AdminHint />
        </div>

          <div className="text-center py-3">
            <span
              onClick={() => setPage("home")}
              className="text-sm text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
            >
              ← Back to Home
            </span>
          </div>
          
        <div className="text-center py-4 border-t border-slate-200 bg-white">
          <p className="text-sm text-slate-500">
            Hiring talent?{" "}
            <span onClick={() => setPage("client-login")} className="text-blue-900 font-bold cursor-pointer">
              Client login →
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
