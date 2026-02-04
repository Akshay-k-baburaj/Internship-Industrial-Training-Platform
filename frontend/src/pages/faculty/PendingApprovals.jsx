import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFacultyByUserId } from "../../services/facultyService";
import { getPendingApplicationsByDepartment } from "../../services/applicationService";
import { MOCK_USER_ID } from "../../utils/mockAuth";
import "./FacultyGlobal.css";

export default function PendingApprovals() {
  const navigate = useNavigate();
  // TEMP: Replace with auth context
  const userId = MOCK_USER_ID;

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [department, setDepartment] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      // 1. Get Faculty Profile to find Department
      const facultyRes = await getFacultyByUserId(userId);
      const facultyDept = facultyRes.data.department;
      setDepartment(facultyDept);

      // 2. Get Pending Applications for that Department
      const appsRes = await getPendingApplicationsByDepartment(facultyDept);
      setApplications(appsRes.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setError("PROFILE_MISSING");
      } else {
        setError("Failed to load pending approvals.");
      }
    } finally {
      setLoading(false);
    }
  }

  const filteredApps = applications.filter((app) =>
    app.studentName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="faculty-layout-container">Loading Pending Approvals...</div>;

  if (error === "PROFILE_MISSING") {
    return (
      <div className="faculty-layout-container">
        <div className="faculty-card" style={{ padding: "3rem", textAlign: "center" }}>
          <h2 style={{ color: "#dc2626", marginBottom: "1rem" }}>Faculty Profile Missing</h2>
          <p style={{ color: "#64748b", marginBottom: "2rem" }}>
            You need to create your faculty profile before you can review applications.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/faculty/profile")}>
            Create Profile Now
          </button>
        </div>
      </div>
    );
  }

  if (error) return <div className="faculty-layout-container error-message">{error}</div>;

  return (
    <div className="faculty-layout-container">
      <div className="faculty-card">
        <header className="faculty-header" style={{ padding: "2rem" }}>
          <h1 className="faculty-title">Pending Approvals</h1>
          <p className="faculty-subtitle">
            Review internship applications from <strong>{department}</strong> students.
          </p>

          <div style={{ maxWidth: "400px" }}>
            <input
              type="text"
              placeholder="Search by student name..."
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Student</th>
                <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Company</th>
                <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Role</th>
                <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Applied Date</th>
                <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                    No pending approvals found.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: 500 }}>{app.studentName}</div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{app.studentRollNumber}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>{app.companyName}</td>
                    <td style={{ padding: "1rem", fontWeight: 500, color: "#4f46e5" }}>
                      {app.opportunityTitle}
                    </td>
                    <td style={{ padding: "1rem", color: "#64748b" }}>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <button
                        className="btn btn-primary"
                        style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                        onClick={() => navigate(`/faculty/review/${app.id}`)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
