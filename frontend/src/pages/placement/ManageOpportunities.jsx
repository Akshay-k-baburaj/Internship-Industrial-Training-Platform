import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllOpportunities,
  deleteOpportunity,
} from "../../services/opportunityService";

export default function ManageOpportunities() {
  const navigate = useNavigate();

  // TEMP — replace with auth later
  const postedById = 1;

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    try {
      const res = await getAllOpportunities();
      setOpportunities(res.data || []);
    } catch (err) {
      console.error("Failed to load opportunities", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );
    if (!confirmed) return;

    try {
      await deleteOpportunity(id, postedById);
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete opportunity.");
    }
  }

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading opportunities…</p>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>Manage Opportunities</h1>

        <button
          onClick={() => navigate("/placement/opportunities/create")}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Create Opportunity
        </button>
      </div>

      {opportunities.length === 0 && (
        <p style={{ color: "#555" }}>No opportunities created yet.</p>
      )}

      <section
        style={{
          display: "grid",
          gap: "1.5rem",
          maxWidth: "900px",
        }}
      >
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "1.5rem",
              background: "#fff",
            }}
          >
            <h3>{opp.title}</h3>
            <p style={{ color: "#555" }}>{opp.company_name}</p>

            <p>
              <strong>Type:</strong> {opp.type}
            </p>
            <p>
              <strong>Stipend:</strong>{" "}
              {opp.stipend ? `₹${opp.stipend}` : "—"}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {opp.deadline
                ? new Date(opp.deadline).toLocaleDateString("en-GB")
                : "—"}
            </p>

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() =>
                  navigate(`/placement/opportunities/edit/${opp.id}`)
                }
                style={btnOutline}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  navigate(`/placement/applications/${opp.id}`)
                }
                style={btnOutline}
              >
                View Applications
              </button>

              <button
                onClick={() => handleDelete(opp.id)}
                style={btnDanger}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

/* ---------- Button styles ---------- */

const btnOutline = {
  padding: "0.4rem 0.8rem",
  borderRadius: "6px",
  border: "1px solid #2563eb",
  background: "#fff",
  color: "#2563eb",
  cursor: "pointer",
};

const btnDanger = {
  padding: "0.4rem 0.8rem",
  borderRadius: "6px",
  border: "none",
  background: "#dc2626",
  color: "#fff",
  cursor: "pointer",
};
