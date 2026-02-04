import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationsByOpportunity } from "../../services/applicationService";
import { getOpportunityById } from "../../services/opportunityService";
import "./PlacementGlobal.css";

export default function OpportunityApplications() {
  const { opportunityId } = useParams(); // Matches route /:opportunityId
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appRes, oppRes] = await Promise.all([
          getApplicationsByOpportunity(opportunityId),
          getOpportunityById(opportunityId)
        ]);
        setApplications(appRes.data);
        setOpportunity(oppRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [opportunityId]);

  if (loading) return <div className="placement-layout-container">Loading...</div>;
  if (!opportunity) return <div className="placement-layout-container">Opportunity not found.</div>;

  return (
    <div className="placement-layout-container">
      <div className="placement-card" style={{ maxWidth: "1200px" }}>
        <header className="placement-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="placement-title">Applications</h1>
            <p className="placement-subtitle">
              For: <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{opportunity.title}</span> ({opportunity.companyName})
            </p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/placement/opportunities")}
          >
            Back to Opportunities
          </button>
        </header>

        <div className="placement-form"> {/* Utilizing padding from form class */}
          {error && <div className="error-message">{error}</div>}

          {applications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
              <p>No applications received yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>Student Name</th>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>Roll Number</th>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>Department</th>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>CGPA</th>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>Applied On</th>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "1rem", fontWeight: 500 }}>{app.studentName || "N/A"}</td>
                      <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{app.studentRollNumber || "N/A"}</td>
                      <td style={{ padding: "1rem" }}>{app.studentDepartment || "N/A"}</td>
                      <td style={{ padding: "1rem", fontWeight: 600 }}>{app.studentCgpa || "N/A"}</td>
                      <td style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.9em" }}>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let color = "#64748b"; // gray
  let bg = "#f1f5f9";

  if (status === "SELECTED") {
    color = "#16a34a"; // green
    bg = "#dcfce7";
  } else if (status === "REJECTED") {
    color = "#dc2626"; // red
    bg = "#fee2e2";
  } else if (status === "APPROVED") {
    color = "#2563eb"; // blue
    bg = "#dbeafe";
  }

  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.25rem 0.75rem",
        borderRadius: "99px",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: color,
        backgroundColor: bg,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}
    >
      {status}
    </span>
  );
}
