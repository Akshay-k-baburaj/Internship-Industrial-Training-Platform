import api from "./api";

/* POST /api/students */
export const createStudent = (data) =>
  api.post("/students", data);

/* GET /api/students */
export const getAllStudents = () => api.get("/students");

/* GET /api/students/{id} */
export const getStudentById = (id) =>
  api.get(`/students/${id}`);

/* PUT /api/students/{id} */
export const updateStudent = (id, data) =>
  api.put(`/students/${id}`, data);

/* GET /api/students/user/{userId} */
export const getStudentByUserId = (userId) =>
  api.get(`/students/user/${userId}`);

/* GET /api/students/unplaced?department={dept} */
export const getUnplacedStudents = (department) => {
  const url = department ? `/students/unplaced?department=${department}` : "/students/unplaced";
  return api.get(url);
}

/* GET /api/students/roll/{rollNumber} */
export const getStudentByRoll = (rollNumber) =>
  api.get(`/students/roll/${rollNumber}`);

/* GET /api/students/department/{department} */
export const getStudentsByDepartment = (department) =>
  api.get(`/students/department/${department}`);
