import { useState, useEffect } from "react";
// 🔥 REMOVED: import { PROJECTS } from "./constants/data"; 

import HomePage           from "./pages/HomePage";
import DevRegisterPage    from "./pages/DevRegisterPage";
import DevLoginPage       from "./pages/DevLoginPage";
import ClientRegisterPage from "./pages/ClientRegisterPage";
import ClientLoginPage    from "./pages/ClientLoginPage";
import AdminLoginPage     from "./pages/AdminLoginPage";
import MarketplacePage    from "./pages/MarketplacePage";
import ProjectDetailPage  from "./pages/ProjectDetailPage";
import DevProfilePage     from "./pages/DevProfilePage";
import DevDashboard       from "./pages/DevDashboard";
import ClientDashboard    from "./pages/ClientDashboard";
import AdminDashboard     from "./pages/AdminDashboard";

export default function App() {
  const [page, setPage]                       = useState("home");
  const [role, setRole]                       = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDev, setSelectedDev]         = useState(null);
  
  // 🔥 START WITH AN EMPTY ARRAY FOR LIVE DB DATA
  const [projects, setProjects] = useState([]);

  // 🔥 FETCH LIVE PROJECTS FROM NODE.JS BACKEND
  useEffect(() => {
    const fetchLiveProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        // Hits the controller we built earlier!
        const response = await fetch('http://localhost:5000/api/projects', { headers });
        
        if (response.ok) {
          const liveData = await response.json();
          setProjects(liveData); // Populates the UI with legacy leads & new projects!
        }
      } catch (error) {
        console.error("Failed to connect to Node.js backend:", error);
      }
    };

    // Fetch fresh data whenever they visit these specific pages
    if (page === "marketplace" || page === "client-dashboard" || page === "dev-dashboard") {
      fetchLiveProjects();
    }
  }, [page]);

  const handleApply = (projectId) => {
    // Optimistic UI update when a user applies
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId ? { ...p, applicants: (p.applicants || 0) + 1 } : p
      )
    );
    
    setSelectedProject(prev =>
      prev?.id === projectId ? { ...prev, applicants: (prev.applicants || 0) + 1 } : prev
    );
  };

  // 🔥 UPDATED: Now accepts and saves the JWT Token!
  const handleLogin = (r, token) => {
    setRole(r);
    if (token) {
      localStorage.setItem('token', token);
    }
    
    if (r === "admin")       setPage("admin-dashboard");
    else if (r === "client") setPage("client-dashboard");
    else                     setPage("dev-dashboard");
  };

  // 🔥 UPDATED: Clears the token on logout
  const handleLogout = () => {
    setRole(null);
    localStorage.removeItem('token'); 
    setPage("home");
  };

  const shared = { setPage, role, onLogout: handleLogout };

  return (
    <>
      {page === "home"            && <HomePage         {...shared} />}

      {/* ── DEVELOPER AUTH ── */}
      {page === "dev-register"    && <DevRegisterPage  {...shared} onLogin={handleLogin} />}
      {page === "dev-login"       && <DevLoginPage     {...shared} onLogin={handleLogin} />}

      {/* ── CLIENT AUTH ── */}
      {page === "client-register" && <ClientRegisterPage {...shared} onLogin={handleLogin} />}
      {page === "client-login"    && <ClientLoginPage  {...shared} onLogin={handleLogin} />}

      {/* ── ADMIN AUTH ── */}
      {page === "admin-login"     && <AdminLoginPage   {...shared} onLogin={handleLogin} />}

      {/* ── MARKETPLACE ── */}
      {page === "marketplace"     && (
        <MarketplacePage
          {...shared}
          projects={projects}
          setSelectedProject={setSelectedProject}
        />
      )}

      {/* ── PROJECT DETAIL ── */}
      {page === "project-detail"  && (
        <ProjectDetailPage
          {...shared}
          project={selectedProject}
          setSelectedDev={setSelectedDev}
          onApply={handleApply}
        />
      )}

      {/* ── DEVELOPER PROFILE ── */}
      {page === "dev-profile"     && (
        <DevProfilePage
          {...shared}
          dev={selectedDev}
        />
      )}

      {/* ── DEVELOPER DASHBOARD ── */}
      {page === "dev-dashboard"   && (
        <DevDashboard
          {...shared}
          projects={projects}
          setSelectedProject={setSelectedProject}
        />
      )}

      {/* ── CLIENT DASHBOARD ── */}
      {page === "client-dashboard" && (
        <ClientDashboard
          {...shared}
          projects={projects}
          setSelectedProject={setSelectedProject}
        />
      )}

      {/* ── ADMIN DASHBOARD ── */}
      {page === "admin-dashboard" && (
        <AdminDashboard
          {...shared}
          setSelectedDev={setSelectedDev}
        />
      )}
    </>
  );
}