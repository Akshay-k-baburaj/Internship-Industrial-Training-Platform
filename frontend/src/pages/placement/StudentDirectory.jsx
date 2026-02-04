import { useState, useEffect } from "react";
import { getAllStudents } from "../../services/studentService";
import "./PlacementGlobal.css";

export default function StudentDirectory() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getAllStudents();
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  useEffect(() => {
    let result = students;

    // 1. Search (Name or Roll No)
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          (s.fullName && s.fullName.toLowerCase().includes(q)) ||
          (s.rollNumber && s.rollNumber.toLowerCase().includes(q))
      );
    }

    // 2. Department Filter
    if (deptFilter !== "ALL") {
      result = result.filter((s) => s.department === deptFilter);
    }

    // 3. Status Filter (Placed / Unplaced)
    if (statusFilter !== "ALL") {
      const isPlaced = statusFilter === "PLACED";
      result = result.filter((s) => s.isPlaced === isPlaced);
    }

    setFilteredStudents(result);
  }, [search, deptFilter, statusFilter, students]);

  if (loading) return <div className="placement-layout-container">Loading Directory...</div>;

  return (
    <div className="placement-layout-container">
      <div className="placement-card" style={{ maxWidth: "1200px" }}>
        <header
          className="placement-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <div>
            <h1 className="placement-title">Student Directory</h1>
            <p className="placement-subtitle">
              Manage and view all registered students
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {/* Add Export button later if needed */}
          </div>
        </header>

        <div className="placement-form">
          {error && <div className="error-message">{error}</div>}

          {/* FILTERS BAR */}
          <div style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            backgroundColor: "var(--bg-color)",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid var(--border-color)"
          }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <input
                className="form-input"
                placeholder="Search by Name or Roll No..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-select"
              style={{ width: "150px" }}
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="ALL">All Depts</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="MCA">MCA</option>
              <option value="MMS">MMS</option>
            </select>

            <select
              className="form-select"
              style={{ width: "150px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PLACED">Placed</option>
              <option value="UNPLACED">Unplaced</option>
            </select>
          </div>

          {/* TABLE */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Student</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Roll No</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Department</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>CGPA</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Skills</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
                      No students found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "1rem", fontWeight: 600 }}>{student.fullName}</td>
                      <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{student.rollNumber}</td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "#f1f5f9",
                          borderRadius: "4px",
                          fontSize: "0.85em",
                          fontWeight: 500
                        }}>
                          {student.department}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", fontWeight: 600 }}>{student.cgpa}</td>
                      <td style={{ padding: "1rem", fontSize: "0.9em", color: "var(--text-secondary)", maxWidth: "200px" }}>
                        {student.skills ? student.skills.substring(0, 30) + (student.skills.length > 30 ? "..." : "") : "-"}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {student.isPlaced ? (
                          <span style={{ color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            ✓ Placed
                          </span>
                        ) : (
                          <span style={{ color: "#ea580c", fontWeight: 500 }}>
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "1rem", textAlign: "right", color: "var(--text-secondary)", fontSize: "0.9em" }}>
            Showing {filteredStudents.length} of {students.length} students
          </div>

        </div>
      </div>
    </div>
  );
}
