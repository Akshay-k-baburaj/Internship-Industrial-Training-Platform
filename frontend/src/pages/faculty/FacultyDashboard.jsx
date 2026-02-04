import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFacultyByUserId, getFacultyDashboardStats } from "../../services/facultyService";
import { MOCK_USER_ID } from "../../utils/mockAuth";
import "./FacultyGlobal.css";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    studentsReviewed: 0,
    totalDepartmentStudents: 0,
    unplacedStudents: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const facultyRes = await getFacultyByUserId(MOCK_USER_ID);
      const facultyId = facultyRes.data.id;
      const statsRes = await getFacultyDashboardStats(facultyId);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    }
  }

  return (
    <div className="faculty-layout-container">
      <div className="faculty-header" style={{ borderBottom: "none", paddingBottom: "1rem" }}>
        <h1 className="faculty-title">Faculty Dashboard</h1>
        <p className="faculty-subtitle">Welcome back, Professor</p>
      </div>

      {/* STATS OVERVIEW */}
      <div className="form-grid" style={{ marginBottom: "3rem" }}>

        <DashboardCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon="⏳"
          color="orange"
          onClick={() => navigate("/faculty/pending-approvals")}
        />

        <DashboardCard
          title="Students Reviewed"
          value={stats.studentsReviewed}
          icon="✅"
          color="green"
          onClick={() => navigate("/faculty/reviewed-students")}
        />

        <DashboardCard
          title="Unplaced in Dept"
          value={stats.unplacedStudents}
          icon="🎓"
          color="blue"
          onClick={() => navigate("/faculty/unplaced-students")}
        />

      </div>

      {/* QUICK ACTIONS SECTION */}
      <div className="faculty-card" style={{ padding: "2rem" }}>
        <h2 className="form-section-title">Quick Actions</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/faculty/pending-approvals")}
          >
            Review Pending Applications
          </button>

          <button
            className="btn btn-primary"
            style={{ backgroundColor: "#22c55e" }} // Green
            onClick={() => navigate("/faculty/reviewed-students")}
          >
            View Reviewed Students
          </button>

          <button
            className="btn btn-primary"
            style={{ backgroundColor: "#0f172a" }}
            onClick={() => navigate("/faculty/verification")}
          >
            Verify Placements
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/faculty/unplaced-students")}
          >
            Unplaced Students
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/faculty/profile")}
          >
            Update My Profile
          </button>

        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, color, onClick }) {
  const colors = {
    orange: { bg: "#fff7ed", text: "#c2410c" },
    green: { bg: "#f0fdf4", text: "#15803d" },
    blue: { bg: "#eff6ff", text: "#1d4ed8" },
  };

  const theme = colors[color] || colors.blue;

  return (
    <div
      className="faculty-card"
      style={{
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s"
      }}
      onClick={onClick}
      onMouseEnter={(e) => { if (onClick) e.currentTarget.style.transform = "translateY(-4px)" }}
      onMouseLeave={(e) => { if (onClick) e.currentTarget.style.transform = "translateY(0)" }}
    >
      <div
        style={{
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "12px",
          backgroundColor: theme.bg,
          color: theme.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.75rem"
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>{title}</p>
        <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "var(--text-main)" }}>{value}</p>
      </div>
    </div>
  );
}
