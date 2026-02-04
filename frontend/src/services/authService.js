import api from "./api";

/* POST /api/auth/register */
export const registerUser = (data) =>
  api.post("/auth/register", data);

/* GET /api/auth/user/{id} */
export const getUserById = (id) =>
  api.get(`/auth/user/${id}`);
