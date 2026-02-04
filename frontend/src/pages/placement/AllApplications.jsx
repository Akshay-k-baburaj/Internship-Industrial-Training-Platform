import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllApplications } from "../../services/applicationService";
import "./PlacementGlobal.css";

export default function AllApplications() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getAllApplications();
                setApplications(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load applications.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div className="placement-layout-container">Loading Applications...</div>;

    return (
        <div className="placement-layout-container">
            <div className="placement-card" style={{ maxWidth: "1200px" }}>
                <header className="placement-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="placement-title">All Applications</h1>
                        <p className="placement-subtitle">
                            Master list of all student applications
                        </p>
                    </div>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/placement/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </header>

                <div className="placement-form">
                    {error && <div className="error-message">{error}</div>}

                    {applications.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                            <p>No applications received yet.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
                                <thead>
                                    <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                                        <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Student</th>
                                        <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Roll No</th>
                                        <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Opportunity</th>
                                        <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Company</th>
                                        <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>CGPA</th>
                                        <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Applied On</th>
                                        <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app) => (
                                        <tr key={app.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                            <td style={{ padding: "1rem", fontWeight: 600 }}>{app.studentName || "N/A"}</td>
                                            <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{app.studentRollNumber || "N/A"}</td>
                                            <td style={{ padding: "1rem", fontWeight: 500 }}>{app.opportunityTitle || "N/A"}</td>
                                            <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{app.companyName || "N/A"}</td>
                                            <td style={{ padding: "1rem" }}>{app.studentCgpa || "N/A"}</td>
                                            <td style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.9em" }}>
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: "1rem" }}>
                                                <StatusBadge status={app.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    let color = "#64748b"; // gray
    let bg = "#f1f5f9";

    if (status === "SELECTED") {
        color = "#16a34a"; // green
        bg = "#dcfce7";
    } else if (status === "REJECTED") {
        color = "#dc2626"; // red
        bg = "#fee2e2";
    } else if (status === "APPROVED") {
        color = "#2563eb"; // blue
        bg = "#dbeafe";
    }

    return (
        <span
            style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                borderRadius: "99px",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: color,
                backgroundColor: bg,
                textTransform: "uppercase",
                letterSpacing: "0.05em"
            }}
        >
            {status}
        </span>
    );
}
