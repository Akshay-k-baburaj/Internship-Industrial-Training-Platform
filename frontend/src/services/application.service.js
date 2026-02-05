import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:8080/api/v1/applications';

class ApplicationService {
    apply(studentId, opportunityId, facultyId) {
        const token = AuthService.getToken();
        // The backend expects query parameters: ?studentId=...&opportunityId=...
        return axios.post(`${API_URL}/apply`, null, {
            params: { studentId, opportunityId, facultyId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    getStudentApplications(studentId) {
        const token = AuthService.getToken();
        return axios.get(`${API_URL}/student/${studentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    getApplicationsForOpportunity(opportunityId) {
        const token = AuthService.getToken();
        return axios.get(`${API_URL}/opportunity/${opportunityId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    getPendingFacultyApprovals(facultyId) {
        const token = AuthService.getToken();
        return axios.get(`${API_URL}/pending-approvals`, {
            params: { facultyId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    approveByFaculty(applicationId, facultyId, approved, remarks = '') {
        const token = AuthService.getToken();
        return axios.put(`${API_URL}/${applicationId}/faculty-approval`, null, {
            params: { facultyId, approved, remarks },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
}

export default new ApplicationService();
