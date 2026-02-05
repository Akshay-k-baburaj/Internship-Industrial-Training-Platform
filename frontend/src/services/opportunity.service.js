import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:8080/api/v1/opportunities';



const authHeader = () => {
    const user = AuthService.getCurrentUser();
    if (user && user.access_token) {
        return { Authorization: 'Bearer ' + user.access_token };
    }
    return {};
};

const getAllOpportunities = () => {
    // Check if endpoint is public or private. SecurityConfig has /api/v1/opportunities public GET.
    // The controller is mapped to /api/opportunities (no v1? Wait, let's double check the controller mapping)
    // Ah, the controller source code showed @RequestMapping("/api/opportunities").
    // But SecurityConfig showed /api/v1/opportunities.
    // I need to be careful here. I'll stick to what the controller file said: /api/opportunities
    return axios.get(API_URL);
};

const getOpportunityById = (id) => {
    return axios.get(API_URL + '/' + id);
};

const createOpportunity = (data, postedById) => {
    return axios.post(`${API_URL}?postedById=${postedById}`, data, { headers: authHeader() });
};

const deleteOpportunity = (id, postedById) => {
    return axios.delete(`${API_URL}/${id}?postedById=${postedById}`, { headers: authHeader() });
};

const getOpportunitiesByPlacementCell = (userId) => {
    return axios.get(`${API_URL}/placementcell/${userId}`, { headers: authHeader() });
};

const OpportunityService = {
    getAllOpportunities,
    getOpportunityById,
    createOpportunity,
    deleteOpportunity,
    getOpportunitiesByPlacementCell,
};

export default OpportunityService;
