import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOpportunityById } from "../../services/opportunityService";
import { getApplicationsByStudent } from "../../services/applicationService";

import { MOCK_STUDENT_ID } from "../../utils/mockAuth";

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const studentId = MOCK_STUDENT_ID;

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    async function loadOpportunity() {
      try {
        // 🔹 Fetch opportunity
        const res = await getOpportunityById(id);
        setOpportunity(res.data);

        // 🔹 Check if student already applied
        const appsRes = await getApplicationsByStudent(studentId);
        const hasApplied = appsRes.data.some(
          (app) => app.opportunityId === Number(id)
        );
        setAlreadyApplied(hasApplied);
      } catch (err) {
        console.error("Failed to load opportunity", err);
      } finally {
        setLoading(false);
      }
    }

    loadOpportunity();
  }, [id]);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading opportunity…</p>;
  }

  if (!opportunity) {
    return <p style={{ padding: "2rem" }}>Opportunity not found</p>;
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "1rem",
          background: "none",
          border: "none",
          color: "#2563eb",
          cursor: "pointer",
          fontSize: "0.95rem",
        }}
      >
        ← Back
      </button>

      <h1>{opportunity.title}</h1>
      <p style={{ color: "#555", marginTop: "0.25rem" }}>
        {opportunity.companyName}
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h3>Description</h3>
        <p>{opportunity.description}</p>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h3>Details</h3>
        <ul style={{ lineHeight: "1.8" }}>
          <li><strong>Type:</strong> {opportunity.type}</li>
          <li><strong>Location:</strong> {opportunity.location}</li>
          <li><strong>Work Mode:</strong> {opportunity.workMode}</li>
          <li><strong>Duration:</strong> {opportunity.duration}</li>
          <li><strong>Stipend:</strong> ₹{opportunity.stipend}</li>
          <li><strong>CGPA Required:</strong> {opportunity.requiredCgpa}</li>
          <li><strong>Deadline:</strong> {opportunity.deadline}</li>
        </ul>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h3>Required Skills</h3>
        <p>{opportunity.requiredSkills}</p>
      </section>

      <button
        disabled={alreadyApplied}
        onClick={() => navigate(`/student/apply/${id}`)}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: alreadyApplied ? "#9ca3af" : "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: alreadyApplied ? "not-allowed" : "pointer",
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        {alreadyApplied ? "Already Applied" : "Apply Now"}
      </button>
    </main>
  );
}
