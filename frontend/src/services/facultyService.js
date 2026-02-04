import api from "./api";

/* GET /api/faculty/{id} */
export const getFacultyById = (id) => api.get(`/faculty/${id}`);

/* GET /api/faculty/user/{userId} */
export const getFacultyByUserId = (userId) => api.get(`/faculty/user/${userId}`);

/* PUT /api/faculty/{id} */
export const updateFaculty = (id, data) => api.put(`/faculty/${id}`, data);

/* POST /api/faculty */
export const createFaculty = (data) => api.post(`/faculty`, data);

/* GET /api/faculty/{id}/stats */
export const getFacultyDashboardStats = (id) =>
    api.get(`/faculty/${id}/stats`);

/* GET /api/faculty/department/{department} */
export const getFacultyByDepartment = (department) =>
    api.get(`/faculty/department/${department}`);
