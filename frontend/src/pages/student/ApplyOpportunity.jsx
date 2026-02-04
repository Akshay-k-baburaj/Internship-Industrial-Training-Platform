import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOpportunityById } from "../../services/opportunityService";
import { applyForOpportunity } from "../../services/applicationService";

import { MOCK_STUDENT_ID } from "../../utils/mockAuth";

export default function ApplyOpportunity() {
  const { opportunityId } = useParams();
  const navigate = useNavigate();

  const studentId = MOCK_STUDENT_ID;

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🔹 existing error state (kept)
  const [error, setError] = useState(null);

  // 🔹 ADDED: popup state
  const [popup, setPopup] = useState({
    open: false,
    type: "", // "success" | "info"
    message: "",
  });

  useEffect(() => {
    async function loadOpportunity() {
      try {
        const res = await getOpportunityById(opportunityId);
        setOpportunity(res.data);
      } catch (err) {
        setError("Failed to load opportunity details.");
      } finally {
        setLoading(false);
      }
    }

    loadOpportunity();
  }, [opportunityId]);

  async function handleApply() {
    try {
      setSubmitting(true);
      setError(null);

      await applyForOpportunity(studentId, opportunityId);

      // ✅ SUCCESS POPUP
      setPopup({
        open: true,
        type: "success",
        message: "You have successfully applied for this opportunity!",
      });
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "";

      if (backendMessage.toLowerCase().includes("already applied")) {
        // ⚠️ ALREADY APPLIED POPUP
        setPopup({
          open: true,
          type: "info",
          message: "You have already applied for this opportunity.",
        });
      } else {
        setError("Application failed. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading…</p>;
  }

  if (!opportunity) {
    return <p style={{ padding: "2rem" }}>Opportunity not found.</p>;
  }

  return (
    <>
      {/* 🔔 POPUP MODAL */}
      {popup.open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "420px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
          >
            <h2
              style={{
                marginBottom: "0.75rem",
                color:
                  popup.type === "success" ? "#16a34a" : "#2563eb",
              }}
            >
              {popup.type === "success" ? "Application Submitted" : "Notice"}
            </h2>

            <p style={{ color: "#555", marginBottom: "1.5rem" }}>
              {popup.message}
            </p>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              {popup.type === "success" && (
                <button
                  onClick={() => navigate("/student/applications")}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  View Applications
                </button>
              )}

              <button
                onClick={() => setPopup({ open: false, type: "", message: "" })}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      <main style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "1.5rem",
            background: "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          ← Back
        </button>

        <h1 style={{ marginBottom: "0.5rem" }}>Confirm Application</h1>
        <p style={{ color: "#555", marginBottom: "2rem" }}>
          You are about to apply for the following opportunity
        </p>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "1.5rem",
            background: "#fff",
          }}
        >
          <h3>{opportunity.title}</h3>
          <p style={{ color: "#555" }}>{opportunity.companyName}</p>

          <ul style={{ marginTop: "1rem", lineHeight: "1.8" }}>
            <li><strong>Location:</strong> {opportunity.location}</li>
            <li><strong>Duration:</strong> {opportunity.duration}</li>
            <li><strong>Stipend:</strong> ₹{opportunity.stipend}</li>
            <li><strong>CGPA Required:</strong> {opportunity.requiredCgpa}</li>
            <li><strong>Deadline:</strong> {opportunity.deadline}</li>
          </ul>

          {error && (
            <p style={{ color: "red", marginTop: "1rem", fontWeight: 500 }}>
              {error}
            </p>
          )}

          <button
            onClick={handleApply}
            disabled={submitting}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: submitting ? "#9ca3af" : "#2563eb",
              color: "#fff",
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {submitting ? "Applying…" : "Confirm & Apply"}
          </button>
        </div>
      </main>
    </>
  );
}
