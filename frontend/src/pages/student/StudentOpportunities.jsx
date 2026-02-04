import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOpportunities } from "../../services/opportunityService";
import { checkEligibility } from "../../services/eligibilityService";
import { getApplicationsByStudent } from "../../services/applicationService";
import { MOCK_STUDENT_ID } from "../../utils/mockAuth";

export default function StudentOpportunities() {
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [eligibilityMap, setEligibilityMap] = useState({});
  const [appliedMap, setAppliedMap] = useState({});
  const [loading, setLoading] = useState(true);

  const studentId = MOCK_STUDENT_ID;

  useEffect(() => {
    async function loadData() {
      try {
        const oppRes = await getAllOpportunities();
        const opps = oppRes.data || [];
        setOpportunities(opps);

        // ✅ Eligibility check
        const eligibilityResults = {};
        for (const opp of opps) {
          try {
            eligibilityResults[opp.id] = await checkEligibility(studentId, opp.id);
          } catch {
            eligibilityResults[opp.id] = false;
          }
        }
        setEligibilityMap(eligibilityResults);

        // ✅ Applied opportunities
        const appsRes = await getApplicationsByStudent(studentId);
        const applied = {};
        appsRes.data.forEach(app => {
          applied[app.opportunityId] = true;
        });
        setAppliedMap(applied);

      } catch (err) {
        console.error("Failed to load opportunities", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading opportunities…</p>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Available Opportunities</h1>

      <section
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {opportunities.map((opp) => {
          const isEligible = eligibilityMap[opp.id] === true;
          const alreadyApplied = appliedMap[opp.id] === true;

          return (
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
              <p>{opp.companyName}</p>

              <p>
                CGPA Required: <strong>{opp.requiredCgpa}</strong>
              </p>

              <p>
                Status:{" "}
                {alreadyApplied ? (
                  <span style={{ color: "#2563eb", fontWeight: 600 }}>
                    Already Applied
                  </span>
                ) : isEligible ? (
                  <span style={{ color: "green", fontWeight: 600 }}>
                    Eligible
                  </span>
                ) : (
                  <span style={{ color: "red", fontWeight: 600 }}>
                    Not Eligible
                  </span>
                )}
              </p>

              <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => navigate(`/student/opportunities/${opp.id}`)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "6px",
                    border: "1px solid #2563eb",
                    background: "#fff",
                    color: "#2563eb",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>

                <button
                  disabled={!isEligible || alreadyApplied}
                  onClick={() =>
                    navigate(`/student/apply/${opp.id}/`)
                  }
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor:
                      alreadyApplied ? "#d1d5db" :
                        isEligible ? "#2563eb" : "#9ca3af",
                    color: "#fff",
                    cursor:
                      !isEligible || alreadyApplied
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {alreadyApplied ? "Applied" : "Apply"}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
