import api from "./api";

/**
 * Check eligibility of a student for a specific opportunity
 * Backend: GET /api/eligibility/check?studentId=&opportunityId=
 * Returns: true / false
 */
export const checkEligibility = async (studentId, opportunityId) => {
  const response = await api.get("/eligibility/check", {
    params: {
      studentId,
      opportunityId,
    },
  });

  return response.data; // boolean
};

/**
 * OPTIONAL (dashboard / summary use)
 * Get overall eligibility info for a student
 * Backend: GET /api/eligibility/student/{studentId}
 */
export const getStudentEligibility = async (studentId) => {
  const response = await api.get(`/eligibility/student/${studentId}`);
  return response.data;
};
