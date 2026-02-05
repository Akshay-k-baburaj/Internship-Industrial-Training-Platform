import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/ui/Button';
import AuthService from '../services/auth.service';
import FacultyService from '../services/faculty.service';

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 8rem 2rem;
  background-color: var(--bg-primary);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

const Title = styled.h1`
  font-family: 'Fira Code', monospace;
  margin-bottom: 2rem;
  color: var(--text-primary);
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const FieldGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #4b5563;
    font-size: 0.9rem;
  }
  
  .value {
    padding: 0.75rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #111827;
    font-family: 'Inter', sans-serif;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    
    &:focus {
      outline: none;
      border-color: var(--accent-teal);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const FacultyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    department: '',
    designation: '',
    phone: ''
  });

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if (!currentUser?.id) return;
    setLoading(true);
    FacultyService.getFacultyByUserId(currentUser.id)
      .then(res => {
        setProfile(res.data);
        setFormData({
          employeeId: res.data.employeeId || '',
          fullName: res.data.fullName || '',
          department: res.data.department || '',
          designation: res.data.designation || '',
          phone: res.data.phone || ''
        });
        setError('');
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          setError('Profile not found');
        } else {
          setError('Failed to load profile.');
        }
      })
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    const apiCall = profile
      ? FacultyService.updateFaculty(profile.id, formData, currentUser.id)
      : FacultyService.createFaculty(formData, currentUser.id);

    apiCall
      .then(response => {
        setProfile(response.data);
        setIsEditing(false);
        setError('');
        alert('Profile saved successfully!');
      })
      .catch(err => {
        console.error("Error saving faculty profile", err);
        alert('Failed to save profile. Please check your inputs.');
      });
  };

  if (loading) return <PageWrapper><Container>Loading profile...</Container></PageWrapper>;

  if (isEditing || error === 'Profile not found') {
    return (
      <PageWrapper>
        <Container>
          <Title>{profile ? 'Edit Faculty Profile' : 'Create Faculty Profile'}</Title>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <label>Employee ID</label>
              <input
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                required
              />
            </FieldGroup>
            <FieldGroup>
              <label>Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </FieldGroup>
            <FieldGroup>
              <label>Department</label>
              <input
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              />
            </FieldGroup>
            <FieldGroup>
              <label>Designation</label>
              <input
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
              />
            </FieldGroup>
            <FieldGroup>
              <label>Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </FieldGroup>

            <ButtonGroup>
              <Button type="submit" variant="primary">Save Profile</Button>
              {profile && (
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
            </ButtonGroup>
          </form>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title>Faculty Profile</Title>
          <div>
            <Button variant="primary" onClick={() => setIsEditing(true)} style={{ marginRight: '1rem' }}>
              Edit Profile
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>Back</Button>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <FieldGroup>
            <label>Employee ID</label>
            <div className="value">{profile?.employeeId}</div>
          </FieldGroup>
          <FieldGroup>
            <label>Full Name</label>
            <div className="value">{profile?.fullName}</div>
          </FieldGroup>
          <FieldGroup>
            <label>Department</label>
            <div className="value">{profile?.department}</div>
          </FieldGroup>
          <FieldGroup>
            <label>Designation</label>
            <div className="value">{profile?.designation || 'N/A'}</div>
          </FieldGroup>
          <FieldGroup>
            <label>Phone</label>
            <div className="value">{profile?.phone || 'N/A'}</div>
          </FieldGroup>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default FacultyProfile;
