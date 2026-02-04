import api from './api';

const login = async (email, password) => {
    const response = await api.post('/auth/login', {
        email,
        password,
    });
    if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const register = async (email, password, role) => {
    const response = await api.post('/auth/register', {
        email,
        password,
        role,
    });
    if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
    login,
    register,
    logout,
    getCurrentUser,
};

export default AuthService;
