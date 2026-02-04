import { useEffect, useState } from "react";
import { getStudentById, updateStudent } from "../../services/studentService";
import { MOCK_STUDENT_ID } from "../../utils/mockAuth";

export default function StudentProfile() {
  const studentId = MOCK_STUDENT_ID;

  const [student, setStudent] = useState(null);
  const [form, setForm] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getStudentById(studentId);
        setStudent(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await updateStudent(studentId, form);
      setStudent(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading profile…</p>;

  return (
    <main style={page}>
      {/* Header */}
      <section style={header}>
        <div style={avatar}>SA</div>

        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0 }}>{student.fullName}</h1>
          <p style={{ color: "#6b7280" }}>{student.rollNumber}</p>
        </div>

        {!editMode ? (
          <button style={btnPrimary} onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button style={btnPrimary} onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              style={btnSecondary}
              onClick={() => {
                setForm(student);
                setEditMode(false);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </section>

      {/* Profile Info */}
      <section style={card}>
        <div style={grid}>
          <ProfileField
            label="Department"
            name="department"
            value={form.department}
            editMode={editMode}
            onChange={handleChange}
          />

          <ProfileField
            label="CGPA"
            name="cgpa"
            value={form.cgpa}
            editMode={editMode}
            onChange={handleChange}
          />

          <ProfileField
            label="Phone"
            name="phone"
            value={form.phone || ""}
            editMode={editMode}
            onChange={handleChange}
          />

          <ProfileField
            label="Skills"
            name="skills"
            value={form.skills || ""}
            editMode={editMode}
            onChange={handleChange}
            full
          />

          <LinkField
            label="GitHub"
            name="githubUrl"
            value={form.githubUrl}
            editMode={editMode}
            onChange={handleChange}
          />

          <LinkField
            label="LinkedIn"
            name="linkedinUrl"
            value={form.linkedinUrl}
            editMode={editMode}
            onChange={handleChange}
          />
        </div>
      </section>
    </main>
  );
}

/* ---------------- Components ---------------- */

function ProfileField({ label, value, name, editMode, onChange, full }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : "auto" }}>
      <label style={labelStyle}>{label}</label>
      {editMode ? (
        <input name={name} value={value} onChange={onChange} style={input} />
      ) : (
        <p style={text}>{value || "-"}</p>
      )}
    </div>
  );
}

function LinkField({ label, value, name, editMode, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {editMode ? (
        <input name={name} value={value || ""} onChange={onChange} style={input} />
      ) : value ? (
        <a href={value} target="_blank" style={link}>
          {value}
        </a>
      ) : (
        <p style={text}>-</p>
      )}
    </div>
  );
}

/* ---------------- Styles ---------------- */

const page = {
  padding: "2rem",
  maxWidth: "1100px",
  margin: "auto",
};

const header = {
  display: "flex",
  alignItems: "center",
  gap: "1.5rem",
  marginBottom: "2rem",
};

const avatar = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background: "#2563eb",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: "1.5rem",
};

const card = {
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "2rem",
  background: "#fff",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "1.5rem",
};

const labelStyle = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#6b7280",
};

const text = {
  marginTop: "0.25rem",
  fontSize: "1rem",
};

const input = {
  marginTop: "0.25rem",
  padding: "0.6rem",
  width: "100%",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
};

const link = {
  marginTop: "0.25rem",
  display: "block",
  color: "#2563eb",
  textDecoration: "none",
  wordBreak: "break-all",
};

const btnPrimary = {
  padding: "0.6rem 1.2rem",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
};

const btnSecondary = {
  padding: "0.6rem 1.2rem",
  background: "#fff",
  color: "#2563eb",
  border: "1px solid #2563eb",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
};
