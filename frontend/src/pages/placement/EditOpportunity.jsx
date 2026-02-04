import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOpportunityById, updateOpportunity } from "../../services/opportunityService";
import "./PlacementGlobal.css";

export default function EditOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  // TEMP: replace with auth later
  const postedBy = 1;

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    description: "",
    type: "INTERNSHIP",
    requiredSkills: "",
    requiredCgpa: "",
    eligibleDepartments: [],
    stipend: "",
    duration: "",
    location: "",
    workMode: "ONSITE",
    deadline: "",
    numberOfOpenings: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOpportunity() {
      try {
        const response = await getOpportunityById(id);
        const data = response.data;

        // Transform data for form if necessary (e.g. array to comma-sep string for eligibleDeps if needed, 
        // but backend expects string, frontend sends string. 
        // However, existing CreateOpportunity handled eligibleDepartments as array in state but string in payload. 
        // Let's check backend DTO. Backend sends string.
        // We need to parse eligibleDepartments string back to array for the multi-select.

        let deps = [];
        if (data.eligibleDepartments) {
          deps = data.eligibleDepartments.split(",");
        }

        setForm({
          ...data,
          eligibleDepartments: deps
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load opportunity details.");
      } finally {
        setLoading(false);
      }
    }
    fetchOpportunity();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleDepartmentChange(e) {
    const values = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm((prev) => ({
      ...prev,
      eligibleDepartments: values,
    }));
  }

  function handleToggleActive() {
    setForm((prev) => ({ ...prev, isActive: !prev.isActive }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!form.deadline) {
      setError("Please select a deadline.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...form,
        stipend: form.stipend ? Number(form.stipend) : 0,
        requiredCgpa: form.requiredCgpa ? Number(form.requiredCgpa) : 0,
        numberOfOpenings: form.numberOfOpenings ? Number(form.numberOfOpenings) : 0,
        eligibleDepartments: form.eligibleDepartments.join(","),
      };


      await updateOpportunity(id, payload, postedBy);

      navigate("/placement/opportunities");
    } catch (err) {
      console.error(err);
      setError("Failed to update opportunity. Check backend logs.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="placement-layout-container">Loading...</div>;

  return (
    <div className="placement-layout-container">
      <div className="placement-card">
        <header className="placement-header">
          <h1 className="placement-title">Edit Opportunity</h1>
          <p className="placement-subtitle">
            Update role details and requirements
          </p>
        </header>

        <form onSubmit={handleSubmit} className="placement-form">
          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* BASIC INFO */}
          <section className="form-section">
            <h3 className="form-section-title">Global details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input
                  className="form-input"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer Intern"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  className="form-input"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  required
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the role, responsibilities, and perks..."
                  required
                />
              </div>
            </div>
          </section>

          {/* DETAILS */}
          <section className="form-section">
            <h3 className="form-section-title">Logistics & Compensation</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Opportunity Type</label>
                <select
                  className="form-select"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="INTERNSHIP">Internship</option>
                  <option value="PLACEMENT">Placement</option>
                  <option value="INDUSTRIAL_TRAINING">Industrial Training</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Stipend / CTC (₹)</label>
                <input
                  className="form-input"
                  name="stipend"
                  type="number"
                  value={form.stipend}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  className="form-input"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 6 months"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  className="form-input"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Work Mode</label>
                <select
                  className="form-select"
                  name="workMode"
                  value={form.workMode}
                  onChange={handleChange}
                >
                  <option value="ONSITE">On-site</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  className="form-input"
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Openings</label>
                <input
                  className="form-input"
                  name="numberOfOpenings"
                  type="number"
                  value={form.numberOfOpenings}
                  onChange={handleChange}
                  placeholder="1"
                />
              </div>
            </div>
          </section>

          {/* ELIGIBILITY */}
          <section className="form-section">
            <h3 className="form-section-title">Eligibility Criteria</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Required Skills</label>
                <textarea
                  className="form-textarea"
                  name="requiredSkills"
                  value={form.requiredSkills}
                  onChange={handleChange}
                  placeholder="Java, React, SQL, etc."
                  style={{ minHeight: "80px" }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Minimum CGPA</label>
                <input
                  className="form-input"
                  name="requiredCgpa"
                  type="number"
                  step="0.01"
                  value={form.requiredCgpa}
                  onChange={handleChange}
                  placeholder="0.0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Eligible Departments</label>
                <select
                  className="form-select"
                  multiple
                  value={form.eligibleDepartments}
                  onChange={handleDepartmentChange}
                  style={{ height: "120px" }}
                >
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="MCA">MCA</option>
                  <option value="MMS">MMS</option>
                </select>
                <small className="form-helper">Hold Ctrl/Cmd to select multiple</small>
              </div>
            </div>
          </section>

          {/* ACTIVE STATUS */}
          <div className="form-section">
            <label className="toggle-switch">
              <input type="checkbox" checked={form.isActive} onChange={handleToggleActive} />
              <span className="slider"></span>
              <span className="form-label" style={{ marginBottom: 0 }}>Active (visible to students)</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/placement/opportunities")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
