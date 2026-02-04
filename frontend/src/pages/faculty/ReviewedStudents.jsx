import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFacultyByUserId } from "../../services/facultyService";
import { getReviewedStudents } from "../../services/applicationService"; // We will add this export
import { MOCK_USER_ID } from "../../utils/mockAuth";
import "./FacultyGlobal.css";

export default function ReviewedStudents() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
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
            const facultyRes = await getFacultyByUserId(MOCK_USER_ID);
            const facultyDept = facultyRes.data.department;
            setDepartment(facultyDept);

            // 2. Get Reviewed Students
            const res = await getReviewedStudents(facultyDept);
            setStudents(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load reviewed students.");
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
                        <h1 className="faculty-title">Students Reviewed</h1>
                        <p className="faculty-subtitle">
                            Students from <strong>{department}</strong> who you have already evaluated.
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
                                    <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>CGPA</th>
                                    <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Placement Status</th>
                                    <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ padding: "2rem", textAlign: "center" }}>Loading...</td></tr>
                                ) : filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                                            No students reviewed yet.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "1rem", color: "#64748b" }}>{student.rollNumber}</td>
                                            <td style={{ padding: "1rem", fontWeight: 500 }}>{student.fullName}</td>
                                            <td style={{ padding: "1rem" }}>{student.cgpa}</td>
                                            <td style={{ padding: "1rem" }}>
                                                <span style={{
                                                    padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600,
                                                    backgroundColor: student.isPlaced ? "#dcfce7" : "#fef3c7",
                                                    color: student.isPlaced ? "#166534" : "#92400e"
                                                }}>
                                                    {student.isPlaced ? "Placed" : "Unplaced"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "1rem" }}>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: "0.25rem 0.75rem", fontSize: "0.85rem" }}
                                                    onClick={() => alert("Profile View Coming Soon")}
                                                >
                                                    View Profile
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
