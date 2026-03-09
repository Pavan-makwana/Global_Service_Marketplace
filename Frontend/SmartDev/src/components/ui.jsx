import { useState } from "react";

// LOGO
export const Logo = ({ onClick, dark = false }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2.5 select-none ${onClick ? "cursor-pointer" : ""}`}
  >
    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-linear-to-br from-blue-600 to-sky-400 shadow-md shrink-0">
      <span className="text-white font-black text-lg leading-none">SD</span>
    </div>
    <span className={`font-black text-xl tracking-tight leading-none ${dark ? "text-white" : "text-blue-900"}`}>
      SmartDev Marketplace
    </span>
  </div>
);

// AVATAR 
export const Avatar = ({ initials, size = "md", color = "blue" }) => {
  const sz = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  }[size];
  const bg = {
    blue:   "bg-blue-100 text-blue-800",
    sky:    "bg-sky-100 text-sky-800",
    green:  "bg-emerald-100 text-emerald-800",
    amber:  "bg-amber-100 text-amber-800",
    purple: "bg-purple-100 text-purple-800",
    pink:   "bg-pink-100 text-pink-800",
  }[color] || "bg-blue-100 text-blue-800";
  return (
    <div className={`${sz} ${bg} rounded-full flex items-center justify-center font-black shrink-0`}>
      {initials}
    </div>
  );
};

//BADGE 
export const Badge = ({ children, variant = "gray" }) => {
  const v = {
    gray:   "bg-slate-100 text-slate-600",
    blue:   "bg-blue-100 text-blue-800",
    sky:    "bg-sky-100 text-sky-700",
    green:  "bg-emerald-100 text-emerald-700",
    amber:  "bg-amber-100 text-amber-700",
    red:    "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
  }[variant] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${v}`}>
      {children}
    </span>
  );
};

//SKILL CHIP 
export const Chip = ({ label }) => (
  <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
    {label}
  </span>
);

//BUTTON 
export const Btn = ({
  children, variant = "primary", size = "md",
  onClick, disabled, full, type = "button",
}) => {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none";
  const sz = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }[size];
  const w = full ? "w-full" : "";
  const v = {
    primary:   "bg-blue-900 hover:bg-blue-800 text-white shadow-md hover:shadow-lg active:scale-95",
    secondary: "bg-sky-500 hover:bg-sky-400 text-white shadow-md hover:shadow-lg active:scale-95",
    amber:     "bg-amber-500 hover:bg-amber-400 text-white shadow-md hover:shadow-lg active:scale-95",
    outline:   "border-2 border-blue-900 text-blue-900 hover:bg-blue-50",
    ghost:     "bg-slate-100 hover:bg-slate-200 text-slate-700",
    danger:    "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
    success:   "bg-emerald-500 hover:bg-emerald-400 text-white shadow-md",
    white:     "bg-white text-blue-900 hover:bg-blue-50 shadow-md",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sz} ${w} ${v} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
};

//INPUT FIELD
export const Input = ({
  label, type = "text", placeholder, value, onChange,
  error, icon, required, hint,
}) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
          {icon}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full border rounded-xl py-2.5 pr-4 text-sm text-slate-800 bg-white transition-colors
          focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400
          ${icon ? "pl-9" : "pl-4"}
          ${error ? "border-red-400 bg-red-50" : "border-slate-200 hover:border-slate-300"}`}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
    {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
);

//SELECT FIELD
export const Select = ({ label, value, onChange, options, required }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 bg-white
        focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400
        hover:border-slate-300 transition-colors cursor-pointer"
    >
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  </div>
);

// TEXTAREA 
export const Textarea = ({ label, placeholder, value, onChange, rows = 4, required }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <textarea
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 bg-white
        focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400
        resize-none hover:border-slate-300 transition-colors"
    />
  </div>
);

//PASSWORD INPUT
export const PasswordInput = ({
  label, value, onChange, error, required, showStrength,
}) => {
  const [show, setShow] = useState(false);
  const strength = !value
    ? 0
    : [
        value.length >= 8,
        /[A-Z]/.test(value),
        /[0-9]/.test(value),
        /[^A-Za-z0-9]/.test(value),
      ].filter(Boolean).length;
  const meta = [
    null,
    { label: "Weak",   color: "bg-red-400",     text: "text-red-400"   },
    { label: "Fair",   color: "bg-amber-400",    text: "text-amber-400" },
    { label: "Good",   color: "bg-sky-400",      text: "text-sky-500"   },
    { label: "Strong", color: "bg-emerald-500",  text: "text-emerald-600" },
  ];
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🔒</span>
        <input
          type={show ? "text" : "password"}
          placeholder="••••••••"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full border rounded-xl py-2.5 pl-9 pr-10 text-sm text-slate-800 bg-white
            focus:outline-none focus:ring-2 focus:ring-sky-400
            ${error ? "border-red-400 bg-red-50" : "border-slate-200 hover:border-slate-300"}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base"
        >
          {show ? "🙈" : "👁"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">⚠ {error}</p>}
      {showStrength && value && (
        <div className="mt-2">
          <div className="flex gap-1 mb-1">
            {[1,2,3,4].map(i => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? meta[strength]?.color : "bg-slate-200"}`}
              />
            ))}
          </div>
          <p className={`text-xs font-semibold ${meta[strength]?.text}`}>{meta[strength]?.label}</p>
        </div>
      )}
    </div>
  );
};

//CARD 
export const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-200 shadow-sm
      ${onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" : ""}
      ${className}`}
  >
    {children}
  </div>
);

// STAT TILE 
export const StatTile = ({ label, value, sub, icon, topColor = "bg-blue-900" }) => (
  <Card>
    <div className={`h-1 rounded-t-2xl ${topColor}`} />
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-black text-slate-800">{value}</p>
      {sub && <p className="text-sm text-slate-500 mt-1">{sub}</p>}
    </div>
  </Card>
);

// TOP NAV BAR 
export const TopNav = ({ setPage, role, onLogout }) => (
  <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <Logo onClick={() => setPage("home")} />
      <div className="flex items-center gap-3">
        {role && (
          <Badge variant="blue">
            {role === "developer" ? "💻 Developer" : role === "client" ? "🏢 Client" : "⚙️ Admin"}
          </Badge>
        )}
        {onLogout && (
          <Btn variant="ghost" size="sm" onClick={onLogout}>Sign Out</Btn>
        )}
        {!role && (
          <>
            <Btn variant="ghost" size="sm" onClick={() => setPage("dev-login")}>Developer Login</Btn>
            <Btn variant="ghost" size="sm" onClick={() => setPage("client-login")}>Client Login</Btn>
            <Btn size="sm" onClick={() => setPage("dev-register")}>Get Started</Btn>
          </>
        )}
      </div>
    </div>
  </nav>
);

//STARS RATING 
export const Stars = ({ rating }) => (
  <span className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={`text-sm ${i <= Math.floor(rating) ? "text-amber-400" : "text-slate-200"}`}>★</span>
    ))}
    <span className="text-xs font-semibold text-slate-500 ml-1">{rating}</span>
  </span>
);

// AI MATCH RING (SVG) 
export const MatchRing = ({ score, size = 56 }) => {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 90 ? "#10B981" : score >= 75 ? "#0EA5E9" : "#F59E0B";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={4}
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-black" style={{ color }}>{score}%</span>
      </div>
    </div>
  );
};

// MULTI-STEP PROGRESS BAR 
export const Stepper = ({ steps, current }) => (
  <div className="flex items-center gap-2 mb-6">
    {steps.map((s, i) => (
      <div key={i} className="flex items-center gap-2 flex-1">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
            ${i < current ? "bg-emerald-500 text-white" : i === current ? "bg-blue-900 text-white" : "bg-slate-200 text-slate-500"}`}
        >
          {i < current ? "✓" : i + 1}
        </div>
        <span className={`text-xs font-semibold hidden sm:block ${i === current ? "text-blue-900" : "text-slate-400"}`}>
          {s}
        </span>
        {i < steps.length - 1 && (
          <div className={`flex-1 h-0.5 ${i < current ? "bg-emerald-400" : "bg-slate-200"}`} />
        )}
      </div>
    ))}
  </div>
);

// TAB BAR 
export const TabBar = ({ tabs, active, onChange }) => (
  <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
    {tabs.map(t => (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors
          ${active === t.id
            ? "border-blue-900 text-blue-900"
            : "border-transparent text-slate-500 hover:text-slate-700"}`}
      >
        {t.label}
      </button>
    ))}
  </div>
);

// TOAST NOTIFICATION 
export const Toast = ({ msg, type, onClose }) => (
  <div
    className={`fixed top-5 right-5 z-9999 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border
      text-sm font-semibold
      ${type === "success"
        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
        : "bg-red-50 border-red-200 text-red-800"}`}
  >
    <span>{type === "success" ? "✅" : "❌"}</span>
    {msg}
    <button onClick={onClose} className="ml-2 text-lg leading-none hover:opacity-70">×</button>
  </div>
);

//DIVIDER WITH TEXT 
export const Divider = ({ text }) => (
  <div className="flex items-center gap-3 my-5 text-slate-400 text-xs">
    <div className="flex-1 h-px bg-slate-200" />
    {text}
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

// AUTH LEFT PANEL 
export const AuthPanel = ({ gradient, children }) => (
  <div
    className={`hidden lg:flex w-5/12 flex-col p-12 relative overflow-hidden ${gradient}`}
  >
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
    <div className="absolute bottom-0 right-0 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
    {children}
  </div>
);

// AUTH RIGHT PANEL 
export const AuthRight = ({ switchText, switchLabel, onSwitch, children }) => (
  <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto">
    <div className="flex justify-between items-center px-8 py-5 border-b border-slate-200 bg-white">
      <div />
      <p className="text-sm text-slate-500">
        {switchText}{" "}
        <span onClick={onSwitch} className="text-blue-900 font-bold cursor-pointer hover:underline">
          {switchLabel}
        </span>
      </p>
    </div>
    <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-8 py-10">
      {children}
    </div>
  </div>
);



// SECTION LABEL PILL 
export const PillLabel = ({ children, color = "blue" }) => {
  const c = {
    blue:  "bg-blue-100 text-blue-800",
    amber: "bg-amber-100 text-amber-800",
    dark:  "bg-slate-700 text-slate-200",
  }[color];
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full mb-3 ${c}`}>
      {children}
    </span>
  );
};

// LEFT PANEL BENEFITS LIST 
export const BenefitList = ({ items, textColor = "text-blue-100", checkColor = "text-sky-300" }) => (
  <div className="flex flex-col gap-3">
    {items.map(b => (
      <div key={b} className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <span className={`text-xs font-black ${checkColor}`}>✓</span>
        </div>
        <span className={`text-sm ${textColor}`}>{b}</span>
      </div>
    ))}
  </div>
);

// ADMIN HINT BOX 
export const AdminHint = () => (
  <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
    <strong>🛡 Admin?</strong> Enter{" "}
    <code className="bg-white px-1 rounded border border-emerald-100">admin@SmartDev Marketplace.com</code>
    {" "}/ <code className="bg-white px-1 rounded border border-emerald-100">Admin@2025</code> above.
  </div>
);