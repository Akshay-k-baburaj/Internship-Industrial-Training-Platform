import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:8080/api/statistics';

const authHeader = () => {
    const user = AuthService.getCurrentUser();
    if (user && user.access_token) {
        return { Authorization: 'Bearer ' + user.access_token };
    }
    return {};
};

const getPlacementCellStats = (placementCellUserId) => {
    return axios.get(`${API_URL}/${placementCellUserId}`, { headers: authHeader() });
};

const StatisticsService = {
    getPlacementCellStats,
};

export default StatisticsService;
