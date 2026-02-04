import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplicationsByStudent } from "../../services/applicationService";
import { getOpportunityById } from "../../services/opportunityService";

import { MOCK_STUDENT_ID } from "../../utils/mockAuth";

export default function StudentApplications() {
  const navigate = useNavigate();
  const studentId = MOCK_STUDENT_ID;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await getApplicationsByStudent(studentId);
        const apps = res.data || [];

        const enriched = await Promise.all(
          apps.map(async (app) => {
            try {
              const oppRes = await getOpportunityById(app.opportunityId);
              return {
                ...app,
                opportunity: oppRes.data,
              };
            } catch {
              return {
                ...app,
                opportunity: null,
              };
            }
          })
        );

        setApplications(enriched);
      } catch (err) {
        console.error("Failed to load applications", err);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading applications…</p>;
  }

  if (applications.length === 0) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>My Applications</h1>
        <p>You haven’t applied to any opportunities yet.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>My Applications</h1>

      <section
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {applications.map((app) => {
          const opp = app.opportunity;

          return (
            <div
              key={app.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "1.5rem",
                background: "#fff",
              }}
            >


              <p>
                <strong>Opportunity:</strong>{" "}
                {opp ? `${opp.title}` : "—"}
              </p>

              <p>
                <strong>At:</strong>{" "}
                {opp ? opp.companyName : "—"}
              </p>

              <p>
                <strong>Stipend:</strong>{" "}
                {opp ? `₹${opp.stipend}` : "—"}
              </p>

              <p>
                <strong>Applied On:</strong>{" "}
                {app.appliedAt
                  ? new Date(app.appliedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  : "—"}
              </p>

              <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                <StatusBadge status={app.status} />
                <ApprovalBadge status={app.facultyApprovalStatus} />
              </div>

              <button
                onClick={() =>
                  navigate(`/student/opportunities/${app.opportunityId}`)
                }
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid #2563eb",
                  background: "#fff",
                  color: "#2563eb",
                  cursor: "pointer",
                }}
              >
                View Opportunity
              </button>
            </div>
          );
        })}
      </section>
    </main>
  );
}

/* ---------- Helpers ---------- */

function StatusBadge({ status }) {
  const colors = {
    APPLIED: "#2563eb",
    APPROVED: "#16a34a",
    REJECTED: "#dc2626",
    SELECTED: "#7c3aed",
  };

  return (
    <span
      style={{
        padding: "0.25rem 0.7rem",
        borderRadius: "999px",
        backgroundColor: colors[status] || "#6b7280",
        color: "#fff",
        fontSize: "0.75rem",
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}

function ApprovalBadge({ status }) {
  const colors = {
    PENDING: "#f59e0b",
    APPROVED: "#16a34a",
    REJECTED: "#dc2626",
  };

  return (
    <span
      style={{
        padding: "0.25rem 0.7rem",
        borderRadius: "999px",
        backgroundColor: colors[status] || "#6b7280",
        color: "#fff",
        fontSize: "0.75rem",
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}
