import React, { useEffect, useState } from 'react';
import AuthService from '../services/auth.service';
import api from '../services/api';

const Dashboard = () => {
    const [user, setUser] = useState(undefined);
    const [data, setData] = useState(null);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);

        // Example API call to protected endpoint
        if (currentUser) {
            api.get('/auth/me')
                .then(response => {
                    setData(response.data);
                })
                .catch(error => {
                    console.error("Error fetching data", error);
                });
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            <h3>Welcome, {user.email}</h3>
            <p>Role: {user.role}</p>

            {data && (
                <div style={{ marginTop: '20px', background: '#f5f5f5', padding: '15px' }}>
                    <h4>Backend Data (Protected Endpoint):</h4>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}

            <button
                onClick={AuthService.logout}
                style={{ marginTop: '20px', padding: '10px', background: 'red', color: 'white', border: 'none' }}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
