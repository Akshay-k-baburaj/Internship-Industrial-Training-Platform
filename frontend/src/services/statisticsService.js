import api from "./api";

/* GET /api/statistics/{placementCellUserId} */
export const getPlacementStatistics = (placementCellUserId) =>
  api.get(`/statistics/${placementCellUserId}`);
