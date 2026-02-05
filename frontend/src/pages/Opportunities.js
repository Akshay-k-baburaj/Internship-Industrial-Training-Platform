import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/ui/Button';
import OpportunityService from '../services/opportunity.service';
import UserService from '../services/user.service';
import ApplicationService from '../services/application.service';
import AuthService from '../services/auth.service';

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 8rem 2rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: 'Fira Code', monospace;
  margin-bottom: 2rem;
  font-size: 2rem;
  
  span {
    color: var(--accent-teal);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const OpportunityCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
    font-size: 1.25rem;
  }
  
  .company {
    color: var(--accent-teal);
    font-weight: 600;
    margin-bottom: 1rem;
    display: block;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .details {
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    
    div {
      margin-bottom: 0.25rem;
    }
  }
`;

const NoData = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  color: #666;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  margin: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  h2 {
    color: #1f2937;
    margin-bottom: 0.5rem;
    font-family: 'Fira Code', monospace;
  }


  .company-badge {
    background-color: var(--accent-teal);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 1.5rem;
  }

  .section {
    margin-bottom: 1.5rem;
    
    h4 {
      color: #4b5563;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 0.25rem;
    }
    
    p {
      color: #111827;
      line-height: 1.6;
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .full {
    grid-column: 1 / -1;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    color: #111827;
    background: #f9fafb;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      border-color: var(--accent-teal);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
      background: #ffffff;
    }
  }

  textarea {
    resize: vertical;
  }

  .grid-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    div {
      background: #f9fafb;
      padding: 0.75rem;
      border-radius: 6px;
      
      span {
        display: block;
        font-size: 0.8rem;
        color: #6b7280;
      }
      strong {
        color: #111827;
      }
    }
  }

  .form-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0.75rem 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .form-card label {
    font-size: 0.8rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .form-card input,
  .form-card select,
  .form-card textarea {
    border: none;
    background: transparent;
    padding: 0;
    border-radius: 0;
    font-size: 0.95rem;
  }

  .form-card textarea {
    min-height: 88px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #111827;
  }
`;

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyName: '',
    type: 'INTERNSHIP',
    requiredSkills: '',
    requiredCgpa: '',
    eligibleDepartments: '',
    stipend: '',
    duration: '',
    location: '',
    workMode: 'ONSITE',
    deadline: '',
    numberOfOpenings: 1,
  });

  // New State for Application Logic
  const [studentProfile, setStudentProfile] = useState(null);
  const [myApplications, setMyApplications] = useState([]);
  const [applying, setApplying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Opportunities
        const oppResponse = await OpportunityService.getAllOpportunities();
        setOpportunities(oppResponse.data);

        // 2. Fetch Student Profile (to get studentId and CGPA)
        if (currentUser && currentUser.role === 'STUDENT') {
          try {
            const profileRes = await UserService.getStudentProfile(currentUser.id);
            setStudentProfile(profileRes.data);

            // 3. Fetch My Applications (to check what I've applied to)
            // Note: application service relies on studentId, which is in profileRes.data.id
            if (profileRes.data && profileRes.data.id) {
              const appsRes = await ApplicationService.getStudentApplications(profileRes.data.id);
              setMyApplications(appsRes.data);
            }
          } catch (e) {
            console.warn("Could not fetch student profile or applications", e);
          }
        }
      } catch (err) {
        console.error("Error fetching data", err);
        setError('Failed to load opportunities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Faculty fetching logic removed due to security restrictions

  // Check if current student has applied to an opportunity
  const hasApplied = (oppId) => {
    return myApplications.some(app => app.opportunityId === oppId);
  };

  const handleApply = async () => {
    if (!selectedOpp || !studentProfile) return;

    // CGPA Check
    if (selectedOpp.requiredCgpa && studentProfile.cgpa && parseFloat(studentProfile.cgpa) < parseFloat(selectedOpp.requiredCgpa)) {
      alert(`Your CGPA (${studentProfile.cgpa}) is lower than the required CGPA (${selectedOpp.requiredCgpa}).`);
      return;
    }

    setApplying(true);
    try {
      // Pass null for facultyId since we can't select it
      await ApplicationService.apply(studentProfile.id, selectedOpp.id, null);
      alert('Application Submitted Successfully!');

      // Refresh applications list
      const appsRes = await ApplicationService.getStudentApplications(studentProfile.id);
      setMyApplications(appsRes.data);

      closeModal();
    } catch (err) {
      console.error("Application failed", err);
      alert(err.response?.data?.message || 'Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const openModal = (opp) => {
    setSelectedOpp(opp);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedOpp(null);
    document.body.style.overflow = 'unset';
  };

  const handleDelete = async () => {
    if (!selectedOpp || !currentUser || currentUser.role !== 'PLACEMENT_CELL') return;
    const confirmed = window.confirm('Delete this opportunity? This cannot be undone.');
    if (!confirmed) return;

    setDeleting(true);
    try {
      await OpportunityService.deleteOpportunity(selectedOpp.id, currentUser.id);
      const oppResponse = await OpportunityService.getAllOpportunities();
      setOpportunities(oppResponse.data);
      closeModal();
    } catch (err) {
      console.error("Delete opportunity failed", err);
      alert(err.response?.data?.message || 'Failed to delete opportunity.');
    } finally {
      setDeleting(false);
    }
  };

  const openCreateModal = () => {
    setCreateError('');
    setCreateOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCreateModal = () => {
    setCreateOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'PLACEMENT_CELL') return;

    setCreating(true);
    setCreateError('');
    try {
      const payload = {
        ...formData,
        requiredCgpa: formData.requiredCgpa === '' ? null : formData.requiredCgpa,
        numberOfOpenings: formData.numberOfOpenings === '' ? 1 : Number(formData.numberOfOpenings),
      };
      await OpportunityService.createOpportunity(payload, currentUser.id);
      const oppResponse = await OpportunityService.getAllOpportunities();
      setOpportunities(oppResponse.data);
      closeCreateModal();
      setFormData({
        title: '',
        description: '',
        companyName: '',
        type: 'INTERNSHIP',
        requiredSkills: '',
        requiredCgpa: '',
        eligibleDepartments: '',
        stipend: '',
        duration: '',
        location: '',
        workMode: 'ONSITE',
        deadline: '',
        numberOfOpenings: 1,
      });
    } catch (err) {
      console.error("Create opportunity failed", err);
      setCreateError(err.response?.data?.message || 'Failed to create opportunity. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <PageWrapper><Container>Loading opportunities...</Container></PageWrapper>;

  return (
    <PageWrapper>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Title>Active <span>Opportunities</span></Title>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {currentUser && currentUser.role === 'PLACEMENT_CELL' && (
              <Button variant="primary" onClick={openCreateModal}>Post Opportunity</Button>
            )}
            <Button variant="outline" onClick={() => window.history.back()}>Back</Button>
          </div>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        {opportunities.length === 0 && !error ? (
          <NoData>
            <h3>No Opportunities Found</h3>
            <p>Currently there are no active openings. Please check back later.</p>
          </NoData>
        ) : (
          <Grid>
            {opportunities.map(opp => (
              <OpportunityCard key={opp.id}>
                <span className="company">{opp.companyName}</span>
                <h3>{opp.title}</h3>
                <div className="details">
                  <div><strong>Type:</strong> {opp.type}</div>
                  <div><strong>Stipend:</strong> ₹{opp.stipend}</div>
                  <div><strong>Location:</strong> {opp.location}</div>
                  <div><strong>Deadline:</strong> {opp.deadline}</div>
                </div>
                <Button
                  variant="primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => openModal(opp)}
                >
                  View Details
                </Button>
              </OpportunityCard>
            ))}
          </Grid>
        )}

        {selectedOpp && (
          <ModalOverlay onClick={closeModal}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <CloseButton onClick={closeModal}>&times;</CloseButton>

              <span className="company-badge">{selectedOpp.companyName}</span>
              <h2>{selectedOpp.title}</h2>

              <div className="grid-info">
                <div>
                  <span>Type</span>
                  <strong>{selectedOpp.type}</strong>
                </div>
                <div>
                  <span>Stipend</span>
                  <strong>₹{selectedOpp.stipend}</strong>
                </div>
                <div>
                  <span>Location</span>
                  <strong>{selectedOpp.location}</strong>
                </div>
                <div>
                  <span>Deadline</span>
                  <strong>{selectedOpp.deadline}</strong>
                </div>
                <div>
                  <span>Duration</span>
                  <strong>{selectedOpp.duration || 'N/A'}</strong>
                </div>
                <div>
                  <span>Openings</span>
                  <strong>{selectedOpp.numberOfOpenings || 1}</strong>
                </div>
              </div>

              <div className="section">
                <h4>Description</h4>
                <p>{selectedOpp.description}</p>
              </div>

              <div className="section">
                <h4>Required Skills</h4>
                <p>{selectedOpp.requiredSkills}</p>
              </div>

              <div className="section">
                <h4>Eligibility</h4>
                <p>{selectedOpp.eligibleDepartments || 'All Departments'}</p>
                {selectedOpp.requiredCgpa && <p>Min CGPA: {selectedOpp.requiredCgpa}</p>}
              </div>

              {currentUser?.role === 'STUDENT' && (
                <div className="section">
                  {/* Faculty selection removed due to security restrictions */}
                  <p style={{ fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic' }}>
                    Note: A faculty mentor will be assigned to you after applying.
                  </p>
                </div>
              )}

              {currentUser?.role === 'STUDENT' && (
                hasApplied(selectedOpp.id) ? (
                  <Button
                    variant="outline"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', cursor: 'not-allowed', opacity: 0.7 }}
                    disabled
                  >
                    Already Applied
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                    onClick={handleApply}
                    disabled={applying}
                  >
                    {applying ? 'Applying...' : 'Apply Now'}
                  </Button>
                )
              )}

              {(currentUser?.role === 'PLACEMENT_CELL' || currentUser?.role === 'ADMIN') && (
                <Button
                  variant="outline"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Opportunity'}
                </Button>
              )}
            </ModalContent>
          </ModalOverlay>
        )}

        {createOpen && (
          <ModalOverlay onClick={closeCreateModal}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <CloseButton onClick={closeCreateModal}>&times;</CloseButton>
              <span className="company-badge">New Opportunity</span>
              <h2>Post New Opportunity</h2>
              {createError && <div style={{ color: 'red', marginBottom: '1rem' }}>{createError}</div>}
              <form onSubmit={handleCreateSubmit}>
                <div className="section">
                  <h4>Basic Info</h4>
                  <div className="form-grid">
                    <div className="form-card">
                      <label>Title</label>
                      <input name="title" placeholder="Software Engineer Intern" value={formData.title} onChange={handleCreateChange} required />
                    </div>
                    <div className="form-card">
                      <label>Company</label>
                      <input name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleCreateChange} required />
                    </div>
                    <div className="form-card">
                      <label>Location</label>
                      <input name="location" placeholder="Bangalore" value={formData.location} onChange={handleCreateChange} required />
                    </div>
                    <div className="form-card">
                      <label>Deadline</label>
                      <input name="deadline" type="date" value={formData.deadline} onChange={handleCreateChange} required />
                    </div>
                    <div className="form-card">
                      <label>Stipend</label>
                      <input name="stipend" placeholder="₹50000" value={formData.stipend} onChange={handleCreateChange} />
                    </div>
                    <div className="form-card">
                      <label>Duration</label>
                      <input name="duration" placeholder="6 months" value={formData.duration} onChange={handleCreateChange} />
                    </div>
                  </div>
                </div>

                <div className="section">
                  <h4>Details</h4>
                  <div className="form-grid">
                    <div className="form-card">
                      <label>Type</label>
                      <select name="type" value={formData.type} onChange={handleCreateChange}>
                        <option value="INTERNSHIP">INTERNSHIP</option>
                        <option value="FULL_TIME">FULL_TIME</option>
                        <option value="PART_TIME">PART_TIME</option>
                        <option value="TRAINING">TRAINING</option>
                      </select>
                    </div>
                    <div className="form-card">
                      <label>Work Mode</label>
                      <select name="workMode" value={formData.workMode} onChange={handleCreateChange}>
                        <option value="ONSITE">ONSITE</option>
                        <option value="REMOTE">REMOTE</option>
                        <option value="HYBRID">HYBRID</option>
                      </select>
                    </div>
                    <div className="form-card">
                      <label>Min CGPA</label>
                      <input name="requiredCgpa" placeholder="7" value={formData.requiredCgpa} onChange={handleCreateChange} />
                    </div>
                    <div className="form-card">
                      <label>Openings</label>
                      <input name="numberOfOpenings" type="number" min="1" placeholder="5" value={formData.numberOfOpenings} onChange={handleCreateChange} />
                    </div>
                  </div>
                </div>

                <div className="section">
                  <h4>Description</h4>
                  <div className="form-card full">
                    <label>Role Description</label>
                    <textarea name="description" rows="4" placeholder="Role description" value={formData.description} onChange={handleCreateChange} />
                  </div>
                </div>

                <div className="section">
                  <h4>Requirements</h4>
                  <div className="form-card full">
                    <label>Required Skills</label>
                    <textarea name="requiredSkills" rows="3" placeholder="Java, Spring Boot, SQL" value={formData.requiredSkills} onChange={handleCreateChange} />
                  </div>
                  <div className="form-card full">
                    <label>Eligibility</label>
                    <textarea name="eligibleDepartments" rows="2" placeholder="IT, CSE" value={formData.eligibleDepartments} onChange={handleCreateChange} />
                  </div>
                </div>

                <Button
                  variant="primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                  type="submit"
                  disabled={creating}
                >
                  {creating ? 'Posting...' : 'Post Opportunity'}
                </Button>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </PageWrapper>
  );
};

export default Opportunities;
