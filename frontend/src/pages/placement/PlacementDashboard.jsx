import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlacementStatistics } from "../../services/statisticsService";
import { MOCK_PLACEMENT_USER_ID } from "../../utils/mockAuth";
import "./PlacementGlobal.css";

export default function PlacementDashboard() {
  const navigate = useNavigate();
  // TEMP: replace with auth later
  const placementCellId = MOCK_PLACEMENT_USER_ID;

  const [stats, setStats] = useState({
    totalOpportunities: 0,
    totalApplications: 0,
    selectedStudents: 0,
    rejectedApplications: 0,
    acceptanceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await getPlacementStatistics(placementCellId);
        if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to load statistics", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="placement-layout-container">Loading Dashboard...</div>;

  return (
    <div className="placement-layout-container">
      <div className="placement-header" style={{ borderBottom: 'none', padding: '0 0 2rem 0' }}>
        <h1 className="placement-title">Placement Dashboard</h1>
        <p className="placement-subtitle">Overview of campus placement activities</p>
      </div>

      {/* STATS GRID */}
      <div className="form-grid" style={{ marginBottom: "3rem" }}>
        <StatCard
          title="Total Opportunities"
          value={stats.totalOpportunities}
          icon="💼"
          color="blue"
          onClick={() => navigate("/placement/opportunities")}
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon="📄"
          color="indigo"
          onClick={() => navigate("/placement/applications")}
        />
        <StatCard
          title="Students Placed"
          value={stats.selectedStudents}
          icon="🎓"
          color="green"
          onClick={() => navigate("/placement/students")}
        />
        <StatCard
          title="Acceptance Rate"
          value={`${stats.acceptanceRate}%`}
          icon="📈"
          color="purple"
          onClick={() => navigate("/placement/analytics")}
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="placement-card" style={{ padding: "2rem" }}>
        <h2 className="form-section-title">Quick Actions</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => navigate("/placement/opportunities/create")}>
            + Create New Opportunity
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/placement/students")}>
            View Student Directory
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/placement/analytics")}>
            View Detailed Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, onClick }) {
  const colors = {
    blue: { bg: "#eff6ff", text: "#1d4ed8" },
    indigo: { bg: "#eef2ff", text: "#4338ca" },
    green: { bg: "#f0fdf4", text: "#15803d" },
    purple: { bg: "#faf5ff", text: "#7e22ce" },
  };

  const theme = colors[color] || colors.blue;

  return (
    <div
      className="placement-card"
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
          width: "3rem",
          height: "3rem",
          borderRadius: "12px",
          backgroundColor: theme.bg,
          color: theme.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem"
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
