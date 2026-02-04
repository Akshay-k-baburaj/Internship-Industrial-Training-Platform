import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUnplacedStudents } from "../../services/studentService";
import { getFacultyByUserId } from "../../services/facultyService";
import { MOCK_USER_ID } from "../../utils/mockAuth";
import "../faculty/FacultyGlobal.css";

export default function UnplacedStudents() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // Check if user is faculty (simplistic check for now using MOCK_USER_ID)
      // In a real app, we'd check the auth context role
      // Here we assume if MOCK_USER_ID is 6 or 7, it's faculty
      if (MOCK_USER_ID === 6 || MOCK_USER_ID === 7 || MOCK_USER_ID === 8) {
        const facultyRes = await getFacultyByUserId(MOCK_USER_ID);
        const dept = facultyRes.data.department;
        const res = await getUnplacedStudents(dept); // Pass department
        setStudents(res.data);
      } else {
        // If not faculty (e.g. admin or placement), fetch all
        const res = await getUnplacedStudents();
        setStudents(res.data);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load unplaced students.");
    } finally {
      setLoading(false);
    }
  }

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(search.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="faculty-layout-container">
      <div className="faculty-card">
        <header className="faculty-header" style={{ padding: "2rem" }}>
          <div>
            <h1 className="faculty-title">Unplaced Students Directory</h1>
            <p className="faculty-subtitle">
              List of students currently seeking placement opportunities.
            </p>
          </div>
          <div style={{ marginTop: "1rem", maxWidth: "400px" }}>
            <input
              type="text"
              placeholder="Search by name or roll number..."
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div style={{ padding: "0 2rem 2rem 2rem" }}>
          {error && <div className="error-message" style={{ marginBottom: "1rem" }}>{error}</div>}

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Roll No</th>
                  <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Name</th>
                  <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Department</th>
                  <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>CGPA</th>
                  <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ padding: "2rem", textAlign: "center" }}>Loading...</td></tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                      No unplaced students found. Good job!
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "1rem", color: "#64748b" }}>{student.rollNumber}</td>
                      <td style={{ padding: "1rem", fontWeight: 500 }}>{student.fullName}</td>
                      <td style={{ padding: "1rem" }}>{student.department}</td>
                      <td style={{ padding: "1rem" }}>{student.cgpa}</td>
                      <td style={{ padding: "1rem" }}>
                        {/* Placeholder for future actions like "View Profile" */}
                        <button
                          className="btn btn-secondary"
                          style={{ padding: "0.25rem 0.75rem", fontSize: "0.85rem" }}
                          onClick={() => alert("Student Profile View coming soon!")}
                        >
                          View
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
    </div>
  );
}
