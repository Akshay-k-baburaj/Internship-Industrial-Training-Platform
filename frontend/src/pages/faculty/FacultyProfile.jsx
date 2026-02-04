import { useState, useEffect } from "react";
import { getFacultyByUserId, updateFaculty, createFaculty } from "../../services/facultyService";
import { MOCK_USER_ID } from "../../utils/mockAuth";
import "./FacultyGlobal.css";

export default function FacultyProfile() {
  // TEMP: Replace with actual auth context later
  const userId = MOCK_USER_ID;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const res = await getFacultyByUserId(userId);
      setFaculty(res.data);
      setForm(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        // Expected behavior for new users
        console.log("No profile found - initializing create mode.");
        setFaculty(null);
        setForm({
          userId: userId, // Pass userId for creation
          fullName: "",
          phone: "",
          employeeId: "",
          department: "CSE",
          designation: ""
        });
        setIsEditing(true); // Auto-enter edit mode
        setError("Profile not found. Please complete your profile.");
      } else {
        setError("Failed to load profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      let res;
      if (faculty && faculty.id) {
        res = await updateFaculty(faculty.id, form);
      } else {
        res = await createFaculty(form);
      }
      setFaculty(res.data);
      setIsEditing(false);
      setSuccess(faculty && faculty.id ? "Profile updated successfully!" : "Profile created successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    }
  }


  if (!faculty && !isEditing) return <div className="faculty-layout-container">Faculty profile not found.</div>;
  return (
    <div className="faculty-layout-container">
      <div className="faculty-card" style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* HEADER */}
        <header className="faculty-header" style={{ padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className="faculty-title">My Profile</h1>
            <p className="faculty-subtitle">Manage your personal and academic details</p>
          </div>
          {!isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </header>

        {/* MESSAGES */}
        <div style={{ padding: "0 2rem" }}>
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div style={{
              padding: "1rem",
              backgroundColor: "#f0fdf4",
              color: "#16a34a",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              marginBottom: "1.5rem"
            }}>
              {success}
            </div>
          )}
        </div>

        {/* FORM */}
        <form className="faculty-form" onSubmit={handleSubmit}>

          <div className="form-section">
            <h3 className="form-section-title">Personal Information</h3>
            <div className="form-grid">

              <div className="form-group">
                <label className="form-label">Full Name</label>
                {isEditing ? (
                  <input
                    name="fullName"
                    className="form-input"
                    value={form.fullName || ""}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <div style={{ fontSize: "1.1rem", fontWeight: 500 }}>{faculty.fullName}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                {isEditing ? (
                  <input
                    name="phone"
                    className="form-input"
                    value={form.phone || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <div style={{ fontSize: "1.1rem" }}>{faculty.phone || "N/A"}</div>
                )}
              </div>

            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Academic Details</h3>
            <div className="form-grid">

              <div className="form-group">
                <label className="form-label">Employee ID</label>
                {isEditing && !faculty ? (
                  <input
                    name="employeeId"
                    className="form-input"
                    value={form.employeeId || ""}
                    onChange={handleChange}
                    required
                    placeholder="e.g. EMP001"
                  />
                ) : (
                  <>
                    <div style={{
                      backgroundColor: "#f1f5f9",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      color: "#64748b",
                      fontWeight: 500,
                      border: "1px solid #e2e8f0"
                    }}>
                      {faculty?.employeeId || "N/A"}
                    </div>
                    <span className="form-helper">Employee ID cannot be changed</span>
                  </>
                )}
              </div>

              <div className="form-group">
                {/* Spacer */}
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                {isEditing ? (
                  <select
                    name="department"
                    className="form-select"
                    value={form.department || ""}
                    onChange={handleChange}
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="MCA">MCA</option>
                    <option value="MMS">MMS</option>
                  </select>
                ) : (
                  <div style={{ fontSize: "1.1rem" }}>{faculty.department}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Designation</label>
                {isEditing ? (
                  <input
                    name="designation"
                    className="form-input"
                    value={form.designation || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <div style={{ fontSize: "1.1rem" }}>{faculty.designation}</div>
                )}
              </div>

            </div>
          </div>

          {/* ACTIONS */}
          {isEditing && (
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setForm(faculty); // Reset
                  setError(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
