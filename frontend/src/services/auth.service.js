import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth/';

const register = (email, password, role) => {
    return axios
        .post(API_URL + 'register', {
            email,
            password,
            role,
        })
        .then((response) => {
            if (response.data.access_token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

const login = (email, password) => {
    return axios
        .post(API_URL + 'login', {
            email,
            password,
        })
        .then((response) => {
            if (response.data.access_token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const getToken = () => {
    const user = getCurrentUser();
    return user?.access_token || null;
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
    getToken,
};

export default AuthService;
