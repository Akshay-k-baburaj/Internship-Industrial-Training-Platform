import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVerificationList, verifyPlacement } from "../../services/applicationService";
import "./FacultyGlobal.css";

export default function PlacementVerification() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const res = await getVerificationList();
            setApplications(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load verification list.");
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify(appId, studentName, companyName) {
        if (!window.confirm(`Are you sure you want to mark ${studentName} as PLACED at ${companyName}? This will auto-reject other applications.`)) {
            return;
        }

        try {
            await verifyPlacement(appId);
            setSuccess(`${studentName} marked as PLACED successfully.`);
            loadData(); // Refresh list
        } catch (err) {
            console.error(err);
            setError("Failed to verify placement.");
        }
    }

    const filteredApps = applications.filter((app) =>
        app.studentName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="faculty-layout-container">
            <div className="faculty-card">
                <header className="faculty-header" style={{ padding: "2rem" }}>
                    <div>
                        <h1 className="faculty-title">Placement Verification</h1>
                        <p className="faculty-subtitle">
                            Finalize student placements. <strong>Warning:</strong> Verifying a placement will auto-reject all other applications for that student.
                        </p>
                    </div>
                    <div style={{ marginTop: "1rem", maxWidth: "400px" }}>
                        <input
                            type="text"
                            placeholder="Search by student name..."
                            className="form-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </header>

                <div style={{ padding: "0 2rem 2rem 2rem" }}>
                    {error && <div className="error-message" style={{ marginBottom: "1rem" }}>{error}</div>}
                    {success && (
                        <div style={{
                            padding: "1rem", backgroundColor: "#f0fdf4", color: "#16a34a",
                            border: "1px solid #bbf7d0", borderRadius: "8px", marginBottom: "1rem"
                        }}>
                            {success}
                        </div>
                    )}

                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                                    <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Student</th>
                                    <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Company</th>
                                    <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Role</th>
                                    <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Faculty Approval</th>
                                    <th style={{ padding: "1rem", fontWeight: 600, color: "#64748b" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ padding: "2rem", textAlign: "center" }}>Loading...</td></tr>
                                ) : filteredApps.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                                            No approved applications waiting for verification.
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
                                            <td style={{ padding: "1rem" }}>
                                                <span style={{
                                                    padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600,
                                                    backgroundColor: "#dcfce7", color: "#166534"
                                                }}>
                                                    {app.facultyApprovalStatus}
                                                </span>
                                            </td>
                                            <td style={{ padding: "1rem" }}>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", backgroundColor: "#0f172a" }}
                                                    onClick={() => handleVerify(app.id, app.studentName, app.companyName)}
                                                >
                                                    Mark as Placed
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
