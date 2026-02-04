import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentById } from "../../services/studentService";
import { getApplicationsByStudent } from "../../services/applicationService";
import { MOCK_STUDENT_ID } from "../../utils/mockAuth";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const studentId = MOCK_STUDENT_ID;

  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const studentRes = await getStudentById(studentId);
        const appsRes = await getApplicationsByStudent(studentId);

        setStudent(studentRes.data);
        setApplications(appsRes.data || []);
      } catch (err) {
        console.error("Failed to load student dashboard", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading dashboard…</p>;
  }

  if (!student) {
    return (
      <main style={{ padding: "2rem" }}>
        <h2>Student not found</h2>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>
        Welcome, {student.fullName}
      </h1>

      <p style={{ color: "#555" }}>
        Roll No: {student.rollNumber} • {student.department}
      </p>

      {/* Stats */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        <DashboardCard
          title="Applications"
          value={applications.length}
          subtitle="Total applied"
        />

        <DashboardCard
          title="Placement Status"
          value={
            applications.some(app => app.status === "SELECTED")
              ? "Placed"
              : "Not Placed"
          }
          subtitle={
            applications.find(app => app.status === "SELECTED")
              ? `at ${applications.find(app => app.status === "SELECTED").companyName}`
              : "Keep applying!"
          }
          highlight={applications.some(app => app.status === "SELECTED")}
        />

        <DashboardCard
          title="CGPA"
          value={student.cgpa}
        />
      </section>

      {/* Actions */}
      <section
        style={{
          marginTop: "3rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <ActionButton
          label="View Opportunities"
          onClick={() => navigate("/student/opportunities")}
        />

        <ActionButton
          label="My Applications"
          onClick={() => navigate("/student/applications")}
        />

        <ActionButton
          label="My Profile"
          onClick={() => navigate("/student/profile")}
          secondary
        />
      </section>
    </main>
  );
}

/* ---------------- Components ---------------- */

function DashboardCard({ title, value, subtitle, highlight }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "1.5rem",
        background: "#fff",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>{title}</h3>

      <p
        style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          color: highlight ? "green" : "#111",
        }}
      >
        {value}
      </p>

      {subtitle && (
        <p style={{ color: "#666", marginTop: "0.25rem" }}>{subtitle}</p>
      )}
    </div>
  );
}

function ActionButton({ label, onClick, secondary }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.75rem 1.5rem",
        borderRadius: "8px",
        border: secondary ? "1px solid #2563eb" : "none",
        background: secondary ? "#fff" : "#2563eb",
        color: secondary ? "#2563eb" : "#fff",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}
