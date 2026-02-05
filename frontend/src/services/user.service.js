import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:8080/api/v1/students/';

// Helper to get auth header
const authHeader = () => {
    const user = AuthService.getCurrentUser();
    if (user && user.access_token) {
        return { Authorization: 'Bearer ' + user.access_token };
    } else {
        return {};
    }
};

const getStudentProfile = (userId) => {
    return axios.get(API_URL + 'user/' + userId, { headers: authHeader() });
};

const createStudentProfile = (data) => {
    return axios.post(API_URL, data, { headers: authHeader() });
};

const updateStudentProfile = (id, data) => {
    return axios.put(API_URL + id, data, { headers: authHeader() });
};

const UserService = {
    getStudentProfile,
    createStudentProfile,
    updateStudentProfile,
};

export default UserService;
