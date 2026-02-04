import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationById, facultyApproval } from "../../services/applicationService";
import { getFacultyByUserId } from "../../services/facultyService";
import { MOCK_USER_ID } from "../../utils/mockAuth";
import "./FacultyGlobal.css";

export default function ReviewApplication() {
  const { applicationId } = useParams();

  const navigate = useNavigate();

  // TEMP: Auth context replacement
  const userId = MOCK_USER_ID;

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [facultyId, setFacultyId] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadData();
  }, [applicationId]);

  async function loadData() {
    try {
      setLoading(true);
      // 1. Get Faculty ID (needed for approval)
      try {
        const facultyRes = await getFacultyByUserId(userId);
        setFacultyId(facultyRes.data.id);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setFacultyId(null); // Explicitly null
          // We don't error block the view, but we block the action
        } else {
          throw err;
        }
      }

      // 2. Get Application Details
      const appRes = await getApplicationById(applicationId);
      setApplication(appRes.data);
      if (appRes.data.remarks) {
        setRemarks(appRes.data.remarks);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load application details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDecision(approved) {
    if (!facultyId) {
      setError("Please create your Faculty Profile first to perform this action.");
      // Optional: redirect logic or just show error
      return;
    }
    setError(null);
    try {
      await facultyApproval(application.id, {
        facultyId: facultyId,
        approved: approved,
        remarks: remarks
      });
      setSuccess(approved ? "Application Approved Successfully" : "Application Rejected");

      // Refresh data to show updated status
      const appRes = await getApplicationById(applicationId);
      setApplication(appRes.data);

      // Optional: Navigate back after delay
      setTimeout(() => navigate("/faculty/pending-approvals"), 1500);

    } catch (err) {
      console.error(err);
      setError("Failed to submit decision. Please try again.");
    }
  }

  if (loading) return <div className="faculty-layout-container">Loading Application...</div>;
  if (!application) return <div className="faculty-layout-container error-message">Application not found.</div>;

  const isPending = application.facultyApprovalStatus === "PENDING";

  return (
    <div className="faculty-layout-container">
      <div className="faculty-card">
        <header className="faculty-header" style={{ padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className="faculty-title">Review Application</h1>
            <p className="faculty-subtitle">
              Review details for <strong>{application.studentName}</strong>
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate("/faculty/pending-approvals")}>
            Back to List
          </button>
        </header>

        <div style={{ padding: "0 2rem 2rem 2rem" }}>
          {error && <div className="error-message" style={{ marginBottom: "1rem" }}>{error}</div>}
          {success && <div style={{
            padding: "1rem", backgroundColor: "#f0fdf4", color: "#16a34a",
            border: "1px solid #bbf7d0", borderRadius: "8px", marginBottom: "1rem"
          }}>{success}</div>}

          <div className="form-grid">
            {/* Student Details */}
            <div className="form-section" style={{ gridColumn: "1 / -1" }}>
              <h3 className="form-section-title">Student Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="form-input" style={{ background: "#f1f5f9" }}>{application.studentName}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <div className="form-input" style={{ background: "#f1f5f9" }}>{application.studentRollNumber}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <div className="form-input" style={{ background: "#f1f5f9" }}>{application.studentDepartment}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">CGPA</label>
                  <div className="form-input" style={{ background: "#f1f5f9" }}>{application.studentCgpa}</div>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Resume</label>
                  {application.studentResumeUrl ? (
                    <a href={application.studentResumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ textDecoration: "none" }}>
                      View Resume (Opens in new tab)
                    </a>
                  ) : (
                    <div className="text-gray-500">No resume uploaded</div>
                  )}
                </div>
              </div>
            </div>

            {/* Opportunity Details */}
            <div className="form-section" style={{ gridColumn: "1 / -1" }}>
              <h3 className="form-section-title">Opportunity Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <div className="form-input" style={{ background: "#f1f5f9" }}>{application.companyName}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <div className="form-input" style={{ background: "#f1f5f9" }}>{application.opportunityTitle}</div>
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="form-section" style={{ gridColumn: "1 / -1", background: "#f8fafc", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <h3 className="form-section-title" style={{ border: "none", padding: 0 }}>Faculty Decision</h3>

              <div className="form-group full-width" style={{ marginTop: "1rem" }}>
                <label className="form-label">Remarks (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Add comments regarding your decision..."
                  value={remarks || ""}
                  onChange={(e) => setRemarks(e.target.value)}
                  disabled={!isPending}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                {isPending ? (
                  <>
                    <button className="btn btn-primary" style={{ backgroundColor: "#16a34a" }} onClick={() => handleDecision(true)}>
                      Approve Application
                    </button>
                    <button className="btn btn-primary" style={{ backgroundColor: "#dc2626" }} onClick={() => handleDecision(false)}>
                      Reject Application
                    </button>
                  </>
                ) : (
                  <div style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    fontWeight: 600,
                    backgroundColor: application.facultyApprovalStatus === 'APPROVED' ? '#dcfce7' : '#fee2e2',
                    color: application.facultyApprovalStatus === 'APPROVED' ? '#166534' : '#991b1b',
                    border: `1px solid ${application.facultyApprovalStatus === 'APPROVED' ? '#bbf7d0' : '#fecaca'}`
                  }}>
                    Status: {application.facultyApprovalStatus}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
