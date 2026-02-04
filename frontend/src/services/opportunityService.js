import api from "./api";

/* GET /api/opportunities */
export const getAllOpportunities = () =>
  api.get("/opportunities");

/* GET /api/opportunities/{id} */
export const getOpportunityById = (id) =>
  api.get(`/opportunities/${id}`);

/* POST /api/opportunities?postedById= */
export const createOpportunity = (data, postedById) =>
  api.post(`/opportunities?postedById=${postedById}`, data);

/* PUT /api/opportunities/{id}?postedById= */
export const updateOpportunity = (id, data, postedById) =>
  api.put(`/opportunities/${id}?postedById=${postedById}`, data);

/* DELETE /api/opportunities/{id}?postedById= */
export const deleteOpportunity = (id, postedById) =>
  api.delete(`/opportunities/${id}?postedById=${postedById}`);

/* GET /api/opportunities/placementcell/{userId} */
export const getOpportunitiesByPlacementCell = (userId) =>
  api.get(`/opportunities/placementcell/${userId}`);
