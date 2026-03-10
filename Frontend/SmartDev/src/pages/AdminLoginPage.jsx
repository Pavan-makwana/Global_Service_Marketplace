import { useState } from "react";
import { Settings, Mail, Lock, Eye, EyeOff, AlertTriangle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage({ setPage, onLogin }) {
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const submit = async () => {
    if (!email || !pass) {
      setError("Both email and password are required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // 🔥 1. Call real Node.js backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // 🔥 2. Security Check: Only allow Admins to use this portal
      if (data.user.role !== 'Admin') {
        throw new Error("Access Denied: Admin privileges required.");
      }

      // 🔥 3. Save token
      localStorage.setItem('token', data.token);

      // Delay slightly for smooth UX
      setTimeout(() => {
        onLogin("admin", data.token);
      }, 800);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
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
              <span className="text-white font-black text-2xl leading-none">SD</span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-sm">Restricted access — authorised personnel only</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">

          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-6">
            <Settings className="text-amber-400 w-6 h-6 shrink-0" />
            <div>
              <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-0.5">Admin Credentials</p>
              <p className="text-amber-200 text-xs font-mono">Use your provisioned master account</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              Admin Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
              <input
                type="email"
                placeholder="admin@spartantech.com"
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
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
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
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white text-sm transition-all shadow-lg
              ${loading
                ? "bg-blue-700 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-blue-700 to-sky-600 hover:opacity-90 shadow-blue-900/30"
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
            className="inline-flex items-center gap-1.5 text-slate-500 text-sm cursor-pointer hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </span>
        </div>
      </div>
    </div>
  );
}