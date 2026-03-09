import { useState } from "react";
import { ADMIN_CREDENTIALS } from "../constants/data";



export default function AdminLoginPage({ setPage, onLogin }) {
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const submit = () => {
    if (!email || !pass) {
      setError("Both email and password are required.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === ADMIN_CREDENTIALS.email && pass === ADMIN_CREDENTIALS.password) {
        onLogin("admin");
      } else {
        setError("Invalid admin credentials. Please check your email and password.");
      }
    }, 900);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div
            onClick={() => setPage("home")}
            className="cursor-pointer inline-block mb-4"
          >
            <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-sky-400 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-white font-black text-2xl leading-none">N</span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-sm">Restricted access — authorised personnel only</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">

          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-6">
            <span className="text-amber-400 text-xl shrink-0">⚙️</span>
            <div>
              <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-0.5">Admin Credentials</p>
              <p className="text-amber-200 text-xs font-mono">admin@SmartDev Marketplace.com · Admin@2025</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              Admin Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">✉</span>
              <input
                type="email"
                placeholder="admin@SmartDev Marketplace.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white
                  placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
                  hover:border-white/20 transition-colors"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">🔒</span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-10 text-sm text-white
                  placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500
                  hover:border-white/20 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-base"
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm mb-4 flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white text-sm transition-all shadow-lg
              ${loading
                ? "bg-blue-700 cursor-not-allowed opacity-70"
                : "bg-linear-to-r from-blue-700 to-sky-600 hover:opacity-90 shadow-blue-900/30"
              }`}
          >
            {loading ? "Authenticating…" : "Access Admin Dashboard →"}
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-slate-600 leading-relaxed">
          All admin actions are logged. Unauthorised access attempts are recorded.
        </div>

        <div className="text-center mt-6">
          <span
            onClick={() => setPage("home")}
            className="text-slate-500 text-sm cursor-pointer hover:text-slate-300 transition-colors"
          >
            ← Back to Home
          </span>
        </div>
      </div>
    </div>
  );
}
