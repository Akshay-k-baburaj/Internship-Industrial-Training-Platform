import api from "./api";

/* ================================
   APPLICATION APIs
================================ */

/**
 * POST /api/applications/apply
 * Swagger:
 * ?studentId=1&opportunityId=2
 */
export const applyForOpportunity = async (studentId, opportunityId) => {
  return api.post("/applications/apply", null, {
    params: {
      studentId: Number(studentId),
      opportunityId: Number(opportunityId),
    },
  });
};

/* PUT /api/applications/{applicationId}/status */
export const updateApplicationStatus = (applicationId, status) =>
  api.put(`/applications/${applicationId}/status`, { status });

/* PUT /api/applications/{applicationId}/faculty-approval */
export const facultyApproval = (applicationId, data) =>
  api.put(`/applications/${applicationId}/faculty-approval`, null, { params: data });

/* GET /api/applications/student/{studentId} */
export const getApplicationsByStudent = (studentId) =>
  api.get(`/applications/student/${studentId}`);

/* GET /api/applications */
export const getAllApplications = () => api.get("/applications");

/* GET /api/applications/opportunity/{opportunityId} */
export const getApplicationsByOpportunity = (opportunityId) =>
  api.get(`/applications/opportunity/${opportunityId}`);

/* GET /api/applications/pending-approvals */
export const getPendingApprovals = () =>
  api.get("/applications/pending-approvals");

/* GET /api/applications/department/{department}/pending */
export const getPendingApplicationsByDepartment = (department) =>
  api.get(`/applications/department/${department}/pending`);

/* GET /api/applications/{id} */
export const getApplicationById = (id) => api.get(`/applications/${id}`);

/* GET /api/applications/verification-list */
export const getVerificationList = () => api.get("/applications/verification-list");

/* GET /api/applications/reviewed-students?department={dept} */
export const getReviewedStudents = (department) =>
  api.get(`/applications/reviewed-students?department=${department}`);

/* PUT /api/applications/{id}/verify-placement */
export const verifyPlacement = (applicationId) =>
  api.put(`/applications/${applicationId}/verify-placement`);
