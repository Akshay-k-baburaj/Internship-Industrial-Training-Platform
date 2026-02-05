import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/ui/Button';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';

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

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        rollNumber: '',
        department: '',
        semester: 1,
        cgpa: '',
        phone: '',
        skills: '',
        githubUrl: '',
        linkedinUrl: '',
        portfolioUrl: ''
    });

    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        const fetchProfile = (userId) => {
            setLoading(true);
            UserService.getStudentProfile(userId)
                .then(response => {
                    setProfile(response.data);
                    setFormData({
                        fullName: response.data.fullName || currentUser.name || '',
                        rollNumber: response.data.rollNumber || '',
                        department: response.data.department || '',
                        semester: response.data.semester || 1,
                        cgpa: response.data.cgpa || '',
                        phone: response.data.phone || '',
                        skills: response.data.skills || '',
                        githubUrl: response.data.githubUrl || '',
                        linkedinUrl: response.data.linkedinUrl || '',
                        portfolioUrl: response.data.portfolioUrl || ''
                    });
                    setLoading(false);
                    setError('');
                })
                .catch(err => {
                    console.error("Error fetching profile", err);
                    if (err.response && err.response.status === 404) {
                        setError('Profile not found');
                        // Initialize with available user info
                        setFormData(prev => ({ ...prev, fullName: currentUser.name || '' }));
                    } else {
                        setError('Failed to load profile.');
                    }
                    setLoading(false);
                });
        };

        if (currentUser && currentUser.id) {
            fetchProfile(currentUser.id);
        }
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

        const payload = {
            ...formData,
            userId: currentUser.id,
            cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null
        };

        const apiCall = profile
            ? UserService.updateStudentProfile(profile.id, payload)
            : UserService.createStudentProfile(payload);

        apiCall
            .then(response => {
                alert('Profile saved successfully!');
                setProfile(response.data);
                setIsEditing(false);
                setError('');
            })
            .catch(err => {
                console.error("Error saving profile", err);
                alert('Failed to save profile. Please check your inputs.');
            });
    };

    if (loading) return <PageWrapper><Container>Loading profile...</Container></PageWrapper>;

    if (isEditing || error === 'Profile not found') {
        return (
            <PageWrapper>
                <Container>
                    <Title>{profile ? 'Edit Profile' : 'Create Profile'}</Title>
                    <form onSubmit={handleSubmit}>
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
                            <label>Roll Number</label>
                            <input
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <label>Department</label>
                            <input
                                name="department"
                                placeholder="e.g. Computer Science (CSE)"
                                value={formData.department}
                                onChange={handleInputChange}
                                required
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <label>CGPA</label>
                            <input
                                name="cgpa"
                                type="number"
                                step="0.01"
                                min="0"
                                max="10"
                                value={formData.cgpa}
                                onChange={handleInputChange}
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <label>Skills (Comma separated)</label>
                            <input
                                name="skills"
                                placeholder="Java, React, SQL"
                                value={formData.skills}
                                onChange={handleInputChange}
                            />
                        </FieldGroup>

                        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#1f2937' }}>Social Links</h3>
                            <FieldGroup>
                                <label>GitHub URL</label>
                                <input
                                    name="githubUrl"
                                    placeholder="https://github.com/username"
                                    value={formData.githubUrl}
                                    onChange={handleInputChange}
                                />
                            </FieldGroup>
                            <FieldGroup>
                                <label>LinkedIn URL</label>
                                <input
                                    name="linkedinUrl"
                                    placeholder="https://linkedin.com/in/username"
                                    value={formData.linkedinUrl}
                                    onChange={handleInputChange}
                                />
                            </FieldGroup>
                            <FieldGroup>
                                <label>Portfolio URL</label>
                                <input
                                    name="portfolioUrl"
                                    placeholder="https://yourportfolio.com"
                                    value={formData.portfolioUrl}
                                    onChange={handleInputChange}
                                />
                            </FieldGroup>
                        </div>

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
                    <Title>My Profile</Title>
                    <div>
                        <Button variant="primary" onClick={() => setIsEditing(true)} style={{ marginRight: '1rem' }}>
                            Edit Profile
                        </Button>
                        <Button variant="outline" onClick={() => window.history.back()}>Back</Button>
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <FieldGroup>
                        <label>Full Name</label>
                        <div className="value">{profile?.fullName}</div>
                    </FieldGroup>

                    <FieldGroup>
                        <label>Roll Number</label>
                        <div className="value">{profile?.rollNumber}</div>
                    </FieldGroup>

                    <FieldGroup>
                        <label>Department</label>
                        <div className="value">{profile?.department}</div>
                    </FieldGroup>

                    <FieldGroup>
                        <label>CGPA</label>
                        <div className="value">{profile?.cgpa || 'N/A'}</div>
                    </FieldGroup>

                    <FieldGroup>
                        <label>Skills</label>
                        <div className="value">{profile?.skills || 'No skills listed'}</div>
                    </FieldGroup>

                    {(profile?.githubUrl || profile?.linkedinUrl || profile?.portfolioUrl) && (
                        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem', color: '#4b5563' }}>Social Links</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {profile.githubUrl && (
                                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-teal)', textDecoration: 'none' }}>
                                        GitHub Profile
                                    </a>
                                )}
                                {profile.linkedinUrl && (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-teal)', textDecoration: 'none' }}>
                                        LinkedIn Profile
                                    </a>
                                )}
                                {profile.portfolioUrl && (
                                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-teal)', textDecoration: 'none' }}>
                                        Portfolio Website
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </PageWrapper>
    );
};

export default Profile;
