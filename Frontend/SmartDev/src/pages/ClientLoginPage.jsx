import { useState } from "react";
import { Logo, Input, PasswordInput, Btn, Toast, Divider, AdminHint, AuthPanel, BenefitList } from "../components/ui";
import { ADMIN_CREDENTIALS } from "../constants/data";



export default function ClientLoginPage({ setPage, onLogin }) {
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState(null);
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

      if (email === ADMIN_CREDENTIALS.email && pass === ADMIN_CREDENTIALS.password) {
        setToast({ msg: "Admin detected — redirecting to Admin Dashboard…", type: "success" });
        setTimeout(() => onLogin("admin"), 1300);
        return;
      }

      setToast({ msg: "Signed in as Client!", type: "success" });
      setTimeout(() => onLogin("client"), 1000);
    }, 900);
  };

  return (
    <div className="min-h-screen flex">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <AuthPanel gradient="bg-gradient-to-br from-amber-700 to-orange-600">
        <div className="relative">
          <Logo dark onClick={() => setPage("home")} />
        </div>

        <div className="flex-1 flex flex-col justify-center relative mt-10">
          <div className="text-7xl mb-5">🏢</div>
          <h2 className="text-3xl font-black text-white mb-3 leading-tight">
            Welcome back,<br />Client.
          </h2>
          <p className="text-amber-100 leading-relaxed mb-8">
            Manage your projects, review developer recommendations, and track delivery progress — all in one dashboard.
          </p>
          <BenefitList
            items={[
              "Post and manage all your projects",
              "Review AI-ranked developer matches",
              "Compare applicants side by side",
              "Track delivery and leave reviews",
            ]}
            textColor="text-amber-100"
            checkColor="text-amber-200"
          />
        </div>

        <div className="relative bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-xs font-bold text-amber-200 mb-1">🛡 Admin Access</p>
          <p className="text-amber-100 text-xs leading-relaxed">
            Use{" "}
            <span className="font-mono text-white">admin@SmartDev Marketplace.com</span>
            {" "}/ <span className="font-mono text-white">Admin@2025</span>
            {" "}to access the Admin Dashboard.
          </p>
        </div>
      </AuthPanel>

      <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-200 bg-white">
          <div className="lg:hidden"><Logo onClick={() => setPage("home")} /></div>
          <div className="hidden lg:block" />
          <p className="text-sm text-slate-500">
            New client?{" "}
            <span onClick={() => setPage("client-register")} className="text-amber-700 font-bold cursor-pointer">
              Create account
            </span>
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-8 py-10">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
              🏢 CLIENT PORTAL
            </span>
            <h1 className="text-2xl font-black text-slate-800 mb-1">Sign in to your account</h1>
            <p className="text-slate-500 text-sm">Access your projects and developer matches.</p>
          </div>

          <Input
            label="Work Email" type="email"
            placeholder="you@company.com"
            value={email} onChange={setEmail}
            icon="✉" error={errors.email} required
          />

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              value={pass} onChange={setPass}
              error={errors.pass}
            />
          </div>

          <div className="flex justify-between items-center mb-5 -mt-2">
            <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
              <input
                type="checkbox" checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="accent-amber-600"
              />
              Remember me
            </label>
            <span className="text-sm text-amber-700 font-semibold cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white text-sm transition-colors shadow-md
              ${loading ? "bg-amber-400 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-500"}`}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>

          <AdminHint />
        </div>

        <div className="text-center py-4 border-t border-slate-200 bg-white">
          <p className="text-sm text-slate-500">
            Looking for work?{" "}
            <span onClick={() => setPage("dev-login")} className="text-blue-900 font-bold cursor-pointer">
              Developer login →
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
