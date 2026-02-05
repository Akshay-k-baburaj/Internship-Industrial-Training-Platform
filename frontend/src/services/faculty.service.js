import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:8080/api/v1/faculty';

const authHeader = () => {
    const user = AuthService.getCurrentUser();
    if (user && user.access_token) {
        return { Authorization: 'Bearer ' + user.access_token };
    }
    return {};
};

const getFacultyByUserId = (userId) => {
    return axios.get(`${API_URL}/user/${userId}`, { headers: authHeader() });
};

const getFacultyByDepartment = (department) => {
    return axios.get(`${API_URL}/department/${encodeURIComponent(department)}`, { headers: authHeader() });
};

const createFaculty = (data, userId) => {
    return axios.post(`${API_URL}?userId=${userId}`, data, { headers: authHeader() });
};

const updateFaculty = (id, data, userId) => {
    return axios.put(`${API_URL}/${id}?userId=${userId}`, data, { headers: authHeader() });
};

const FacultyService = {
    getFacultyByUserId,
    getFacultyByDepartment,
    createFaculty,
    updateFaculty,
};

export default FacultyService;
