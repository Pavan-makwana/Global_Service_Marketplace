import { useState, useEffect } from "react";
import { TopNav, Card, StatTile, Badge, Chip, Btn, TabBar, Avatar, Stars } from "../components/ui";
import { Send, CheckCircle, CircleDollarSign, Medal } from "lucide-react";

const APP_BADGE = {
  Pending: "sky",
  Accepted: "green",
  Rejected: "red",
};

export default function DevDashboard({ setPage, setSelectedProject, onLogout }) {
  const [tab, setTab] = useState("applications");
  
  // LIVE STATE
  const [devProfile, setDevProfile] = useState({});
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expanded Edit profile state
  const [nameEdit, setNameEdit] = useState("");
  const [titleEdit, setTitleEdit] = useState("");
  const [skillEdit, setSkillEdit] = useState("");
  const [expEdit, setExpEdit] = useState("");
  const [countryEdit, setCountryEdit] = useState("");
  const [bioEdit, setBioEdit] = useState("");
  const [rateEdit, setRateEdit] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/developers/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          
          console.log("🔥 LIVE BACKEND DATA:", data.profile); // <--- Check your console!

          setDevProfile(data.profile || {});
          setMyApps(data.applications || []);
          
          // Pre-fill the edit form with whatever the DB has
          setNameEdit(data.profile.name || "");
          setTitleEdit(data.profile.title || "");
          setSkillEdit(data.profile.primary_skill || "");
          setExpEdit(data.profile.experience_years || "");
          setCountryEdit(data.profile.country || "");
          setBioEdit(data.profile.bio || "");
          setRateEdit(data.profile.hourly_rate || "");
          setIsAvailable(data.profile.is_available === 1);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        name: nameEdit,
        title: titleEdit,
        primary_skill: skillEdit,
        experience_years: expEdit,
        country: countryEdit,
        bio: bioEdit,
        hourly_rate: rateEdit,
        is_available: isAvailable
      };

      const res = await fetch('http://localhost:5000/api/developers/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaved(true);
        // Instantly update the header UI without reloading the page!
        setDevProfile(prev => ({ ...prev, ...payload })); 
        setTimeout(() => setSaved(false), 2500);
      } else {
        const errData = await res.json();
        alert("Failed to save: " + errData.message);
      }
    } catch (err) {
      alert("Failed to update profile. Check console.");
    }
  };

  const initials = devProfile.name ? devProfile.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : "DV";

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav setPage={setPage} role="developer" onLogout={onLogout || (() => setPage("home"))} />

      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-5 flex-wrap">
          <div className="relative shrink-0">
            <Avatar initials={initials} size="lg" color="sky" />
            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${isAvailable ? "bg-emerald-400" : "bg-red-400"}`} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{devProfile.name || "Developer"}</h1>
            <p className="text-sky-300 font-semibold text-sm">{devProfile.title || "Platform Member"}</p>
            <div className="flex items-center gap-3 mt-1">
              <Stars rating={4.9} />
              <span className="text-blue-300 text-sm">
                ${devProfile.hourly_rate || 0}/hr · {devProfile.experience_years || 0} yrs exp · {devProfile.country || "Remote"}
              </span>
            </div>
          </div>
          <div className="ml-auto">
            <Btn variant="white" onClick={() => setPage("marketplace")}>
              Browse Projects →
            </Btn>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatTile label="Applications Sent"  value={myApps.length}        icon={<Send className="w-6 h-6 text-blue-900" />} topColor="bg-blue-900"   />
          <StatTile label="Projects Completed" value="-"                    icon={<CheckCircle className="w-6 h-6 text-emerald-500" />} topColor="bg-emerald-500"/>
          <StatTile label="Total Earned"       value="-"                    icon={<CircleDollarSign className="w-6 h-6 text-amber-500" />} topColor="bg-amber-500"  />
          <StatTile label="My Rating"          value="-"                    icon={<Medal className="w-6 h-6 text-sky-500" />} topColor="bg-sky-500"/>
        </div>

        <TabBar
          tabs={[
            { id:"applications", label:"My Applications" },
            { id:"profile",      label:"Edit Profile" },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === "applications" && (
          <div>
            {loading ? <p className="text-center py-10 font-bold text-slate-400">Loading applications...</p> : (
              <div className="flex flex-col gap-4">
                {myApps.length === 0 ? <p className="text-center py-10 text-slate-400">No applications yet. Head to the marketplace!</p> : null}
                {myApps.map(a => (
                  <Card key={a.id} className="p-6">
                    <div className="flex justify-between flex-wrap gap-4">
                      <div className="flex-1 min-w-60">
                        <div className="flex gap-2 items-center mb-2 flex-wrap">
                          <p className="font-black text-slate-800 text-base">{a.project_title}</p>
                          <Badge variant={APP_BADGE[a.status] || "gray"}>{a.status}</Badge>
                        </div>
                        <p className="text-slate-500 text-sm mb-2">
                          Applied {new Date(a.applied_at).toLocaleDateString("en", { month:"short", day:"numeric" })}
                        </p>
                        <p className="text-sm italic text-slate-600">"{a.proposal_text}"</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-emerald-600 text-lg">
                          Match Score: {Math.round(a.matching_score)}%
                        </p>
                        <p className="text-slate-400 text-sm mb-3">Proposed: {a.expected_days} days</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "profile" && (
          <div className="max-w-3xl">
            <Card className="p-8">
              <h2 className="text-xl font-black text-slate-800 mb-1">Edit Developer Profile</h2>
              <p className="text-slate-500 text-sm mb-6">Fill in your missing details to improve your AI Match Score!</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    value={nameEdit} onChange={e => setNameEdit(e.target.value)}
                    placeholder="e.g. Pavan Kumar"
                    className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Professional Title</label>
                  <input
                    value={titleEdit} onChange={e => setTitleEdit(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Primary Skill</label>
                  <input
                    value={skillEdit} onChange={e => setSkillEdit(e.target.value)}
                    placeholder="e.g. React"
                    className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Years Experience</label>
                  <input
                    value={expEdit} type="number" onChange={e => setExpEdit(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hourly Rate (USD)</label>
                  <input
                    value={rateEdit} type="number" onChange={e => setRateEdit(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location / Country</label>
                <input
                  value={countryEdit} onChange={e => setCountryEdit(e.target.value)}
                  placeholder="e.g. India"
                  className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short Bio</label>
                <textarea
                  rows={4} value={bioEdit} onChange={e => setBioEdit(e.target.value)}
                  placeholder="Tell clients about your expertise..."
                  className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                />
              </div>

              <div className="flex gap-3 items-center">
                <Btn onClick={handleSave}>Save Profile Details</Btn>
                {saved && <span className="text-emerald-600 text-sm font-semibold">✓ Profile Updated!</span>}
              </div>
            </Card>

            <Card className="p-5 mt-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">Availability Status</p>
                <p className="text-sm text-slate-500">Controls whether you appear in client searches</p>
              </div>
              <div
                onClick={() => setIsAvailable(!isAvailable)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors
                ${isAvailable ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-red-400"}`} />
                {isAvailable ? "Available for Work" : "Currently Busy"}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}