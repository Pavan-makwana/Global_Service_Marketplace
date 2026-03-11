import { useState } from "react";
import { Logo, Input, PasswordInput, Btn, Toast, AdminHint, AuthPanel, BenefitList } from "../components/ui";
import { Building2 } from "lucide-react";

export default function ClientLoginPage({ setPage, onLogin }) {
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState(null);
  const [remember, setRemember] = useState(false);

  const submit = async () => {
    const e = {};
    if (!email) e.email = "Email is required";
    if (!pass)  e.pass  = "Password is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      if (data.user.role !== 'Client') {
        throw new Error("Access Denied: Client account required.");
      }

      localStorage.setItem('token', data.token);
      setToast({ msg: "Signed in as Client!", type: "success" });
      setTimeout(() => onLogin("client", data.token), 1000);

    } catch (err) {
      setErrors({ pass: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <AuthPanel gradient="bg-gradient-to-br from-amber-700 to-orange-600">
        <div className="relative">
          <Logo dark onClick={() => setPage("home")} />
        </div>

        <div className="flex-1 flex flex-col justify-center relative mt-10">
          <Building2 className="w-16 h-16 text-white mb-5" />
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
              <Building2 className="w-3 h-3" /> CLIENT PORTAL
            </span>
            <h1 className="text-2xl font-black text-slate-800 mb-1">Sign in to your account</h1>
            <p className="text-slate-500 text-sm">Access your projects and developer matches.</p>
          </div>

          <Input
            label="Work Email" type="email"
            placeholder="client@spartantech.com"
            value={email} onChange={setEmail}
             error={errors.email} required
          />

          <div className="mb-4">
            <PasswordInput
              label="Password"
              value={pass} onChange={setPass}
              error={errors.pass} required
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