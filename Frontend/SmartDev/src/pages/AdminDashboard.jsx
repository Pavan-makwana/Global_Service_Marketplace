import { useState, useEffect } from "react";
import { Card, StatTile, Badge, Avatar, Btn } from "../components/ui";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import {
  CHART_DEMAND, CHART_TREND, CHART_CATS, CHART_SKILLS,
  PIE_COLORS,
} from "../constants/data";
import {
  Users, Briefcase, FileText, Activity, LayoutDashboard,
  Settings, Globe, Search, ArrowDownToLine, SlidersHorizontal
} from "lucide-react";

const ChartTooltip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-lg text-sm">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  ) : null;

export default function AdminDashboard({ setPage, setSelectedDev, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [userRole, setUserRole] = useState("all");
  const [chartTab, setChartTab] = useState("demand");

  // 🔥 LIVE BACKEND STATE
  const [stats, setStats] = useState({
    totalProjects: 0,
    openProjects: 0,
    totalApplications: 0,
    totalUsers: 0
  });
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH REAL DB METRICS
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setUsersList(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const filteredUsers = userRole === "all"
    ? usersList
    : usersList.filter(u => u.role.toLowerCase() === userRole);

  return (
    <div className="min-h-screen bg-slate-50">

      <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center">
              <span className="text-white font-black text-sm leading-none">SD</span>
            </div>
            <span className="text-white font-black text-lg">SmartDev Marketplace</span>
            <span className="bg-slate-700 text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-1">
            {["overview", "analytics", "users", "settings"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all
                  ${tab === t ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
              >
                {t}
              </button>
            ))}
            <button
              onClick={onLogout || (() => setPage("home"))}
              className="ml-3 px-3 py-1.5 rounded-lg text-sm bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {tab === "overview" && (
          <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <LayoutDashboard className="w-6 h-6 text-blue-600" />
                  Platform Overview
                </h1>
                <p className="text-slate-500 text-sm">Live platform health and key metrics</p>
              </div>
              <div className="flex gap-2">
                <Btn variant="ghost" size="sm">
                  <span className="flex items-center gap-2"><ArrowDownToLine className="w-4 h-4" /> Export Report</span>
                </Btn>
                <Btn size="sm">
                  <span className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Configure Matching</span>
                </Btn>
              </div>
            </div>

            {/* 🔥 LIVE DATABASE METRICS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatTile label="Total Users" value={loading ? "..." : stats.totalUsers} icon={<Users className="w-6 h-6 text-sky-400" />} topColor="bg-blue-900" />
              <StatTile label="Total Projects" value={loading ? "..." : stats.totalProjects} icon={<Briefcase className="w-6 h-6 text-sky-400" />} topColor="bg-sky-500" />
              <StatTile label="Open Projects" value={loading ? "..." : stats.openProjects} icon={<Activity className="w-6 h-6 text-sky-400" />} topColor="bg-emerald-500" />
              <StatTile label="Total Applications" value={loading ? "..." : stats.totalApplications} icon={<FileText className="w-6 h-6 text-sky-400" />} topColor="bg-amber-500" />
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <Card className="p-6 col-span-2">
                <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                  <h3 className="font-black text-slate-800">Analytics</h3>
                  <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                    {[["demand", "Country Demand"], ["trend", "Growth Trend"], ["skills", "Top Skills"]].map(([id, label]) => (
                      <button key={id} onClick={() => setChartTab(id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all
                          ${chartTab === id ? "bg-white text-blue-900 shadow" : "text-slate-500 hover:text-slate-700"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {chartTab === "demand" && (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={CHART_DEMAND} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="country" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="v" name="Projects" fill="#1E3A8A" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {chartTab === "trend" && (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={CHART_TREND}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="m" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="projects" name="Projects" stroke="#1E3A8A" strokeWidth={3} dot={{ r: 4, fill: "#1E3A8A" }} />
                      <Line type="monotone" dataKey="devs" name="New Devs" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 4, fill: "#0EA5E9" }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {chartTab === "skills" && (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={CHART_SKILLS} layout="vertical" barSize={16}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} width={60} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="v" name="Share %" fill="#0EA5E9" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="font-black text-slate-800 mb-5">By Category</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={CHART_CATS} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" paddingAngle={3}>
                      {CHART_CATS.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 mt-3">
                  {CHART_CATS.map((c, i) => (
                    <div key={c.name} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: PIE_COLORS[i] }} />
                        <span className="text-slate-500">{c.name}</span>
                      </div>
                      <span className="font-bold text-slate-700">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {tab === "analytics" && (
          <div>
            <h1 className="text-2xl font-black text-slate-800 mb-6">Platform Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-black text-slate-800 mb-4">Projects by Country</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={CHART_DEMAND} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="country" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="v" name="Projects" fill="#1E3A8A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-6">
                <h3 className="font-black text-slate-800 mb-4">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={CHART_CATS} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}>
                      {CHART_CATS.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-6 col-span-full">
                <h3 className="font-black text-slate-800 mb-4">Growth Trend (6 Months)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={CHART_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="m" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="projects" name="Projects Completed" stroke="#1E3A8A" strokeWidth={3} dot={{ r: 5, fill: "#1E3A8A" }} />
                    <Line type="monotone" dataKey="devs" name="New Developers" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 5, fill: "#0EA5E9" }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {tab === "users" && (
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center flex-wrap gap-3 bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-lg">User Management</h3>
              <div className="flex gap-3 items-center flex-wrap">
                <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                  {["all", "developer", "client"].map(r => (
                    <button key={r} onClick={() => setUserRole(r)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all
                        ${userRole === r ? "bg-white text-blue-900 shadow" : "text-slate-500 hover:text-slate-700"}`}>
                      {r}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    placeholder="Search users..."
                    className="border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-10 text-slate-400 font-bold">Loading Live Database Users...</td></tr>
                  ) : filteredUsers.map(u => {
                    const initials = u.name ? u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "US";
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar initials={initials} size="sm" color={u.role === "Client" ? "sky" : "blue"} />
                            <div>
                              <p className="font-bold text-slate-800">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={u.role === "Client" ? "sky" : "blue"}>{u.role}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={u.status === "Active" ? "green" : "gray"}>{u.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{u.joined}</td>
                        <td className="px-6 py-4 text-slate-500 flex items-center gap-1.5">
                          <Globe className="w-4 h-4" /> {u.country}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              if (u.role === 'Developer') {
                                // Pass the live user data to the DevProfile page safely!
                                setSelectedDev({
                                  id: u.id,
                                  name: u.name,
                                  country: u.country || "Remote",
                                  title: "Platform Developer",
                                  skills: ["JavaScript", "React", "Node.js"], // Fallback array so the UI doesn't crash
                                  rating: 4.9,
                                  rate: 50,
                                  exp: 5,
                                  match: 100,
                                  onTime: 98,
                                  avail: u.status === "Active"
                                });
                                setPage("dev-profile");
                              } else {
                                alert("Client profile views coming soon!");
                              }
                            }}
                            className="text-sky-600 font-semibold hover:underline"
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center">
              <p className="text-sm text-slate-500">
                Showing {filteredUsers.length} total users
              </p>
              <div className="flex gap-1">
                {["←", "1", "2", "3", "→"].map(pg => (
                  <button key={pg}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold border transition-all
                      ${pg === "1"
                        ? "bg-blue-900 text-white border-blue-900"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                    {pg}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {tab === "settings" && (
          <Card className="p-8 max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-slate-800" />
              <h2 className="text-xl font-black text-slate-800">Matching Engine Configuration</h2>
            </div>
            <p className="text-slate-500 text-sm mb-6">Adjust the BRD-defined weights and thresholds for the AI matching formula</p>
            <div className="space-y-4">
              {[
                { l: "Top N Recommendations", v: "5", hint: "How many developers to surface per project" },
                { l: "Minimum Match Score Threshold (%)", v: "60", hint: "Developers below this score are excluded" },
                { l: "Skill Match Weight (%)", v: "40", hint: "Per BRD formula — max 40" },
                { l: "Experience Weight (%)", v: "20", hint: "Per BRD formula — max 20" },
                { l: "Client Rating Weight (%)", v: "30", hint: "Per BRD formula — max 30" },
                { l: "On-Time Delivery Weight (%)", v: "10", hint: "Per BRD formula — max 10" },
              ].map(f => (
                <div key={f.l}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{f.l}</label>
                  <input
                    defaultValue={f.v} type="number"
                    className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <p className="text-xs text-slate-400 mt-1">{f.hint}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
              <Btn size="lg">Save Configuration</Btn>
              <Btn variant="ghost" size="lg">Reset to Defaults</Btn>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}