import { useState } from "react";
import { PROJECTS } from "./constants/data";

// ── Pages ────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// ROOT APP — Page Router
//
// Shared state:
//   projects       — live project list (applicant counts update on apply)
//   onApply(id)    — called by ProjectDetailPage when dev submits application
//                    increments applicants count on the correct project,
//                    which ClientDashboard and Marketplace both read from.
//
// ADMIN CREDENTIALS: admin@SmartDevMarketplace.com / Admin@2025
// ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage]                       = useState("home");
  const [role, setRole]                       = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDev, setSelectedDev]         = useState(null);

  // ── SHARED PROJECTS STATE ─────────────────────────────────────
  // Initialised from mock data. When backend is ready, replace PROJECTS
  // with an API fetch here and everything downstream updates automatically.
  const [projects, setProjects] = useState(PROJECTS);

  // Called by ProjectDetailPage when a developer submits an application.
  // Increments applicant count on the matching project so ClientDashboard
  // and Marketplace both show the updated number immediately.
  const handleApply = (projectId) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, applicants: p.applicants + 1 }
          : p
      )
    );
    // Also update selectedProject so the detail page reflects it instantly
    setSelectedProject(prev =>
      prev?.id === projectId
        ? { ...prev, applicants: prev.applicants + 1 }
        : prev
    );
  };

  // ── AUTH ──────────────────────────────────────────────────────
  const handleLogin = (r) => {
    setRole(r);
    if (r === "admin")       setPage("admin-dashboard");
    else if (r === "client") setPage("client-dashboard");
    else                     setPage("dev-dashboard");
  };

  const handleLogout = () => {
    setRole(null);
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